import { PreviewProps } from ".";
import type { StateType } from "./state";
import type { LogicType } from "./logic";
import type { HelperType } from "./helper";

export const PreviewView = (
        state: StateType,
        logic: LogicType,
        props: PreviewProps,
        helper?: HelperType,
) => {
        return (
                <svg
                        style={{
                                "z-index": 0,
                                overflow: "visible",
                                position: "absolute",
                        }}
                        stroke="currentColor"
                >
                        <g
                                tabindex={"0"}
                                class={`connection connection-preview`}
                        >
                                <path
                                        d={state.path()}
                                        fill="none"
                                        style={{
                                                "stroke-width":
                                                        "var(--connection-width, 2)",
                                        }}
                                />
                        </g>
                </svg>
        );
};

