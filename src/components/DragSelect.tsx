import { createSignal, Component, Show, onMount, onCleanup } from "solid-js";
import { Kit } from "src/types";
import { createDragHandler, clientToCanvasCoords } from "../lib/eventUtils";

interface props {
        kit: Kit;
}

const DragSelect: Component<props> = ({ kit }) => {
        const [isDragging, setIsDragging] = createSignal(false);
        let startPos = { x: 0, y: 0 };
        const [currentPos, setCurrentPos] = createSignal({ x: 0, y: 0 });

        const rect = () => {
                const a = startPos;
                const b = currentPos();
                return {
                        left: Math.min(a.x, b.x),
                        top: Math.min(a.y, b.y),
                        right: Math.max(a.x, b.x),
                        bottom: Math.max(a.y, b.y),
                        width: Math.abs(a.x - b.x),
                        height: Math.abs(a.y - b.y),
                };
        };

        function detectSelection() {
                const r = rect();
                const bounds = kit.container!.getBoundingClientRect();

                const hits: string[] = [];

                const elements =
                        kit.container!.querySelectorAll<HTMLElement>(
                                ".node, .connection",
                        );

                elements.forEach((el) => {
                        const box = el.getBoundingClientRect();

                        const vp = kit.viewport();

                        const elRect = {
                                left: (box.left - bounds.left - vp.x) / vp.zoom,
                                top: (box.top - bounds.top - vp.y) / vp.zoom,
                                right:
                                        (box.right - bounds.left - vp.x) /
                                        vp.zoom,
                                bottom:
                                        (box.bottom - bounds.top - vp.y) /
                                        vp.zoom,
                        };

                        const intersects = !(
                                elRect.left > r.right ||
                                elRect.right < r.left ||
                                elRect.top > r.bottom ||
                                elRect.bottom < r.top
                        );

                        if (intersects) {
                                const id = el.getAttribute("id");
                                if (id) hits.push(id);
                        }
                });

                kit.setSelectedItems(new Set(hits));
        }

        const dragHandler = createDragHandler<{ x: number; y: number }>({
                onStart: (e) => {
                        if (e.button !== 0) return;

                        const coords = clientToCanvasCoords(
                                e.clientX,
                                e.clientY,
                                kit.viewport(),
                                kit.container!.getBoundingClientRect(),
                        );

                        if (!coords) return;

                        startPos = coords;
                        setCurrentPos(coords);
                        setIsDragging(true);
                        return coords;
                },
                onMove: (e, _) => {
                        const coords = clientToCanvasCoords(
                                e.clientX,
                                e.clientY,
                                kit.viewport(),
                                kit.container!.getBoundingClientRect(),
                        );

                        if (!coords) return;

                        setCurrentPos(coords);
                },
                onEnd: () => {
                        setIsDragging(false);
                        detectSelection();
                },
                disableSelection: true,
        });

        onMount(() => {
                window.addEventListener(
                        "pointerdown",
                        dragHandler.onPointerDown,
                );
        });

        onCleanup(() => {
                window.removeEventListener(
                        "pointerdown",
                        dragHandler.onPointerDown,
                );
        });

        return (
                <Show when={isDragging()}>
                        <div
                                class="kit-selection-rect"
                                style={{
                                        position: "absolute",
                                        left: `${rect().left}px`,
                                        top: `${rect().top}px`,
                                        width: `${rect().width}px`,
                                        height: `${rect().height}px`,
                                        border: "1px solid rgb(var(--selection-rgb, 0,120,215))",
                                        "background-color":
                                                "rgba(var(--selection-rgb, 0,120,215), 0.3)",
                                }}
                        />
                </Show>
        );
};

export default DragSelect;
