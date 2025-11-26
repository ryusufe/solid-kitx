import {
        createSignal,
        Component,
        Show,
        onMount,
        onCleanup,
        createEffect,
} from "solid-js";
import { Kit, xy } from "../types";
import { createDragHandler, clientToCanvasCoords } from "../utils/events";

interface props {
        kit: Kit;
}

export const Selector: Component<props> = ({ kit }) => {
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
        const rectOnScreen = () => {
                const r = rect();
                const vp = kit.viewport();
                return {
                        left: r.left * vp.zoom,
                        top: r.top * vp.zoom,
                        width: r.width * vp.zoom,
                        height: r.height * vp.zoom,
                };
        };

        function detectSelection() {
                const r = rect();
                if (r.width < 5 || r.height < 5) return;
                console.log("d");
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
                                const id = el.getAttribute("id");
                                if (id) hits.push(id);
                        }
                });
                kit.setSelectedItems(new Set(hits));
        }

        const dragHandler = createDragHandler<xy>({
                onStart: (e) => {
                        if (e.button !== 0) return;

                        const coords = clientToCanvasCoords(
                                e.clientX,
                                e.clientY,
                                { ...kit.viewport(), x: 0, y: 0 },
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
                                { ...kit.viewport(), x: 0, y: 0 },
                                kit.container!.getBoundingClientRect(),
                        );

                        if (!coords) return;

                        setCurrentPos(coords);
                },
                onEnd: (_, xy) => {
                        setIsDragging(false);
                        detectSelection();
                },
                disableSelection: true,
        });
        const onPointerDown = (e: PointerEvent) => {
                if (!kit.focus()) return;
                dragHandler.onPointerDown(e);
        };

        onMount(() => {
                kit.container?.addEventListener("pointerdown", onPointerDown);
        });

        onCleanup(() => {
                kit.container?.removeEventListener(
                        "pointerdown",
                        onPointerDown,
                );
        });

        return (
                <Show when={isDragging() && kit.focus()}>
                        <div
                                class="kit-selection-rect"
                                style={{
                                        position: "absolute",
                                        left: `${rectOnScreen().left}px`,
                                        top: `${rectOnScreen().top}px`,
                                        width: `${rectOnScreen().width}px`,
                                        height: `${rectOnScreen().height}px`,
                                        border: "1px solid rgb(var(--selection-rgb, 0,120,215))",
                                        "background-color":
                                                "rgba(var(--selection-rgb, 0,120,215), 0.3)",
                                }}
                        />
                </Show>
        );
};
