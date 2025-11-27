import { SelectorProps } from ".";
import type { StateType } from "./state";
import type { LogicType } from "./logic";
import type { HelperType } from "./helper";
import { Show } from "solid-js";

export const SelectorView = (
        state: StateType,
        logic: LogicType,
        props: SelectorProps,
        helper?: HelperType,
) => {
        return (
                <Show when={state.isDragging() && props.kit.focus()}>
                        <div
                                class="kit-selection-rect"
                                style={{
                                        position: "absolute",
                                        left: `${state.rectOnScreen().left}px`,
                                        top: `${state.rectOnScreen().top}px`,
                                        width: `${
                                                state.rectOnScreen().width
                                        }px`,
                                        height: `${
                                                state.rectOnScreen().height
                                        }px`,
                                        border: "1px solid rgb(var(--selection-rgb, 0,120,215))",
                                        "background-color":
                                                "rgba(var(--selection-rgb, 0,120,215), 0.3)",
                                }}
                        />
                </Show>
        );
};

