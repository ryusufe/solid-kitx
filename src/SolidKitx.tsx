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

        const vp = createMemo(() => kit.viewport());

        let startvp = { x: 0, y: 0, zoom: 1 };

        const pointers = new Map<number, { x: number; y: number }>();
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
                if (startvp !== kit.viewport()) {
                        kit.updateViewport();
                        startvp = kit.viewport();
                }
        };

        let containerRef!: HTMLDivElement;
        const updateRect = () => {
                if (containerRef) {
                        // console.log("deb");
                        kit.container = containerRef;
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

        onMount(() => {
                window.addEventListener("scrollend", onScrollEnd);
                updateRect();
                window.addEventListener("keydown", onKeyDown);
        });

        onCleanup(() => {
                window.removeEventListener("scrollend", onScrollEnd);
                window.removeEventListener("pointermove", onPointerMove);
                window.removeEventListener("pointerup", onPointerUp);
                window.removeEventListener("pointercancel", onPointerUp);
                window.removeEventListener("keydown", onKeyDown);
        });

        return (
                <div
                        ref={containerRef}
                        class="solid-kitx"
                        style={{
                                "--bg-vp-zoom": `${vp().zoom * 1.2}px`,
                                "background-size": `${gridSize * vp().zoom}px ${
                                        gridSize * vp().zoom
                                }px`,
                                "background-position": `${vp().x}px ${
                                        vp().y
                                }px`,
                                "background-repeat": "repeat",
                        }}
                        onpointerdown={onPointerDown}
                        onwheel={onWheel}
                >
                        <div
                                class="container"
                                style={{
                                        "transform-origin": "0 0",
                                        transform: `translate(${vp().x}px, ${
                                                vp().y
                                        }px) scale(${vp().zoom})`,
                                        position: "relative",
                                }}
                        >
                                <Show when={kit.focus()}>
                                        <DragSelect kit={kit} />
                                </Show>
                                <For each={kit.connections}>
                                        {(connection) => (
                                                <ConnectionComponent
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
                                                <NodeComponent
                                                        node={node}
                                                        components={
                                                                props.components
                                                        }
                                                        kit={kit}
                                                />
                                        )}
                                </For>
                        </div>
                        {typeof props.children === "function"
                                ? props.children(kit)
                                : props.children}
                        <Controls kit={kit} />
                </div>
        );
};
