import type { StateType } from "./state";
import type { HelperType } from "./helper";
import { SolidKitxProps, xy } from "src/types";
import { reconcile } from "solid-js/store";
import { onConfigListener } from "src/utils/events";
import { batch, onCleanup, onMount } from "solid-js";

export type LogicType = {
        onPointerDown: (
                e: PointerEvent & { currentTarget: HTMLDivElement },
        ) => void;
};

export const SolidKitxLogic = (
        state: StateType,
        props: SolidKitxProps,
        helper?: HelperType,
): LogicType => {
        let startvp = { x: 0, y: 0, zoom: 1 };

        const pointers = new Map<number, xy>();
        let iniPinx = 0;
        const onPointerDown = (
                e: PointerEvent & { currentTarget: HTMLDivElement },
        ) => {
                if (state.kit.focus()) return;
                if ((e.target as HTMLElement).closest(".node")) return;

                pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });

                if (pointers.size === 1) {
                        startvp = state.kit.viewport();
                }

                if (pointers.size === 2) {
                        const [p1, p2] = Array.from(pointers.values());
                        if (p1 && p2) {
                                iniPinx = Math.hypot(p1.x - p2.x, p1.y - p2.y);
                        }
                }

                window.addEventListener("pointermove", onPointerMove);
                window.addEventListener("pointerup", onPointerUp);
                window.addEventListener("pointercancel", onPointerUp);
        };

        const onPointerMove = (e: PointerEvent) => {
                if (
                        !pointers.has(e.pointerId) ||
                        (props.disableHorizontalPan && props.disableVerticalPan)
                )
                        return;

                const prevPointer = pointers.get(e.pointerId);
                if (!prevPointer) return;

                pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });

                if (pointers.size === 2 && iniPinx > 0) {
                        e.preventDefault();

                        const [p1, p2] = Array.from(pointers.values());
                        if (!p1 || !p2) return;

                        const currentDist = Math.hypot(
                                p1.x - p2.x,
                                p1.y - p2.y,
                        );

                        const scale = currentDist / iniPinx;
                        const zoom = Math.max(
                                0.1,
                                Math.min(5, startvp.zoom * scale),
                        );

                        const centerX = (p1.x + p2.x) / 2;
                        const centerY = (p1.y + p2.y) / 2;

                        const rect =
                                state.containerRef?.getBoundingClientRect();
                        if (!rect) return;

                        const cursorX = centerX - rect.left;
                        const cursorY = centerY - rect.top;

                        const x =
                                cursorX -
                                (cursorX - startvp.x) * (zoom / startvp.zoom);
                        const y =
                                cursorY -
                                (cursorY - startvp.y) * (zoom / startvp.zoom);

                        state.kit.setViewport({ zoom, x, y });
                } else if (pointers.size === 1) {
                        const dx = props.disableHorizontalPan
                                ? 0
                                : e.clientX - prevPointer.x;
                        const dy = props.disableVerticalPan
                                ? 0
                                : e.clientY - prevPointer.y;

                        const prev = state.kit.viewport();
                        state.kit.setViewport({
                                ...prev,
                                x: prev.x + dx,
                                y: prev.y + dy,
                        });
                }
        };

        const onPointerUp = (e: PointerEvent) => {
                pointers.delete(e.pointerId);

                if (pointers.size === 0) {
                        if (startvp !== state.kit.viewport()) {
                                state.kit.updateViewport();
                        }
                        window.removeEventListener(
                                "pointermove",
                                onPointerMove,
                        );
                        window.removeEventListener("pointerup", onPointerUp);
                        window.removeEventListener(
                                "pointercancel",
                                onPointerUp,
                        );
                        iniPinx = 0;
                }
        };

        const onWheel = (e: WheelEvent) => {
                if (state.kit.focus()) return;
                e.preventDefault();

                const rect = (
                        e.currentTarget as HTMLDivElement
                ).getBoundingClientRect();
                const cx = e.clientX - rect.left;
                const cy = e.clientY - rect.top;

                const prev = state.kit.viewport();
                const oldZoom = prev.zoom;

                const newZoom = Math.max(
                        props.maxZoom ?? 0.1,
                        Math.min(
                                props.minZoom ?? 5,
                                oldZoom - e.deltaY * 0.001,
                        ),
                );

                const wx = (cx - prev.x) / oldZoom;
                const wy = (cy - prev.y) / oldZoom;

                const x = cx - wx * newZoom;
                const y = cy - wy * newZoom;

                state.kit.setViewport({ zoom: newZoom, x, y });
        };

        const onScrollEnd = () => {
                if (startvp !== state.kit.viewport()) {
                        state.kit.updateViewport();
                        startvp = state.kit.viewport();
                }
        };

        const updateRect = () => {
                if (state.containerRef) {
                        state.kit.container = state.containerRef;
                }
        };
        const onKeyDown = (e: KeyboardEvent) => {
                const selection = state.kit.selection;
                if (e.key === "Delete" && selection.length() > 0) {
                        const selectedConnections = selection.getConnections();
                        const selectedNodes = selection.getNodes();
                        state.kit.setConnections(
                                reconcile(
                                        state.kit.connections.filter(
                                                (c) =>
                                                        !selectedConnections.includes(
                                                                c.id,
                                                        ) &&
                                                        !selectedNodes.includes(
                                                                c.from.id,
                                                        ) &&
                                                        !selectedNodes.includes(
                                                                c.to.id,
                                                        ),
                                        ),
                                ),
                        );
                        state.kit.setNodes(
                                reconcile(
                                        state.kit.nodes.filter(
                                                (n) =>
                                                        !selectedNodes.includes(
                                                                n.id,
                                                        ),
                                        ),
                                ),
                        );
                        selectedConnections.length > 0 &&
                                state.kit.updateConnections();
                        selectedNodes.length > 0 && state.kit.updateNodes();
                        selection.clear();
                }
        };
        onConfigListener(
                () => state.containerRef,
                () => !props.disableZoom,
                "wheel",
                onWheel,
        );
        onConfigListener(
                () => window,
                () => !props.disableZoom,
                "scrollend",
                onScrollEnd,
        );
        onConfigListener(
                () => state.containerRef,
                () => !props.disableKeyboardShortcuts,
                "keydown",
                onKeyDown,
        );
        onMount(() => {
                updateRect();
        });

        onCleanup(() => {
                window.removeEventListener("scrollend", onScrollEnd);
                window.removeEventListener("pointermove", onPointerMove);
                window.removeEventListener("pointerup", onPointerUp);
                window.removeEventListener("pointercancel", onPointerUp);
        });
        return { onPointerDown };
};
