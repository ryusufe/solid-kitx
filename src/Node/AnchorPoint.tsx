import { Component } from "solid-js";
import { ConnectionType, NodeType, Position, Kit } from "src/types";

const sides: Position[] = ["left", "right", "top", "bottom"];

const AnchorPoint: Component<{
        side: Position;
        kit: Kit;
        id: string;
}> = (props) => {
        const onMouseDown = (e: MouseEvent) => {
                e.stopPropagation();
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
                        x: (e.clientX - rect.left - x) / zoom,
                        y: (e.clientY - rect.top - y) / zoom,
                });
                window.addEventListener("mouseup", onMouseUp, { once: true });
        };
        const onMouseUp = () => {
                const kit = props.kit;
                if (kit.activeConnection.from) {
                        const id = kit.randomId("node");
                        let to = kit.activeConnection.to;
                        if (!to) {
                                const dest = kit.activeConnectionDestination();
                                if (dest) {
                                        const node: NodeType = {
                                                id,
                                                x:
                                                        Math.round(
                                                                dest.x /
                                                                        kit.gridSize(),
                                                        ) * kit.gridSize(),
                                                y:
                                                        Math.round(
                                                                dest.y /
                                                                        kit.gridSize(),
                                                        ) * kit.gridSize(),
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

                document.documentElement.style.userSelect = "auto";
                props.kit.setActiveConnectionDestination(null);
                props.kit.activeConnection = {};
        };

        return <div class="node-handle" onMouseDown={onMouseDown}></div>;
};

export default AnchorPoint;
