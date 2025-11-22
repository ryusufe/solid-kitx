export const snapToGrid = (value: number, gridSize: number): number => {
        return Math.round(value / gridSize) * gridSize;
};

export const clientToCanvasCoords = (
        clientX: number,
        clientY: number,
        viewport: { x: number; y: number; zoom: number },
        containerRect: DOMRect | null,
): { x: number; y: number } | null => {
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

const isSingleTouch = (e: TouchEvent): boolean => {
        return e.touches.length === 1;
};

export const getTouchCoords = (
        e: TouchEvent,
): { x: number; y: number } | null => {
        if (!isSingleTouch(e)) return null;
        const touch = e.touches[0];
        if (!touch) return null;
        return { x: touch.clientX, y: touch.clientY };
};

export const disableUserSelect = (): void => {
        document.documentElement.style.userSelect = "none";
};

export const enableUserSelect = (): void => {
        document.documentElement.style.userSelect = "auto";
};

export interface DragHandlerConfig<T> {
        onStart?: (e: MouseEvent | TouchEvent) => T | void;
        onMove: (e: MouseEvent | TouchEvent, startData: T) => void;
        onEnd?: (e: MouseEvent | TouchEvent, startData: T) => void;
        preventDefault?: boolean;
        stopPropagation?: boolean;
        disableSelection?: boolean;
}

export const createDragHandler = <T>(config: DragHandlerConfig<T>) => {
        let dragging = false;
        let startData: T | undefined;
        let controller: AbortController | null = null;

        const handleMove = (e: MouseEvent | TouchEvent) => {
                if (!dragging || startData === undefined) return;
                if (config.preventDefault) e.preventDefault();
                config.onMove(e, startData);
        };

        const handleEnd = (e: MouseEvent | TouchEvent) => {
                if (!dragging) return;
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
        };

        const onMouseDown = (e: MouseEvent) => {
                const result = config.onStart?.(e);

                if (result === undefined) return;

                if (config.stopPropagation) e.stopPropagation();
                if (config.preventDefault) e.preventDefault();

                dragging = true;
                startData = result as T;

                if (config.disableSelection) {
                        disableUserSelect();
                }

                controller = new AbortController();

                window.addEventListener("mousemove", handleMove as EventListener, {
                        signal: controller.signal,
                });
                window.addEventListener("mouseup", handleEnd as EventListener, {
                        once: true,
                        signal: controller.signal,
                });
        };

        const onTouchStart = (e: TouchEvent) => {
                if (!isSingleTouch(e)) return;

                const result = config.onStart?.(e);

                if (result === undefined) return;

                if (config.stopPropagation) e.stopPropagation();
                if (config.preventDefault) e.preventDefault();

                dragging = true;
                startData = result as T;

                if (config.disableSelection) {
                        disableUserSelect();
                }

                controller = new AbortController();

                window.addEventListener("touchmove", handleMove as EventListener, {
                        signal: controller.signal,
                });
                window.addEventListener("touchend", handleEnd as EventListener, {
                        once: true,
                        signal: controller.signal,
                });
        };

        return {
                onMouseDown,
                onTouchStart,
        };
};
