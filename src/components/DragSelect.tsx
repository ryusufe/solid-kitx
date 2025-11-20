import {
        createSignal,
        onCleanup,
        createEffect,
        Component,
        Show,
        onMount,
} from "solid-js";
import { Kit } from "src/types";

interface props {
        containerRef: HTMLDivElement;
        kit: Kit;
}
const DragSelect: Component<props> = ({ containerRef, kit }) => {
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

        function getRelativePoint(e: MouseEvent) {
                const bounds = containerRef!.getBoundingClientRect();
                const vp = kit.viewport();
                return {
                        x: (e.clientX - bounds.left - vp.x) / vp.zoom,
                        y: (e.clientY - bounds.top - vp.y) / vp.zoom,
                };
        }

        function onMouseDown(e: MouseEvent) {
                if (e.button !== 0) return;
                window.addEventListener("mouseup", onMouseUp, { once: true });
                const p = getRelativePoint(e);
                startPos = p;
                setCurrentPos(p);
                setIsDragging(true);
                document.documentElement.style.userSelect = "none";
        }

        function onMouseMove(e: MouseEvent) {
                if (!isDragging()) return;
                setCurrentPos(getRelativePoint(e));
        }

        function onMouseUp() {
                if (!isDragging()) return;
                setIsDragging(false);
                document.documentElement.style.userSelect = "auto";
                detectSelection();
        }

        createEffect(() => {
                if (isDragging()) {
                        window.addEventListener("mousemove", onMouseMove);
                } else {
                        window.removeEventListener("mousemove", onMouseMove);
                }
        });

        function detectSelection() {
                const r = rect();
                const bounds = containerRef!.getBoundingClientRect();

                const hits: string[] = [];

                const elements =
                        containerRef!.querySelectorAll<HTMLElement>(
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

        onMount(() => {
                window.addEventListener("mousedown", onMouseDown);
        });
        onCleanup(() => {
                window.removeEventListener("mousemove", onMouseMove);
                window.removeEventListener("mouseup", onMouseUp);
                window.removeEventListener("mousedown", onMouseDown);
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
