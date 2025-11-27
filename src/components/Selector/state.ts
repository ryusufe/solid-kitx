import { Accessor, createMemo, createSignal, Setter } from "solid-js";
import { SelectorProps } from ".";
import type { HelperType } from "./helper";
import { xy } from "src/types";
import { create } from "domain";

type ltwh = {
        left: number;
        top: number;
        width: number;
        height: number;
};
export type StateType = {
        isDragging: Accessor<boolean>;
        setIsDragging: Setter<boolean>;
        currentPos: Accessor<xy>;
        setCurrentPos: Setter<xy>;
        rectOnScreen: Accessor<ltwh>;
        rect: Accessor<ltwh & { right: number; bottom: number }>;
};

export const createSelectorState = (
        props: SelectorProps,
        helper?: HelperType,
): StateType => {
        const [isDragging, setIsDragging] = createSignal(false);
        const [currentPos, setCurrentPos] = createSignal({ x: 0, y: 0 });
        const rect = createMemo(() => {
                const a = helper?.startPos!;
                const b = currentPos();
                return {
                        left: Math.min(a.x, b.x),
                        top: Math.min(a.y, b.y),
                        right: Math.max(a.x, b.x),
                        bottom: Math.max(a.y, b.y),
                        width: Math.abs(a.x - b.x),
                        height: Math.abs(a.y - b.y),
                };
        });
        const rectOnScreen = createMemo(() => {
                const r = rect();
                const vp = props.kit.viewport();
                return {
                        left: r.left * vp.zoom,
                        top: r.top * vp.zoom,
                        width: r.width * vp.zoom,
                        height: r.height * vp.zoom,
                };
        });

        return {
                isDragging,
                currentPos,
                setCurrentPos,
                setIsDragging,
                rectOnScreen,
                rect,
        };
};

