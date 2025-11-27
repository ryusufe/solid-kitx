import { ConnectionProps } from ".";
import type { StateType } from "./state";
import type { LogicType } from "./logic";
import type { HelperType } from "./helper";
import { Show } from "solid-js";
import { Dynamic } from "solid-js/web";

export const ConnectionView = (
        state: StateType,
        logic: LogicType,
        props: ConnectionProps,
        helper?: HelperType,
) => {
        return (
                <>
                        <svg
                                class={`connection-svg ${
                                        props.connection.class ?? ""
                                }`}
                                style={{
                                        "z-index": 0,
                                        overflow: "visible",
                                        position: "absolute",
                                }}
                                stroke="currentColor"
                                ondblclick={() => logic.setLabel("Test")}
                        >
                                <g
                                        ref={state.connectionRef}
                                        data-id={props.connection.id}
                                        class={`connection ${
                                                props.connection.class ?? ""
                                        }`}
                                        classList={{
                                                selected: state.selected(),
                                        }}
                                        style={{
                                                outline: 0,
                                                ...props.connection.style,
                                        }}
                                        on:pointerdown={logic.onpointerdown}
                                >
                                        <path
                                                d={state.path()}
                                                fill="none"
                                                style={""}
                                        />
                                        <path
                                                d={state.path()}
                                                stroke-width="20"
                                                stroke="transparent"
                                                fill="none"
                                        />
                                </g>
                        </svg>

                        <Show when={props.Toolbar && state.selected()}>
                                <div
                                        ref={state.toolbarRef}
                                        class="connection-toolbar"
                                        style={{
                                                "--mid-x": state.mid().x + "px",
                                                "--mid-y": state.mid().y + "px",
                                                position: "absolute",
                                                left: "calc(var(--mid-x) + var(--left, 0px))",
                                                top: "calc(var(--mid-y) + var(--top, -2em))",
                                                transform: "translate(-50%, -50%)",
                                        }}
                                >
                                        <Dynamic
                                                component={props.Toolbar}
                                                kit={props.kit}
                                                connection={props.connection}
                                        />
                                </div>
                        </Show>
                        <Show when={props.connection.label !== undefined}>
                                <span
                                        class="connection-label"
                                        onBlur={(e) => {
                                                const value =
                                                        e.currentTarget.innerText.trim()
                                                                .length === 0
                                                                ? undefined
                                                                : e
                                                                          .currentTarget
                                                                          .innerText;

                                                logic.setLabel(value);
                                        }}
                                        onKeyDown={(e) => {
                                                if (e.key === "Enter")
                                                        e.currentTarget.blur();
                                        }}
                                        style={{
                                                position: "absolute",
                                                "z-index": 1000,
                                                transform: "translate(-50%, -50%)",
                                                left: state.mid().x + "px",
                                                top: state.mid().y + "px",
                                        }}
                                        contenteditable="true"
                                >
                                        {props.connection.label}
                                </span>
                        </Show>
                </>
        );
};

