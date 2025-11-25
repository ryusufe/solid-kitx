import { createEffect, createMemo, For, onCleanup, Show } from "solid-js";
import { Dynamic } from "solid-js/web";
import type { ComponentsType, Kit, NodeType, ViewPort, xy } from "../../types";
import Edge, { EdgePosition } from "./Edge";
import { createDragHandler, calculateDelta } from "../../utils/events";

interface NodeProps {
        node: NodeType;
        components?: ComponentsType;
        kit: Kit;
}

const Node = ({ node, components = {}, kit }: NodeProps) => {
        const type = createMemo(() => node.data?.component?.type);
        const hasComponent = createMemo<boolean>(
                () =>
                        !!node.data?.component?.type &&
                        node.data.component.type in components,
        );
        //
        const Toolbar = createMemo(() => "node-toolbar" in components);
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

        const controller = new AbortController();

        const dragHandler = createDragHandler<
                {
                        clientX: number;
                        clientY: number;
                        gridSize: number;
                } & ViewPort
        >({
                onStart: (e) => {
                        setSelected(true);
                        if (kit.focus() || kit.disableNodeDrag) {
                                e.stopPropagation();
                                return;
                        }

                        return {
                                x: node.x,
                                y: node.y,
                                clientX: e.clientX,
                                clientY: e.clientY,
                                zoom: kit.viewport().zoom,
                                gridSize: kit.gridSize!,
                        };
                },
                onMove: (e, startData) => {
                        const clientX = e.clientX;
                        const clientY = e.clientY;

                        const dx = calculateDelta(
                                clientX,
                                startData.clientX,
                                startData.zoom,
                                startData.gridSize,
                        );
                        const dy = calculateDelta(
                                clientY,
                                startData.clientY,
                                startData.zoom,
                                startData.gridSize,
                        );

                        const x = startData.x + dx;
                        const y = startData.y + dy;

                        kit.setNodes((n: NodeType) => n.id === node.id, {
                                x,
                                y,
                        });
                },
                onEnd: (_, startData) => {
                        if (startData.x !== node.x || startData.y !== node.y) {
                                kit.updateNodes();
                        }
                },
                preventDefault: true,
        });

        const onPointerDown = (
                e: PointerEvent & { currentTarget: HTMLDivElement },
        ) => {
                dragHandler.onPointerDown(e);
        };

        createEffect(() => {
                if (!nodeDiv) return;

                if (selected()) {
                        nodeDiv.focus();
                        window.addEventListener("pointerdown", onClickOutside, {
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
                        window.removeEventListener(
                                "pointerdown",
                                onClickOutside,
                        );
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
                        onpointerdown={onPointerDown}
                        style={{
                                transform: `translate(${node.x}px, ${node.y}px)`,
                                width: `${node.width}px`,
                                height: `${node.height}px`,
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
                                                component={
                                                        components?.[
                                                                "node-toolbar"
                                                        ]
                                                }
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
                                                        type() && hasComponent()
                                                                ? "fit-content"
                                                                : "100%",
                                                position:
                                                        type() && hasComponent()
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
                        <Show when={type() && components && hasComponent()}>
                                <div
                                        class="node-component"
                                        style={{
                                                width: "100%",
                                                height: "100%",
                                        }}
                                >
                                        <Dynamic
                                                component={components![type()!]}
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

export default Node;
