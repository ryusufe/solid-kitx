import { createEffect, createMemo, For, onCleanup, Show } from "solid-js";
import { Dynamic } from "solid-js/web";
import type { ComponentsType, NodeType } from "../types";
import { useKitContext } from "../lib/KitContext";
import Edge, { EdgePosition } from "./Edge";

interface NodeProps {
        node: NodeType;
        components?: ComponentsType;
}

export const NodeComponent = ({ node, components }: NodeProps) => {
        const kit = useKitContext();
        const gridSize = createMemo(() => kit.gridSize());
        const type = createMemo(() => node.data?.component?.type);
        const component = createMemo(() =>
                node.data?.component?.type
                        ? components![node.data!.component!.type!]
                        : null,
        );
        //
        const Toolbar = createMemo(() => components?.["node-toolbar"]);
        //
        const selected = createMemo(() => {
                if (!kit) return false;
                const selectedSet = kit.selectedItems();
                return selectedSet.has(node.id);
        });

        const setSelected = (value: boolean) => {
                const current = new Set(kit.selectedItems());
                if (value) {
                        current.add(node.id);
                } else {
                        current.delete(node.id);
                }
                kit.setSelectedItems(current);
        };

        let nodeDiv!: HTMLDivElement;

        let startMouse = { x: 0, y: 0 };
        let startPos = { x: 0, y: 0 };
        let dragging = false;
        const controller = new AbortController();

        const onMouseDown = (
                e: MouseEvent & { currentTarget: HTMLDivElement },
        ) => {
                setSelected(true);
                if (kit.focus()) {
                        e.stopPropagation();
                        return;
                }
                e.preventDefault();
                dragging = true;
                startMouse = { x: e.clientX, y: e.clientY };
                const { x, y, ..._ } = node;
                startPos = { x, y };
                window.addEventListener("mousemove", onMouseMove, {
                        signal: controller.signal,
                });
                window.addEventListener("mouseup", onMouseUp, {
                        once: true,
                        signal: controller.signal,
                });
        };

        const onMouseMove = (e: MouseEvent) => {
                if (!dragging) return;

                const zoom = kit.viewport().zoom;
                const dx = (e.clientX - startMouse.x) / zoom;
                const dy = (e.clientY - startMouse.y) / zoom;

                const x = startPos.x + Math.round(dx / gridSize()) * gridSize();
                const y = startPos.y + Math.round(dy / gridSize()) * gridSize();

                kit.setNodes((n: NodeType) => n.id === node.id, { x, y });
        };

        const onMouseUp = () => {
                dragging = false;
                if (startPos.x !== node.x || startPos.y !== node.y) {
                        kit.updateNodes();
                }
                window.removeEventListener("mousemove", onMouseMove);
        };

        createEffect(() => {
                if (!nodeDiv) return;

                if (selected()) {
                        nodeDiv.focus();
                        window.addEventListener("mousedown", onClickOutside, {
                                signal: controller.signal,
                        });
                        window.addEventListener("keydown", onKeyDown, {
                                signal: controller.signal,
                        });
                } else if (nodeDiv.classList.contains("selected")) {
                        nodeDiv.blur();
                }
        });

        const onClickOutside = (e: MouseEvent) => {
                const target = e.target as Node;
                if (nodeDiv && !nodeDiv.contains(target) && !e.ctrlKey) {
                        setSelected(false);
                        window.removeEventListener("mousedown", onClickOutside);
                        window.removeEventListener("keydown", onKeyDown);
                }
        };
        const onKeyDown = (e: KeyboardEvent) => {
                if (e.key === "Escape") {
                        setSelected(false);
                        window.removeEventListener("keydown", onKeyDown);
                }
        };

        onCleanup(() => {
                controller.abort();
        });

        return (
                <div
                        ref={nodeDiv}
                        class={`node ${node.class ?? ""} `}
                        classList={{ selected: selected() }}
                        id={node.id}
                        tabIndex={"0"}
                        onmousedown={onMouseDown}
                        style={{
                                left: `${node.x}px`,
                                top: `${node.y}px`,
                                width: `${node.width || 4 * gridSize()}px`,
                                height: `${node.height || 2 * gridSize()}px`,
                                cursor: kit.focus() ? "auto" : "grab",
                                ...node.style,
                        }}
                >
                        <Show when={Toolbar() && selected()}>
                                <div
                                        class="node-toolbar"
                                        style={{
                                                position: "absolute",
                                                top: "var(--top, 0)",
                                                left: "var(--left, calc(100% + 1em))",
                                        }}
                                >
                                        <Dynamic
                                                component={Toolbar()}
                                                kit={kit}
                                                node={node}
                                        />
                                </div>
                        </Show>
                        <Show when={node.data?.label}>
                                <span
                                        class="node-label"
                                        style={{
                                                "--size":
                                                        type() && component()
                                                                ? "fit-content"
                                                                : "100%",
                                                position:
                                                        type() && component()
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

                                                kit.setNodes(
                                                        (n: NodeType) =>
                                                                n.id ===
                                                                node.id,
                                                        "data",
                                                        "label",
                                                        value,
                                                );
                                                kit.updateNodes();
                                                console.log(
                                                        kit.nodes.find(
                                                                (i) =>
                                                                        i.id ===
                                                                        node.id,
                                                        )?.data?.label,
                                                );
                                        }}
                                        onKeyDown={(e) => {
                                                if (e.key === "Escape")
                                                        e.currentTarget.blur();
                                        }}
                                        contenteditable="true"
                                >
                                        {node.data?.label}
                                </span>
                        </Show>
                        <Show when={type() && components && component()}>
                                <div
                                        class="node-component"
                                        style={{
                                                width: "100%",
                                                height: "100%",
                                        }}
                                >
                                        <Dynamic
                                                component={component()}
                                                {...node.data?.component?.props}
                                                node={node}
                                                kit={kit}
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
                                                node={node}
                                                kit={kit}
                                        />
                                )}
                        </For>
                </div>
        );
};
