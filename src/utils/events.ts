import { createEffect } from "solid-js";
import { ViewPort, xy } from "src/types";

export const snapToGrid = (value: number, gridSize: number): number => {
        return Math.round(value / gridSize) * gridSize;
};

export const clientToCanvasCoords = (
        clientX: number,
        clientY: number,
        viewport: ViewPort,
        containerRect: DOMRect | null,
): xy | null => {
        if (!containerRect) return null;

        return {
                x: (clientX - containerRect.left - viewport.x) / viewport.zoom,
                y: (clientY - containerRect.top - viewport.y) / viewport.zoom,
        };
};

export const calculateDelta = (
        currentClient: number,
        startClient: number,
        zoom: number,
        gridSize?: number,
): number => {
        const delta = (currentClient - startClient) / zoom;
        return gridSize ? snapToGrid(delta, gridSize) : delta;
};

export const disableUserSelect = (): void => {
        document.documentElement.style.userSelect = "none";
};

export const enableUserSelect = (): void => {
        document.documentElement.style.userSelect = "auto";
};

export interface DragHandlerConfig<T> {
        onStart?: (e: PointerEvent) => T | void;
        onMove: (e: PointerEvent, startData: T) => void;
        onEnd?: (e: PointerEvent, startData: T) => void;
        preventDefault?: boolean;
        stopPropagation?: boolean;
        disableSelection?: boolean;
}

export const createDragHandler = <T>(config: DragHandlerConfig<T>) => {
        let dragging = false;
        let startData: T | undefined;
        let pointerId: number | null = null;
        let el: HTMLElement | null = null;

        let controller: AbortController | null = null;

        const handleMove = (e: PointerEvent) => {
                if (
                        !dragging ||
                        startData === undefined ||
                        e.pointerId !== pointerId
                )
                        return;
                if (config.preventDefault) e.preventDefault();
                config.onMove(e, startData);
        };

        const handleEnd = (e: PointerEvent) => {
                if (!dragging || e.pointerId !== pointerId) return;
                dragging = false;

                if (config.preventDefault) e.preventDefault();
                if (config.onEnd && startData !== undefined) {
                        config.onEnd(e, startData);
                }

                if (config.disableSelection) {
                        enableUserSelect();
                }
                controller?.abort();
                controller = null;

                if (el && el.hasPointerCapture(e.pointerId)) {
                        el.releasePointerCapture(e.pointerId);
                }

                // window.removeEventListener("pointermove", handleMove);
                // window.removeEventListener("pointerup", handleEnd);
                // window.removeEventListener("pointercancel", handleEnd);

                pointerId = null;
                el = null;
        };

        const onPointerDown = (e: PointerEvent) => {
                if (dragging) return;

                const result = config.onStart?.(e);

                if (result === undefined) return;

                if (config.stopPropagation) e.stopPropagation();
                if (config.preventDefault) e.preventDefault();

                dragging = true;
                startData = result as T;
                pointerId = e.pointerId;

                if (config.disableSelection) {
                        disableUserSelect();
                }
                controller = new AbortController();

                const target = e.currentTarget as HTMLElement;
                if (target && target.setPointerCapture) {
                        target.setPointerCapture(e.pointerId);
                        el = target;
                }

                window.addEventListener("pointermove", handleMove, {
                        signal: controller.signal,
                });
                window.addEventListener("pointerup", handleEnd, {
                        signal: controller.signal,
                });
                window.addEventListener("pointercancel", handleEnd, {
                        signal: controller.signal,
                });
        };

        return {
                onPointerDown,
        };
};

export function onConfigListener<
        T extends EventTarget,
        K extends keyof GlobalEventHandlersEventMap,
>(
        target: () => T | undefined,
        enabled: () => boolean,
        event: K,
        handler: (e: GlobalEventHandlersEventMap[K]) => void,
) {
        createEffect(() => {
                const el = target();
                if (!el) return;

                if (enabled()) {
                        el.addEventListener(event, handler as EventListener);
                } else {
                        el.removeEventListener(event, handler as EventListener);
                }
        });
}
