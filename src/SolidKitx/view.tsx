import type { StateType } from "./state";
import type { LogicType } from "./logic";
import type { HelperType } from "./helper";
import { SolidKitxProps } from "src/types";
import { For, Show } from "solid-js";
import { Connection } from "src/components/Connection/Connection";
import { Preview } from "src/components/Connection/Preview";
import { Node } from "src/components/Node/Node";

export const SolidKitxView = (
        state: StateType,
        logic: LogicType,
        props: SolidKitxProps,
        helper?: HelperType,
) => {
        const Children = state.Children;
        return (
                <div
                        ref={state.containerRef}
                        class="solid-kitx"
                        onpointerdown={logic.onPointerDown}
                        tabindex={0}
                        autofocus
                        style={{ outline: "none" }}
                >
                        <Children />
                        <div
                                class="container"
                                style={{
                                        "transform-origin": "0 0",
                                        transform: `translate(${
                                                state.vp().x
                                        }px, ${state.vp().y}px) scale(${
                                                state.vp().zoom
                                        })`,
                                }}
                        >
                                <For each={state.kit.connections}>
                                        {(connection) => (
                                                <Connection
                                                        connection={connection}
                                                        Toolbar={
                                                                props
                                                                        .components?.[
                                                                        "connection-toolbar"
                                                                ]
                                                        }
                                                        kit={state.kit}
                                                />
                                        )}
                                </For>

                                <Show
                                        when={state.kit.activeConnectionDestination()}
                                >
                                        <Preview kit={state.kit} />
                                </Show>

                                <For each={state.kit.nodes}>
                                        {(node) => (
                                                <Node
                                                        node={node}
                                                        components={
                                                                props.components
                                                        }
                                                        kit={state.kit}
                                                />
                                        )}
                                </For>
                        </div>
                </div>
        );
};
