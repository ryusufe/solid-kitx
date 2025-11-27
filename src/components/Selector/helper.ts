import { xy } from "src/types";
import type { SelectorProps } from ".";

export type HelperType = {
        startPos: xy;
};

export const SelectorHelper = (props: SelectorProps): HelperType => {
        let startPos = { x: 0, y: 0 };
        return {
                startPos,
        };
};

