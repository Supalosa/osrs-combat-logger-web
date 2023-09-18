import { useMemo, useRef } from "react";
import { LogLine, LogTypes } from "../logs/Log";
import { Container, Table } from "@mantine/core";
import { range, useShallowEffect } from "@mantine/hooks";
import { InstanceState, MapComponent, Chunk } from "./MapComponent";

const PNG_PIXELS_PER_TILE = 4;
const TILES_PER_CHUNK = 8;
const CHUNKS_PER_REGION = 8;
const PNG_CHUNK_SIZE_PIXELS = TILES_PER_CHUNK * PNG_PIXELS_PER_TILE;

const PNG_REGION_TILE_SIZE_PIXELS =
    PNG_PIXELS_PER_TILE * CHUNKS_PER_REGION * TILES_PER_CHUNK;

const CANVAS_SCALE = 2;

type MapViewerProps = {
    entries: LogLine[];
};

export const MapViewer = (props: MapViewerProps) => {
    const { entries } = props;

    const knownChunks = useMemo(() => {
        const instanceLogLines = entries?.filter(
            (entry) => entry.type === LogTypes.LOG_INSTANCE_TEMPLATE
        );

        const result: InstanceState[] = [];
        for (const entry of instanceLogLines) {
            const chunks: Chunk[][][] = [];
            const templates = entry.payload.instanceTemplates;
            for (let plane = 0; plane < templates.length; ++plane) {
                if (chunks[plane] === undefined) {
                    chunks[plane] = [];
                }
                for (let x = 0; x < templates[plane].length; ++x) {
                    if (chunks[plane][x] === undefined) {
                        chunks[plane][x] = [];
                    }
                    for (let y = 0; y < templates[plane][x].length; ++y) {
                        const data = templates[plane][x][y];
                        const rotation = (data >> 1) & 0x3;
                        const chunkY = ((data >> 3) & 0x7ff) << 3;
                        const chunkX = ((data >> 14) & 0x3ff) << 3;
                        const chunkPlane = (data >> 24) & 0x3;
                        const regionId = (chunkX >> 6) * 256 + (chunkY >> 6);
                        // subtract the offset of the start of the chunk.
                        // then multiply by 4 for pixels in the tiles
                        const offsetX =
                            PNG_PIXELS_PER_TILE *
                            (chunkX - ((chunkX >> 6) << 6));
                        const offsetY =
                            PNG_PIXELS_PER_TILE *
                            (chunkY - ((chunkY >> 6) << 6));
                        const chunk: Chunk = {
                            x: chunkX,
                            y: chunkY,
                            rotation,
                            plane: chunkPlane,
                            present: data > 0,
                            regionId,
                            imageOffsetX: offsetX,
                            imageOffsetY: PNG_REGION_TILE_SIZE_PIXELS - offsetY,
                        };
                        chunks[plane][x][y] = chunk;
                    }
                }
            }
            result.push({ chunks });
        }

        return result;
    }, [entries]);
    return (
        <>
            <MapComponent
                instance={knownChunks[0]}
                width={800}
                height={600}
                x={0}
                y={0}
                plane={3}
            />
        </>
    );
};

type ChunkProps = {
    chunk: Chunk;
};

const Chunk = (props: ChunkProps) => {
    const { chunk } = props;

    const canvasRef = useRef<HTMLCanvasElement>(null);

    useShallowEffect(() => {
        const {
            regionId,
            imageOffsetX,
            imageOffsetY,
            rotation,
            plane,
            present,
        } = chunk;
        const ref = canvasRef.current;

        const context = ref?.getContext("2d");
        if (!context) {
            return;
        }
        const { canvas } = context;

        context.fillStyle = "#000000";
        context.fillRect(0, 0, canvas.width, canvas.height);
        if (!present) {
            return;
        }

        const image = new Image();
        image.src = `https://cdn-osrs-combat-logs.netlify.app/${plane}/region-${regionId}.png`;

        image.onload = () => {
            // rotation 0 = 0 degrees
            // rotation 1 = rotate 90 degrees counter clockwise
            // rotation 2 = 180 degrees ccw
            // rotation 3 = 270 degrees ccw
            const angle = (rotation * Math.PI) / 2;

            context.save();
            context.beginPath();
            context.rect(
                canvas.width / 2 - (PNG_CHUNK_SIZE_PIXELS / 2) * CANVAS_SCALE,
                canvas.height / 2 - (PNG_CHUNK_SIZE_PIXELS / 2) * CANVAS_SCALE,
                PNG_CHUNK_SIZE_PIXELS * CANVAS_SCALE,
                PNG_CHUNK_SIZE_PIXELS * CANVAS_SCALE
            );
            context.clip();

            const middleX = imageOffsetX + PNG_CHUNK_SIZE_PIXELS / 2;
            const middleY = imageOffsetY - PNG_CHUNK_SIZE_PIXELS / 2;

            // Where to place it
            context.translate(canvas.width / 2, canvas.height / 2);
            context.rotate(angle);
            context.scale(CANVAS_SCALE, CANVAS_SCALE);
            // Where to rotate from
            context.translate(-middleX, -middleY);

            context.drawImage(image, 0, 0);

            context.restore();
            /*context.strokeStyle = "#FF0000";
            context.strokeRect(
                0,
                0,
                PNG_CHUNK_SIZE_PIXELS,
                PNG_CHUNK_SIZE_PIXELS
            );*/
        };
    }, [chunk]);

    return (
        <div>
            {false && chunk.present && (
                <>
                    <div>
                        {chunk.x},{chunk.y} @ {chunk.plane} rotated at{" "}
                        {chunk.rotation}
                    </div>
                    <div>
                        {chunk.imageOffsetX},{chunk.imageOffsetY}
                    </div>
                    <div>{chunk.regionId}</div>
                </>
            )}
            {
                <canvas
                    ref={canvasRef}
                    width={PNG_CHUNK_SIZE_PIXELS * CANVAS_SCALE}
                    height={PNG_CHUNK_SIZE_PIXELS * CANVAS_SCALE}
                />
            }
        </div>
    );
};
