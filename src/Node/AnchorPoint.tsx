import { Component, createSignal } from "solid-js";
import { ConnectionType, NodeType, Position, Kit } from "src/types";

const sides: Position[] = ["left", "right", "top", "bottom"];

const AnchorPoint: Component<{
        side: Position;
        kit: Kit;
        id: string;
}> = (props) => {
        const onMouseMove = (e: MouseEvent) => {
                if (!props.kit.activeConnection.from) return;

                const { x, y, zoom } = props.kit.viewport();
                const rect = props.kit.containerRect;
                if (!rect) return;

                props.kit.setActiveConnectionDestination({
                        x: (e.clientX - rect.left - x) / zoom,
                        y: (e.clientY - rect.top - y) / zoom,
                });
        };

        const onUp = () => {
                const kit = props.kit;
                if (kit.activeConnection.from) {
                        let to = kit.activeConnection.to;
                        if (!to) {
                                const dest = kit.activeConnectionDestination();
                                if (dest) {
                                        const id = kit.randomId("node");
                                        const node: NodeType = {
                                                id,
                                                x:
                                                        Math.round(
                                                                dest.x /
                                                                        props.kit.gridSize(),
                                                        ) *
                                                        props.kit.gridSize(),
                                                y:
                                                        Math.round(
                                                                dest.y /
                                                                        props.kit.gridSize(),
                                                        ) *
                                                        props.kit.gridSize(),
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

        const startConnection = (clientX: number, clientY: number) => {
                document.documentElement.style.userSelect = "none";
                props.kit.activeConnection = {
                        from: {
                                side: props.side,
                                id: props.id,
                        },
                };
                const { x, y, zoom } = props.kit.viewport();
                const rect = props.kit.containerRect;
                if (!rect) return;
                props.kit.setActiveConnectionDestination({
                        x: (clientX - rect.left - x) / zoom,
                        y: (clientY - rect.top - y) / zoom,
                });
        };

        const onMouseDown = (e: MouseEvent) => {
                e.stopPropagation();
                startConnection(e.clientX, e.clientY);
                window.addEventListener("mousemove", onMouseMove);
                window.addEventListener("mouseup", onUp, { once: true });
        };

        const onTouchStart = (e: TouchEvent) => {
                e.stopPropagation();
                if (e.touches.length !== 1) return;
                e.preventDefault();
                startConnection(e.touches[0]!.clientX, e.touches[0]!.clientY);
                window.addEventListener("touchmove", onTouchMove);
                window.addEventListener("touchend", onUp, { once: true });
        };

        const onTouchMove = (e: TouchEvent) => {
                if (e.touches.length !== 1 || !props.kit.activeConnection.from)
                        return;

                e.preventDefault();

                const { x, y, zoom } = props.kit.viewport();
                const rect = props.kit.containerRect;
                if (!rect) return;

                props.kit.setActiveConnectionDestination({
                        x: (e.touches[0]!.clientX - rect.left - x) / zoom,
                        y: (e.touches[0]!.clientY - rect.top - y) / zoom,
                });
        };

        const cleanupConnection = () => {
                document.documentElement.style.userSelect = "auto";
                props.kit.setActiveConnectionDestination(null);
                props.kit.activeConnection = {};
                window.removeEventListener("mousemove", onMouseMove);
                window.removeEventListener("touchmove", onTouchMove);
        };

        return (
                <div
                        class="node-handle"
                        onMouseDown={onMouseDown}
                        ontouchstart={onTouchStart}
                ></div>
        );
};

export default AnchorPoint;
