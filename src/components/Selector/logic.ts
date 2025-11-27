import { SelectorProps } from ".";
import type { StateType } from "./state";
import type { HelperType } from "./helper";
import { clientToCanvasCoords, createDragHandler } from "src/utils/events";
import { xy } from "src/types";
import { onCleanup, onMount } from "solid-js";

export type LogicType = {};

export const SelectorLogic = (
        state: StateType,
        props: SelectorProps,
        helper?: HelperType,
): LogicType => {
        function detectSelection() {
                const r = state.rect();
                if (r.width < 5 || r.height < 5) return;
                const bounds = props.kit.container!.getBoundingClientRect();
                const hits: string[] = [];

                const elements =
                        props.kit.container!.querySelectorAll<HTMLElement>(
                                ".node, .connection",
                        );

                elements.forEach((el) => {
                        const box = el.getBoundingClientRect();

                        const vp = props.kit.viewport();

                        const elRect = {
                                left: (box.left - bounds.left) / vp.zoom,
                                top: (box.top - bounds.top) / vp.zoom,
                                right: (box.right - bounds.left) / vp.zoom,
                                bottom: (box.bottom - bounds.top) / vp.zoom,
                        };

                        const intersects = !(
                                elRect.left > r.right ||
                                elRect.right < r.left ||
                                elRect.top > r.bottom ||
                                elRect.bottom < r.top
                        );

                        if (intersects) {
                                const id = el.getAttribute("data-id");
                                if (id) hits.push(id);
                        }
                });
                props.kit.setSelectedItems(new Set(hits));
        }

        const dragHandler = createDragHandler<xy>({
                onStart: (e) => {
                        if (e.button !== 0) return;

                        const coords = clientToCanvasCoords(
                                e.clientX,
                                e.clientY,
                                { ...props.kit.viewport(), x: 0, y: 0 },
                                props.kit.container!.getBoundingClientRect(),
                        );

                        if (!coords) return;

                        helper && (helper.startPos = coords);
                        state.setCurrentPos(coords);
                        state.setIsDragging(true);
                        return coords;
                },
                onMove: (e, _) => {
                        const coords = clientToCanvasCoords(
                                e.clientX,
                                e.clientY,
                                { ...props.kit.viewport(), x: 0, y: 0 },
                                props.kit.container!.getBoundingClientRect(),
                        );

                        if (!coords) return;

                        state.setCurrentPos(coords);
                },
                onEnd: (_, xy) => {
                        state.setIsDragging(false);
                        detectSelection();
                },
                disableSelection: true,
        });
        const onPointerDown = (e: PointerEvent) => {
                if (!props.kit.focus()) return;
                dragHandler.onPointerDown(e);
        };
        onMount(() => {
                props.kit.container?.addEventListener(
                        "pointerdown",
                        onPointerDown,
                );
        });

        onCleanup(() => {
                props.kit.container?.removeEventListener(
                        "pointerdown",
                        onPointerDown,
                );
        });
        return {};
};

