import { createEffect, createMemo, For, onCleanup, Show } from "solid-js";
import { Dynamic } from "solid-js/web";
import type { ComponentsType, NodeType } from "../types";
import { useKitContext } from "../lib/KitContext";
import Edge, { EdgePosition } from "./Edge";
import { createDragHandler, calculateDelta } from "../lib/eventUtils";

interface NodeProps {
        node: NodeType;
        components?: ComponentsType;
}

export const NodeComponent = ({ node, components }: NodeProps) => {
        const kit = useKitContext();
        const gridSize = createMemo(() => kit.gridSize());
        const type = createMemo(() => node.data?.component?.type);
        const component = createMemo<boolean>(() =>
                node.data?.component?.type
                        ? !!components![node.data!.component!.type!]
                        : false,
        );
        //
        const Toolbar = createMemo(() => !!components?.["node-toolbar"]);
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

        const dragHandler = createDragHandler<{
                x: number;
                y: number;
                clientX: number;
                clientY: number;
        }>({
                onStart: (e) => {
                        setSelected(true);
                        if (kit.focus()) {
                                e.stopPropagation();
                                return;
                        }

                        const clientX =
                                e instanceof MouseEvent
                                        ? e.clientX
                                        : e.touches[0]!.clientX;
                        const clientY =
                                e instanceof MouseEvent
                                        ? e.clientY
                                        : e.touches[0]!.clientY;

                        return {
                                x: node.x,
                                y: node.y,
                                clientX,
                                clientY,
                        };
                },
                onMove: (e, startData) => {
                        const clientX =
                                e instanceof MouseEvent
                                        ? e.clientX
                                        : e.touches[0]!.clientX;
                        const clientY =
                                e instanceof MouseEvent
                                        ? e.clientY
                                        : e.touches[0]!.clientY;

                        const zoom = kit.viewport().zoom;
                        const dx = calculateDelta(
                                clientX,
                                startData.clientX,
                                zoom,
                                gridSize(),
                        );
                        const dy = calculateDelta(
                                clientY,
                                startData.clientY,
                                zoom,
                                gridSize(),
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

        const onMouseDown = (
                e: MouseEvent & { currentTarget: HTMLDivElement },
        ) => {
                dragHandler.onMouseDown(e);
        };

        const onTouchStart = (
                e: TouchEvent & { currentTarget: HTMLDivElement },
        ) => {
                dragHandler.onTouchStart(e);
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
                        ontouchstart={onTouchStart}
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
                                                component={
                                                        components![
                                                        node.data!
                                                                .component!
                                                                .type!
                                                        ]
                                                }
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
