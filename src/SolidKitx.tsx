import { createMemo, For, JSX, onCleanup, onMount, Show } from "solid-js";
import {
        ComponentsType,
        ConnectionType,
        Kit,
        NodeType,
        ViewPort,
} from "./types";
import { NodeComponent } from "./Node/NodeComponent";
import { createKit } from "./lib/createKit";
import { KitContext } from "./lib/KitContext";
import ConnectionComponent from "./Connection/ConnectionComponent";
import ConnectionPreview from "./Connection/ConnectionPreview";
import { Controls } from "./components/Controls";
import DragSelect from "./components/DragSelect";

interface SolidKitProps {
        nodes: NodeType[];
        connections: ConnectionType[];
        viewport: ViewPort;
        onViewportChange: (vp: ViewPort) => void;
        onNodesChange: (nodes: NodeType[]) => void;
        onConnectionsChange: (connections: ConnectionType[]) => void;
        gridSize?: number;
        width?: number;
        height?: number;
        class?: string;
        children?: JSX.Element | ((kit: Kit) => JSX.Element);
        components?: ComponentsType;
}
export const SolidKitx = ({ gridSize = 30, ...props }: SolidKitProps) => {
        const kit = createKit({ ...props, gridSize });

        const attachMouseMove = (e: MouseEvent) => {
                const prev = kit.viewport();
                kit.setViewport({
                        ...prev,
                        x: prev.x + e.movementX,
                        y: prev.y + e.movementY,
                });
        };
        const vp = createMemo(() => kit.viewport());

        let startViewpoint = { x: 0, y: 0, zoom: 1 };
        const onMouseDown = (
                e: MouseEvent & { currentTarget: HTMLDivElement },
        ) => {
                if (kit.focus()) return;
                if ((e.target as HTMLElement).closest(".node")) return;
                startViewpoint = kit.viewport();
                window.addEventListener("mousemove", attachMouseMove);
                window.addEventListener("mouseup", detachMouseMove, {
                        once: true,
                });
        };

        const detachMouseMove = () => {
                if (kit.viewport() !== startViewpoint) kit.updateViewport();
                window.removeEventListener("mousemove", attachMouseMove);
        };

        const onWheel = (e: WheelEvent & { currentTarget: HTMLDivElement }) => {
                if (kit.focus()) return;
                e.preventDefault();

                const rect = e.currentTarget.getBoundingClientRect();
                const cursorX = e.clientX - rect.left;
                const cursorY = e.clientY - rect.top;

                const prev = kit.viewport();
                const oldZoom = prev.zoom;
                const zoom = Math.max(
                        0.1,
                        Math.min(5, oldZoom - e.deltaY * 0.001),
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
                if (startViewpoint !== kit.viewport()) {
                        kit.updateViewport();
                        startViewpoint = kit.viewport();
                }
        };

        let containerRef!: HTMLDivElement;
        const updateRect = () => {
                if (containerRef) {
                        kit.containerRect =
                                containerRef.getBoundingClientRect();
                }
        };

        const onKeyDown = (e: KeyboardEvent) => {
                const selected = kit.selectedItems();
                if (e.key === "Delete" && selected.size > 0) {
                        kit.setConnections((prev: ConnectionType[]) =>
                                prev.filter(
                                        (c) =>
                                                !selected.has(c.id) &&
                                                !selected.has(c.from.id) &&
                                                !selected.has(c.to.id),
                                ),
                        );
                        kit.setNodes((prev: NodeType[]) =>
                                prev.filter((n) => !selected.has(n.id)),
                        );
                        kit.updateNodes();
                        kit.updateConnections();
                }
        };
        ///
        let touchCache: Touch[] = [];
        let pinchStartDist = 0;
        let pinchStartZoom = 1;
        let initialViewport = { x: 0, y: 0, zoom: 1 };
        const getDistance = (touches: TouchList) => {
                const [t1, t2] = touches;
                if (!t1 || !t2) return 0;
                return Math.hypot(
                        t1.clientX - t2.clientX,
                        t1.clientY - t2.clientY,
                );
        };
        const onTouchStart = (
                e: TouchEvent & { currentTarget: HTMLDivElement },
        ) => {
                if (kit.focus()) return;
                if ((e.target as HTMLElement).closest(".node")) return;
                for (const touch of Array.from(e.touches)) {
                        const el = document.elementFromPoint(
                                touch.clientX,
                                touch.clientY,
                        );
                        if (el?.closest(".node")) {
                                return;
                        }
                }
                if (e.touches.length > 1) {
                        e.preventDefault();
                }
                initialViewport = kit.viewport();
                touchCache = Array.from(e.touches);
                // z
                if (e.touches.length === 2) {
                        pinchStartDist = getDistance(e.touches);
                        pinchStartZoom = initialViewport.zoom;
                }
                window.addEventListener("touchmove", onTouchMove, {
                        passive: false,
                });
                window.addEventListener("touchend", onTouchEnd, { once: true });
                window.addEventListener("touchcancel", onTouchEnd, {
                        once: true,
                });
        };
        const onTouchMove = (e: TouchEvent) => {
                const currentTouches = Array.from(e.touches);
                const touchCount = currentTouches.length;
                // zomming
                if (touchCount === 2) {
                        e.preventDefault();
                        const dist = getDistance(e.touches);
                        const scale = dist / pinchStartDist;
                        const zoom = Math.max(
                                0.1,
                                Math.min(5, pinchStartZoom * scale),
                        );
                        const rect = (
                                e.currentTarget as HTMLDivElement
                        ).getBoundingClientRect();
                        const centerX =
                                (currentTouches[0]!.clientX +
                                        currentTouches[1]!.clientX) /
                                2;
                        const centerY =
                                (currentTouches[0]!.clientY +
                                        currentTouches[1]!.clientY) /
                                2;
                        const cursorX = centerX - rect.left;
                        const cursorY = centerY - rect.top;
                        const x =
                                cursorX -
                                (cursorX - initialViewport.x) *
                                (zoom / initialViewport.zoom);
                        const y =
                                cursorY -
                                (cursorY - initialViewport.y) *
                                (zoom / initialViewport.zoom);
                        kit.setViewport({
                                zoom,
                                x,
                                y,
                        });
                        return;
                }
                // dragging
                if (touchCount === 1) {
                        e.preventDefault();
                        const currentTouch = currentTouches[0];
                        const previousTouch = touchCache[0];
                        if (previousTouch) {
                                const dx =
                                        currentTouch!.clientX -
                                        previousTouch.clientX;
                                const dy =
                                        currentTouch!.clientY -
                                        previousTouch.clientY;
                                const prev = kit.viewport();
                                kit.setViewport({
                                        ...prev,
                                        x: prev.x + dx,
                                        y: prev.y + dy,
                                });
                        }
                }
                touchCache = currentTouches;
        };

        const onTouchEnd = () => {
                if (kit.viewport() !== initialViewport) {
                        kit.updateViewport();
                }
                window.removeEventListener("touchmove", onTouchMove);
                window.removeEventListener("touchend", onTouchEnd);
                window.removeEventListener("touchcancel", onTouchEnd);
                touchCache = [];
                pinchStartDist = 0;
                pinchStartZoom = 1;
        };

        onMount(() => {
                window.addEventListener("scrollend", onScrollEnd);
                updateRect();
                window.addEventListener("resize", updateRect);
                window.addEventListener("keydown", onKeyDown);
        });

        onCleanup(() => {
                window.removeEventListener("scrollend", onScrollEnd);
                window.removeEventListener("mousemove", attachMouseMove);
                window.removeEventListener("resize", updateRect);
                window.removeEventListener("keydown", onKeyDown);
                window.removeEventListener("touchmove", onTouchMove);
        });

        return (
                <KitContext.Provider value={kit}>
                        <div
                                ref={containerRef}
                                class="solid-kitx"
                                style={{
                                        "--bg-vp-zoom": `${vp().zoom * 1.2}px`,
                                        "background-size": `${gridSize * vp().zoom
                                                }px ${gridSize * vp().zoom}px`,
                                        "background-position": `${vp().x}px ${vp().y
                                                }px`,
                                        "background-repeat": "repeat",
                                }}
                                onmousedown={onMouseDown}
                                onwheel={onWheel}
                                ontouchstart={onTouchStart}
                                ontouchmove={(e) => e.preventDefault()}
                        >
                                <div
                                        class="container"
                                        style={{
                                                "transform-origin": "0 0",
                                                transform: `translate(${vp().x
                                                        }px, ${vp().y}px) scale(${vp().zoom
                                                        })`,
                                                position: "relative",
                                        }}
                                >
                                        <Show when={kit.focus()}>
                                                <DragSelect
                                                        containerRef={
                                                                containerRef
                                                        }
                                                        kit={kit}
                                                />
                                        </Show>
                                        <For each={kit.connections}>
                                                {(connection) => (
                                                        <ConnectionComponent
                                                                connection={
                                                                        connection
                                                                }
                                                                Toolbar={
                                                                        props
                                                                                .components?.[
                                                                        "connection-toolbar"
                                                                        ]
                                                                }
                                                        />
                                                )}
                                        </For>

                                        <Show
                                                when={kit.activeConnectionDestination()}
                                        >
                                                <ConnectionPreview kit={kit} />
                                        </Show>

                                        <For each={kit.nodes}>
                                                {(node) => (
                                                        <NodeComponent
                                                                node={node}
                                                                components={
                                                                        props.components
                                                                }
                                                        />
                                                )}
                                        </For>
                                </div>
                                {typeof props.children === "function"
                                        ? props.children(kit)
                                        : props.children}
                                <Controls kit={kit} />
                        </div>
                </KitContext.Provider>
        );
};
