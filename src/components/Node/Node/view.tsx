import { NodeProps } from ".";
import type { StateType } from "./state";
import type { LogicType } from "./logic";
import type { HelperType } from "./helper";
import { For, Show } from "solid-js";
import { Dynamic } from "solid-js/web";
import { NodeType } from "src/types";
import { Edge, EdgePosition } from "../Edge";

export const NodeView = (
        state: StateType,
        logic: LogicType,
        props: NodeProps,
        helper?: HelperType,
) => {
        return (
                <div
                        ref={state.nodeDiv}
                        class={`node ${props.node.class ?? ""} `}
                        classList={{ selected: state.selected() }}
                        data-id={props.node.id}
                        on:pointerdown={logic.onPointerDown}
                        style={{
                                transform: `translate(${props.node.x}px, ${props.node.y}px)`,
                                width: `${props.node.width}px`,
                                height: `${props.node.height}px`,
                                "--node-cursor": props.kit.focus()
                                        ? "auto"
                                        : "grab",
                                ...props.node.style,
                        }}
                >
                        <Show when={state.Toolbar() && state.selected()}>
                                <div
                                        class="node-toolbar"
                                        style={{
                                                position: "absolute",
                                                top: "var(--top, 0)",
                                                left: "var(--left, calc(100% + 1em))",
                                        }}
                                        onPointerDown={(e) => {
                                                console.log("p-down");
                                                e.stopPropagation();
                                        }}
                                >
                                        <Dynamic
                                                component={
                                                        props.components?.[
                                                                "node-toolbar"
                                                        ]
                                                }
                                                kit={props.kit}
                                                node={props.node}
                                        />
                                </div>
                        </Show>
                        <Show when={props.node.data?.label}>
                                <span
                                        class="node-label"
                                        style={{
                                                "--size":
                                                        state.type() &&
                                                        state.hasComponent()
                                                                ? "fit-content"
                                                                : "100%",
                                                position:
                                                        state.type() &&
                                                        state.hasComponent()
                                                                ? "absolute"
                                                                : "static",
                                                top: "-2em",
                                                left: 0,
                                                width: "var(--size)",
                                                height: "var(--size)",
                                                display: "flex",
                                                "align-items": "center",
                                                "justify-content": "center",
                                                outline: "none",
                                        }}
                                        onBlur={(e) => {
                                                const value =
                                                        e.currentTarget.innerText.trim()
                                                                .length === 0
                                                                ? undefined
                                                                : e
                                                                          .currentTarget
                                                                          .innerText;

                                                props.kit.setNodes(
                                                        (n: NodeType) =>
                                                                n.id ===
                                                                props.node.id,
                                                        "data",
                                                        "label",
                                                        value,
                                                );
                                                props.kit.updateNodes();
                                        }}
                                        onKeyDown={(e) => {
                                                if (e.key === "Escape")
                                                        e.currentTarget.blur();
                                        }}
                                        contenteditable="true"
                                >
                                        {props.node.data?.label}
                                </span>
                        </Show>
                        <Show
                                when={
                                        state.type() &&
                                        props.components &&
                                        state.hasComponent()
                                }
                        >
                                <div
                                        class="node-component"
                                        style={{
                                                width: "100%",
                                                height: "100%",
                                        }}
                                >
                                        <Dynamic
                                                component={
                                                        props.components![
                                                                state.type()!
                                                        ]
                                                }
                                                node={props.node}
                                                kit={props.kit}
                                        />
                                </div>
                        </Show>
                        <For
                                each={
                                        [
                                                "left",
                                                "top",
                                                "right",
                                                "bottom",
                                                "tl",
                                                "tr",
                                                "br",
                                                "bl",
                                        ] as EdgePosition[]
                                }
                        >
                                {(side) => (
                                        <Edge
                                                side={side}
                                                node={props.node}
                                                kit={props.kit}
                                        />
                                )}
                        </For>
                </div>
        );
};
