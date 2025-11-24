import { Position, xy } from "../types";

interface PathOptions {
        start: xy;
        startPos: Position;
        end: xy;
        endPos: Position;
        curve?: number;
}

export function createPath({
        start,
        startPos,
        end,
        endPos,
        curve = 9,
}: PathOptions): string {
        const offset = (dist: number) =>
                dist > 0
                        ? 0.5 * dist
                        : dist === 0
                        ? curve * 5
                        : curve * Math.sqrt(-dist);
        const computeControl = (
                pos: Position,
                A: xy,
                B: xy,
        ): [number, number] => {
                if (pos === "left") return [A.x - offset(A.x - B.x), A.y];
                if (pos === "right") return [A.x + offset(B.x - A.x), A.y];
                if (pos === "top") return [A.x, A.y - offset(A.y - B.y)];
                return [A.x, A.y + offset(B.y - A.y)];
        };

        const [controlStartX, controlStartY] = computeControl(
                startPos,
                start,
                end,
        );

        const [controlEndX, controlEndY] = computeControl(endPos, end, start);

        return `M${start.x},${start.y} C${controlStartX},${controlStartY} ${controlEndX},${controlEndY} ${end.x},${end.y}`;
}
