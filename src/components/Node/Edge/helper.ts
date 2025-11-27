import { Position } from "src/types";
import type { EdgeProps } from ".";

export type HelperType = {
        isCorner: boolean;
        cursor: string;
        single: { axis: string; sign: number; cursor: string };
};

export const EdgeHelper = (props?: EdgeProps): HelperType => {
        const isCorner = ["tl", "tr", "bl", "br"].includes(props?.side!);
        const single = {
                top: { axis: "y", sign: -1, cursor: "ns-resize" },
                bottom: { axis: "y", sign: 1, cursor: "ns-resize" },
                left: { axis: "x", sign: -1, cursor: "ew-resize" },
                right: { axis: "x", sign: 1, cursor: "ew-resize" },
        }[props?.side! as Position];

        const cursor = isCorner
                ? props?.side === "tl" || props?.side === "br"
                        ? "nwse-resize"
                        : "nesw-resize"
                : single?.cursor ?? "default";
        return {
                isCorner,
                cursor,
                single,
        };
};

