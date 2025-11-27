import { AnchorPointProps } from ".";
import { HelperType } from "./helper";

export type StateType = {
        anchorRef: HTMLDivElement;
};

export const createAnchorPointState = (
        props?: AnchorPointProps,
        helper?: HelperType,
): StateType => {
        let anchorRef!: HTMLDivElement;
        return { anchorRef };
};
