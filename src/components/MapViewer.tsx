import { useMemo, useState } from "react";
import { LogLine, LogTypes } from "../logs/Log";
import { Button, Container, Flex } from "@mantine/core";
import { InstanceState, MapComponent, Chunk } from "./MapComponent";

const PNG_PIXELS_PER_TILE = 4;
const TILES_PER_CHUNK = 8;
const CHUNKS_PER_REGION = 8;

const PNG_REGION_TILE_SIZE_PIXELS =
    PNG_PIXELS_PER_TILE * CHUNKS_PER_REGION * TILES_PER_CHUNK;

type MapViewerProps = {
    entries: LogLine[];
};

export const MapViewer = (props: MapViewerProps) => {
    const { entries } = props;

    const [instanceIndex, setInstanceIndex] = useState(0);

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
        <Flex direction="column">
            <Container>
                <Button
                    onClick={() => {
                        if (instanceIndex > 0) {
                            setInstanceIndex(instanceIndex - 1);
                        }
                    }}
                >
                    Decrement {instanceIndex}
                </Button>
                <Button
                    onClick={() => {
                        if (instanceIndex < knownChunks.length) {
                            setInstanceIndex(instanceIndex + 1);
                        }
                    }}
                >
                    Increment {instanceIndex}
                </Button>
            </Container>
            <MapComponent
                instance={knownChunks[instanceIndex]}
                width={800}
                height={600}
                x={0}
                y={0}
                plane={3}
            />
        </Flex>
    );
};
