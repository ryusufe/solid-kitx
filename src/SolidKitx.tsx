import {
        children,
        createEffect,
        createMemo,
        For,
        on,
        onCleanup,
        onMount,
        Show,
} from "solid-js";
import { ConnectionType, NodeType, SolidKitProps, xy } from "./types";
import Node from "./components/Node/Node";
import { createKit } from "./core/createKit";
import Connection from "./components/Connection/Connection";
import ConnectionPreview from "./components/Connection/ConnectionPreview";
import { reconcile } from "solid-js/store";
import { onConfigListener } from "./utils/events";

export const SolidKitx = (props: SolidKitProps) => {
        const kit = createKit(props);
        const Children = () => {
                const c = props.children;
                return typeof c === "function" ? c(kit) : c;
        };

        const vp = createMemo(() => kit.viewport());

        let startvp = { x: 0, y: 0, zoom: 1 };

        const pointers = new Map<number, xy>();
        // pinch
        let iniPinx = 0;
        const onPointerDown = (
                e: PointerEvent & { currentTarget: HTMLDivElement },
        ) => {
                if (kit.focus()) return;
                if ((e.target as HTMLElement).closest(".node")) return;

                pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });

                if (pointers.size === 1) {
                        startvp = kit.viewport();
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
                if (!pointers.has(e.pointerId)) return;

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

                        const rect = containerRef?.getBoundingClientRect();
                        if (!rect) return;

                        const cursorX = centerX - rect.left;
                        const cursorY = centerY - rect.top;

                        const x =
                                cursorX -
                                (cursorX - startvp.x) * (zoom / startvp.zoom);
                        const y =
                                cursorY -
                                (cursorY - startvp.y) * (zoom / startvp.zoom);

                        kit.setViewport({ zoom, x, y });
                } else if (pointers.size === 1) {
                        const dx = e.clientX - prevPointer.x;
                        const dy = e.clientY - prevPointer.y;

                        const prev = kit.viewport();
                        kit.setViewport({
                                ...prev,
                                x: prev.x + dx,
                                y: prev.y + dy,
                        });
                }
        };

        const onPointerUp = (e: PointerEvent) => {
                pointers.delete(e.pointerId);

                if (pointers.size === 0) {
                        if (startvp !== kit.viewport()) {
                                kit.updateViewport();
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
                if (kit.focus()) return;
                e.preventDefault();

                const rect = (
                        e.target as HTMLDivElement
                ).getBoundingClientRect();
                const cursorX = e.clientX - rect.left;
                const cursorY = e.clientY - rect.top;

                const prev = kit.viewport();
                const oldZoom = prev.zoom;
                const newZoom = oldZoom - e.deltaY * 0.001;
                const zoom = Math.max(
                        props.maxZoom ?? 0.1,
                        Math.min(props.minZoom ?? 5, newZoom),
                );

                const x = cursorX - ((cursorX - prev.x) / oldZoom) * zoom;
                const y = cursorY - ((cursorY - prev.y) / oldZoom) * zoom;
                kit.setViewport({
                        zoom,
                        x,
                        y,
                });
        };

        const onScrollEnd = () => {
                if (startvp !== kit.viewport()) {
                        kit.updateViewport();
                        startvp = kit.viewport();
                }
        };

        let containerRef!: HTMLDivElement;
        const updateRect = () => {
                if (containerRef) {
                        kit.container = containerRef;
                }
        };
        const onKeyDown = (e: KeyboardEvent) => {
                const selected = kit.selectedItems();
                if (e.key === "Delete" && selected.size > 0) {
                        kit.setConnections(
                                reconcile(
                                        kit.connections.filter(
                                                (c) =>
                                                        !selected.has(c.id) &&
                                                        !selected.has(
                                                                c.from.id,
                                                        ) &&
                                                        !selected.has(c.to.id),
                                        ),
                                ),
                        );
                        kit.setNodes(
                                reconcile(
                                        kit.nodes.filter(
                                                (n) => !selected.has(n.id),
                                        ),
                                ),
                        );
                        kit.updateNodes();
                        kit.updateConnections();
                        selected.clear();
                        kit.setSelectedItems(selected);
                }
        };
        onConfigListener(
                () => containerRef,
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
                () => containerRef,
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

        return (
                <div
                        ref={containerRef}
                        class="solid-kitx"
                        onpointerdown={onPointerDown}
                        tabindex={0}
                        autofocus
                        style={{ outline: "none" }}
                >
                        <div
                                class="container"
                                style={{
                                        "transform-origin": "0 0",
                                        transform: `translate(${vp().x}px, ${
                                                vp().y
                                        }px) scale(${vp().zoom})`,
                                }}
                        >
                                <For each={kit.connections}>
                                        {(connection) => (
                                                <Connection
                                                        connection={connection}
                                                        Toolbar={
                                                                props
                                                                        .components?.[
                                                                        "connection-toolbar"
                                                                ]
                                                        }
                                                        kit={kit}
                                                />
                                        )}
                                </For>

                                <Show when={kit.activeConnectionDestination()}>
                                        <ConnectionPreview kit={kit} />
                                </Show>

                                <For each={kit.nodes}>
                                        {(node) => (
                                                <Node
                                                        node={node}
                                                        components={
                                                                props.components
                                                        }
                                                        kit={kit}
                                                />
                                        )}
                                </For>
                        </div>
                        <Children />
                </div>
        );
};
