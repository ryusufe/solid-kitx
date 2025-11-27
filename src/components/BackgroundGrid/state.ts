import { Accessor, createMemo } from "solid-js";
import { BackgroundGridProps } from ".";
import type { HelperType } from "./helper";
import { ViewPort } from "src/types";

export type StateType = {
        grid: Accessor<number>;
        vp: Accessor<ViewPort>;
        dif: Accessor<number>;
};

export const createBackgroundGridState = (
        props: BackgroundGridProps,
        helper?: HelperType,
): StateType => {
        const grid = createMemo(
                () => props.absoluteGrid ?? props.kit.configs.gridSize ?? 30,
        );
        const vp = createMemo(() => props.kit.viewport());
        const dif = createMemo(() => grid() * vp().zoom);

        return { grid, vp, dif };
};

