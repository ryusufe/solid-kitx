import { NodeProps } from ".";
import type { StateType } from "./state";
import type { HelperType } from "./helper";
import { calculateDelta, createDragHandler } from "src/utils/events";
import { NodeType, ViewPort } from "src/types";
import { createEffect, on, onCleanup } from "solid-js";

export type LogicType = {
        onPointerDown: (
                e: PointerEvent & { currentTarget: HTMLDivElement },
        ) => void;
};

export const NodeLogic = (
        state: StateType,
        props: NodeProps,
        helper?: HelperType,
): LogicType => {
        const controller = new AbortController();
        const setSelected = (value: boolean) => {
                const current = props.kit.selection;
                if (value) {
                        current.addItem(props.node.id, "node");
                } else {
                        current.removeItem(props.node.id, "node");
                }
        };

        const dragHandler = createDragHandler<
                {
                        clientX: number;
                        clientY: number;
                        gridSize: number;
                } & ViewPort
        >({
                onStart: (e) => {
                        return {
                                x: props.node.x,
                                y: props.node.y,
                                clientX: e.clientX,
                                clientY: e.clientY,
                                zoom: props.kit.viewport().zoom,
                                gridSize: props.kit.configs.gridSize!,
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

                        props.kit.setNodes(
                                (n: NodeType) => n.id === props.node.id,
                                {
                                        x,
                                        y,
                                },
                        );
                },
                onEnd: (_, startData) => {
                        if (
                                startData.x !== props.node.x ||
                                startData.y !== props.node.y
                        ) {
                                props.kit.updateNodes();
                        }
                },
                preventDefault: true,
        });

        const onPointerDown = (
                e: PointerEvent & { currentTarget: HTMLDivElement },
        ) => {
                e.stopPropagation();
                setSelected(true);
                if (
                        e.button === 2 ||
                        props.kit.configs.disableNodeDrag ||
                        props.kit.focus()
                )
                        return;
                dragHandler.onPointerDown(e);
        };

        createEffect(
                on(
                        state.selected,
                        () => {
                                if (!state.nodeDiv) return;
                                if (state.selected()) {
                                        state.nodeDiv.focus();
                                        window.addEventListener(
                                                "pointerdown",
                                                onClickOutside,
                                                {
                                                        signal: controller.signal,
                                                },
                                        );
                                        window.addEventListener(
                                                "keydown",
                                                onKeyDown,
                                                {
                                                        signal: controller.signal,
                                                },
                                        );
                                } else if (
                                        state.nodeDiv.classList.contains(
                                                "selected",
                                        )
                                ) {
                                        state.nodeDiv.blur();
                                }
                        },
                        { defer: true },
                ),
        );

        const onClickOutside = (e: MouseEvent) => {
                const target = e.target as Node;
                if (
                        state.nodeDiv &&
                        !state.nodeDiv.contains(target) &&
                        !e.ctrlKey
                ) {
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
        return { onPointerDown };
};
