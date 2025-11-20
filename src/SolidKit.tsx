import {
        createEffect,
        createMemo,
        For,
        JSX,
        onCleanup,
        onMount,
        Show,
} from "solid-js";
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
export const SolidKit = ({ gridSize = 30, ...props }: SolidKitProps) => {
        const kit = createKit({ ...props, gridSize });

        createEffect(() => {
                if (props.nodes) kit.setNodes(props.nodes);
        });
        createEffect(() => {
                if (props.connections) kit.setConnections(props.connections);
        });
        createEffect(() => {
                if (props.viewport) kit.setViewport(props.viewport);
        });

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
                const newZoom = Math.max(
                        0.1,
                        Math.min(5, oldZoom - e.deltaY * 0.001),
                );

                const newX = cursorX - (cursorX - prev.x) * (newZoom / oldZoom);
                const newY = cursorY - (cursorY - prev.y) * (newZoom / oldZoom);

                kit.setViewport({
                        zoom: newZoom,
                        x: newX,
                        y: newY,
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
        });

        return (
                <KitContext.Provider value={kit}>
                        <div
                                ref={containerRef}
                                class="solid-kit"
                                style={{
                                        "--bg-vp-zoom": `${vp().zoom * 1.2}px`,
                                        "background-size": `${
                                                gridSize * vp().zoom
                                        }px ${gridSize * vp().zoom}px`,
                                        "background-position": `${vp().x}px ${
                                                vp().y
                                        }px`,
                                        "background-repeat": "repeat",
                                }}
                                onmousedown={onMouseDown}
                                onwheel={onWheel}
                        >
                                <div
                                        class="container"
                                        style={{
                                                "transform-origin": "0 0",
                                                transform: `translate(${
                                                        vp().x
                                                }px, ${vp().y}px) scale(${
                                                        vp().zoom
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
