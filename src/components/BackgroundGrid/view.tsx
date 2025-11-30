import { BackgroundGridProps } from ".";
import type { StateType } from "./state";
import type { LogicType } from "./logic";
import type { HelperType } from "./helper";
import { Match, Switch } from "solid-js";

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
                                <Switch>
                                        <Match when={props.type === "dash"}>
                                                <line
                                                        stroke="currentColor"
                                                        stroke-dasharray={`${state.dashWidth()}`}
                                                        x1={
                                                                -state.dashWidth() /
                                                                2
                                                        }
                                                        y1={0}
                                                        x2={
                                                                state.grid() *
                                                                state.vp().zoom
                                                        }
                                                        y2={0}
                                                />
                                                <line
                                                        stroke="currentColor"
                                                        stroke-dasharray={`${state.dashWidth()}`}
                                                        x1={0}
                                                        y1={
                                                                -state.dashWidth() /
                                                                2
                                                        }
                                                        x2={0}
                                                        y2={
                                                                state.grid() *
                                                                state.vp().zoom
                                                        }
                                                />
                                        </Match>
                                        <Match
                                                when={
                                                        !props.type ||
                                                        props.type === "dot"
                                                }
                                        >
                                                <circle
                                                        fill="currentColor"
                                                        cx={state.vp().zoom}
                                                        cy={state.vp().zoom}
                                                        r={state.vp().zoom}
                                                ></circle>
                                        </Match>
                                </Switch>
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
