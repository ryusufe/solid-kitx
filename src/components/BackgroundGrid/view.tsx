import { BackgroundGridProps } from ".";
import type { StateType } from "./state";
import type { LogicType } from "./logic";
import type { HelperType } from "./helper";

export const BackgroundGridView = (
        state: StateType,
        logic: LogicType,
        props: BackgroundGridProps,
        helper?: HelperType,
) => {
        return (
                <svg
                        class="background-grid"
                        style={{
                                position: "absolute",
                                width: "100%",
                                height: "100%",
                        }}
                >
                        <pattern
                                id="grid-pattern"
                                x={state.vp().x + state.dif() / 2}
                                y={state.vp().y + state.dif() / 2}
                                width={state.dif()}
                                height={state.dif()}
                                patternUnits="userSpaceOnUse"
                        >
                                <circle
                                        fill="currentColor"
                                        cx={state.vp().zoom}
                                        cy={state.vp().zoom}
                                        r={state.vp().zoom}
                                ></circle>
                        </pattern>
                        <rect
                                x="0"
                                y="0"
                                width="100%"
                                height="100%"
                                fill="url(#grid-pattern)"
                        ></rect>
                </svg>
        );
};

