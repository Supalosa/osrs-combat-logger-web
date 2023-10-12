import { useShallowEffect } from "@mantine/hooks";
import { useRef } from "react";

const PNG_PIXELS_PER_TILE = 4;
const TILES_PER_CHUNK = 8;
const CHUNKS_PER_REGION = 8;
const PNG_CHUNK_SIZE_PIXELS = TILES_PER_CHUNK * PNG_PIXELS_PER_TILE;

const PNG_REGION_TILE_SIZE_PIXELS =
    PNG_PIXELS_PER_TILE * CHUNKS_PER_REGION * TILES_PER_CHUNK;

const CANVAS_SCALE = 1;

const Unused = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useShallowEffect(() => {
        const ref = canvasRef.current;

        const context = ref?.getContext("2d");
        if (!context) {
            return;
        }
        const { canvas } = context;

        context.fillStyle = "#000000";
        context.fillRect(0, 0, canvas.width, canvas.height);

        const image = new Image();
        image.src = `https://cdn-osrs-combat-logs.netlify.app/1/region-13138.png`;
        const imageOffsetX = 128;
        const imageOffsetY = 32;
        const rotation = 3;

        image.onload = () => {
            let angle = (rotation * Math.PI) / 2;

            context.save();

            // crop
            if (true) {
                context.beginPath();
                context.rect(
                    canvas.width / 2 - PNG_CHUNK_SIZE_PIXELS / 2,
                    canvas.height / 2 - PNG_CHUNK_SIZE_PIXELS / 2,
                    PNG_CHUNK_SIZE_PIXELS,
                    PNG_CHUNK_SIZE_PIXELS
                );
                context.clip();
            }

            const middleX = imageOffsetX + PNG_CHUNK_SIZE_PIXELS / 2;
            const middleY = imageOffsetY - PNG_CHUNK_SIZE_PIXELS / 2;

            const scale = 1;

            context.translate(canvas.width / 2, canvas.height / 2);
            context.rotate(angle);
            context.scale(scale, scale);
            context.translate(-middleX, -middleY);

            context.drawImage(image, 0, 0);
            context.restore();
            context.strokeStyle = "#FF0000";
            context.strokeRect(
                canvas.width / 2 - (PNG_CHUNK_SIZE_PIXELS / 2) * scale,
                canvas.height / 2 - (PNG_CHUNK_SIZE_PIXELS / 2) * scale,
                PNG_CHUNK_SIZE_PIXELS * scale,
                PNG_CHUNK_SIZE_PIXELS * scale
            );
        };
    }, []);
};
