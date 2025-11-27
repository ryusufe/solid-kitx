import { Accessor, createMemo } from "solid-js";
import { PreviewProps } from ".";
import type { HelperType } from "./helper";
import { createPath } from "src/utils/path";
import { Position, PositionList, xy } from "src/types";

export type StateType = {
        path: Accessor<string>;
};

export const createPreviewState = (
        props: PreviewProps,
        helper?: HelperType,
): StateType => {
        const start = props.kit.activeConnectionDestination() as xy;
        const startPos = props.kit.activeConnection.from!.side;
        const path = createMemo(() => {
                return createPath({
                        start,
                        startPos,
                        end: props.kit.activeConnectionDestination() as xy,
                        endPos:
                                props.kit.activeConnection.to?.side ??
                                (PositionList[
                                        PositionList.indexOf(startPos) ^ 1
                                ] as Position) ??
                                "top",
                });
        });
        return { path };
};
