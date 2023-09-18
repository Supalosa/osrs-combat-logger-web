import { useShallowEffect } from "@mantine/hooks";
import { useRef } from "react";

const PNG_PIXELS_PER_TILE = 4;
const TILES_PER_CHUNK = 8;
const CHUNKS_PER_REGION = 8;
const PNG_CHUNK_SIZE_PIXELS = TILES_PER_CHUNK * PNG_PIXELS_PER_TILE;

const PNG_REGION_TILE_SIZE_PIXELS =
    PNG_PIXELS_PER_TILE * CHUNKS_PER_REGION * TILES_PER_CHUNK;

const CANVAS_SCALE = 1;

export type Chunk = {
    x: number;
    y: number;
    rotation: number;
    plane: number;
    present: boolean;
    regionId: number;
    // offset from the top left of the region tile
    imageOffsetX: number;
    imageOffsetY: number;
};

export type InstanceState = {
    // Chunks[Plane][X][Y]
    chunks: Chunk[][][];
};

type MapComponentProps = {
    instance: InstanceState;
    width: number;
    height: number;
    x: number;
    y: number;
    plane: number;
};

export const MapComponent = (props: MapComponentProps) => {
    const { instance, width, height, x, y, plane } = props;
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const canvasScale = 1;

    useShallowEffect(() => {
        const ref = canvasRef.current;

        const context = ref?.getContext("2d");
        if (!context) {
            return;
        }
        const { canvas } = context;

        const drawTile = (
            plane: number,
            regionId: number,
            imageOffsetX: number,
            imageOffsetY: number,
            canvasX: number,
            canvasY: number,
            rotation: number,
            scale: number
        ) => {
            const image = new Image();
            image.src = `https://cdn-osrs-combat-logs.netlify.app/${plane}/region-${regionId}.png`;

            image.onload = () => {
                let angle = (rotation * Math.PI) / 2;

                context.save();

                // crop
                if (true) {
                    context.beginPath();
                    context.rect(
                        canvasX - (PNG_CHUNK_SIZE_PIXELS / 2) * scale,
                        canvasY - (PNG_CHUNK_SIZE_PIXELS / 2) * scale,
                        PNG_CHUNK_SIZE_PIXELS * scale,
                        PNG_CHUNK_SIZE_PIXELS * scale
                    );
                    context.clip();
                }

                // middle of the chunk
                const middleX = imageOffsetX + PNG_CHUNK_SIZE_PIXELS / 2;
                const middleY = imageOffsetY - PNG_CHUNK_SIZE_PIXELS / 2;

                context.translate(canvasX, canvasY);
                context.rotate(angle);
                context.scale(scale, scale);
                context.translate(-middleX, -middleY);

                context.drawImage(image, 0, 0);
                context.restore();

                if (false) {
                    context.strokeStyle = "#FF0000";
                    context.strokeRect(
                        canvasX - (PNG_CHUNK_SIZE_PIXELS / 2) * scale,
                        canvasY - (PNG_CHUNK_SIZE_PIXELS / 2) * scale,
                        PNG_CHUNK_SIZE_PIXELS * scale,
                        PNG_CHUNK_SIZE_PIXELS * scale
                    );
                }
            };
        };

        context.fillStyle = "#000000";
        context.fillRect(0, 0, canvas.width, canvas.height);

        /*drawTile(1, 13138, 128, 32, canvas.width / 2, canvas.height / 2, 3, 1);
        drawTile(
            1,
            13138,
            128,
            64,
            canvas.width / 2 + 32,
            canvas.height / 2,
            3,
            1
        );*/

        const planeData = instance.chunks[plane];

        const originX = 0;
        const originY = canvas.height;
        const instanceWidthChunks = planeData.length;
        const instanceHeightChunks = planeData[0].length;

        for (let xx = 0; xx < planeData.length; ++xx) {
            for (let yy = 0; yy < planeData.length; ++yy) {
                const {
                    imageOffsetX,
                    imageOffsetY,
                    regionId,
                    plane,
                    rotation,
                    present,
                } = planeData[xx][yy];
                if (present) {
                    drawTile(
                        plane,
                        regionId,
                        imageOffsetX,
                        imageOffsetY,
                        originX + xx * PNG_CHUNK_SIZE_PIXELS * canvasScale,
                        originY - yy * PNG_CHUNK_SIZE_PIXELS * canvasScale,
                        rotation,
                        canvasScale
                    );
                }
            }
        }

        context.strokeStyle = "#999999";
        context.strokeRect(
            originX,
            originY,
            instanceWidthChunks * PNG_CHUNK_SIZE_PIXELS * canvasScale,
            -instanceHeightChunks * PNG_CHUNK_SIZE_PIXELS * canvasScale
        );
    }, [instance, x, y, plane]);

    return <canvas ref={canvasRef} width={width} height={height} />;
};
