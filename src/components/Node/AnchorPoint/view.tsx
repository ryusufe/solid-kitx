import { AnchorPointProps } from ".";
import type { StateType } from "./state";
import type { LogicType } from "./logic";
import { HelperType } from "./helper";

export const AnchorPointView = (
        state: StateType,
        logic: LogicType,
        props: AnchorPointProps,
        helper?: HelperType,
) => {
        return (
                <div
                        ref={state.anchorRef}
                        class="node-anchor"
                        on:pointerdown={logic.onPointerDown}
                ></div>
        );
};
