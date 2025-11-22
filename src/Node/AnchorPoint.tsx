import { Component } from "solid-js";
import {
        snapToGrid,
        getTouchCoords,
        disableUserSelect,
        enableUserSelect,
        clientToCanvasCoords,
} from "../lib/eventUtils";
import { ConnectionType, NodeType, Position, Kit } from "../types";

const sides: Position[] = ["left", "right", "top", "bottom"];

const AnchorPoint: Component<{
        side: Position;
        kit: Kit;
        id: string;
}> = (props) => {
        let anchorRef!: HTMLDivElement;
        let touchStartPos: { x: number; y: number } | null = null;
        let dragging = false;

        const onMouseMove = (e: MouseEvent) => {
                if (!props.kit.activeConnection.from) return;

                const coords = clientToCanvasCoords(
                        e.clientX,
                        e.clientY,
                        props.kit.viewport(),
                        props.kit.containerRect,
                );

                if (coords) {
                        props.kit.setActiveConnectionDestination(coords);
                }
        };

        const onUp = () => {
                if (!dragging) {
                        cleanupConnection();
                        return;
                }
                const kit = props.kit;
                if (kit.activeConnection.from) {
                        let to = kit.activeConnection.to;
                        if (!to) {
                                const dest = kit.activeConnectionDestination();
                                const gridSize = props.kit.gridSize();
                                if (dest) {
                                        const x = snapToGrid(dest.x, gridSize);
                                        const y = snapToGrid(dest.y, gridSize);
                                        const id = kit.randomId("node");
                                        const node: NodeType = {
                                                id,
                                                x,
                                                y,
                                                width: 5 * kit.gridSize(),
                                                height: 2 * kit.gridSize(),
                                                data: {
                                                        label: "Node",
                                                        component: {
                                                                type: "default",
                                                        },
                                                },
                                        };
                                        kit.setNodes([...kit.nodes, node]);
                                        kit.updateNodes();

                                        const fromSide =
                                                kit.activeConnection.from.side;
                                        const toSide = sides[
                                                sides.indexOf(fromSide) ^ 1
                                        ] as Position;
                                        to = { id, side: toSide };
                                }
                        }

                        if (to && kit.activeConnection.from.id !== to.id) {
                                const connection: ConnectionType = {
                                        id: kit.randomId("connection"),
                                        from: kit.activeConnection.from!,
                                        to: to!,
                                };
                                kit.setConnections([
                                        ...kit.connections,
                                        connection,
                                ]);
                                kit.updateConnections();
                        }
                }

                cleanupConnection();
        };

        const startConnection = () => {
                if (!anchorRef) return;
                const { x, y, width, height } =
                        anchorRef.getBoundingClientRect();
                const X = x + width / 2;
                const Y = y + height / 2;
                disableUserSelect();
                props.kit.activeConnection = {
                        from: {
                                side: props.side,
                                id: props.id,
                        },
                };

                const coords = clientToCanvasCoords(
                        X,
                        Y,
                        props.kit.viewport(),
                        props.kit.containerRect,
                );

                if (coords) {
                        props.kit.setActiveConnectionDestination(coords);
                }
        };

        const onMouseDown = (e: MouseEvent) => {
                e.stopPropagation();
                dragging = true;
                startConnection();
                window.addEventListener("mousemove", onMouseMove);
                window.addEventListener("mouseup", onUp, { once: true });
        };

        const onTouchStart = (
                e: TouchEvent & { currentTarget: HTMLDivElement },
        ) => {
                e.stopPropagation();
                e.preventDefault();
                //
                const touch = e.touches[0];
                if (!touch) return;
                // 1px will suffer
                touchStartPos = { x: touch.clientX, y: touch.clientY };
                dragging = false;
                //
                startConnection();
                //
                window.addEventListener("touchmove", onTouchMove);
                window.addEventListener("touchend", onUp, { once: true });
        };

        const onTouchMove = (e: TouchEvent) => {
                const coords = getTouchCoords(e);
                if (!coords || !props.kit.activeConnection.from) return;

                e.preventDefault();
                if (!dragging && touchStartPos) {
                        const dx = coords.x - touchStartPos.x;
                        const dy = coords.y - touchStartPos.y;
                        const dist = Math.sqrt(dx * dx + dy * dy);
                        if (dist > props.kit.gridSize()) {
                                dragging = true;
                        } else {
                                return;
                        }
                }

                const canvasCoords = clientToCanvasCoords(
                        coords.x,
                        coords.y,
                        props.kit.viewport(),
                        props.kit.containerRect,
                );

                if (canvasCoords) {
                        props.kit.setActiveConnectionDestination(canvasCoords);
                }
        };

        const cleanupConnection = () => {
                enableUserSelect();
                props.kit.setActiveConnectionDestination(null);
                props.kit.activeConnection = {};
                window.removeEventListener("mousemove", onMouseMove);
                window.removeEventListener("touchmove", onTouchMove);
        };

        return (
                <div
                        ref={anchorRef}
                        class="node-handle"
                        onMouseDown={onMouseDown}
                        ontouchstart={onTouchStart}
                ></div>
        );
};

export default AnchorPoint;
