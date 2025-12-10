import {
        ConnectionNode,
        ConnectionType,
        NodeType,
        Position,
        PositionList,
        xy,
} from "src/types";
import { AnchorPointProps } from ".";
import type { StateType } from "./state";
import {
        clientToCanvasCoords,
        disableUserSelect,
        enableUserSelect,
        snapToGrid,
} from "src/utils/events";
import { reconcile } from "solid-js/store";
import { HelperType } from "./helper";

export type LogicType = {
        onPointerDown: (e: PointerEvent) => void;
};

export const AnchorPointLogic = (
        state: StateType,
        props?: AnchorPointProps,
        helper?: HelperType,
): LogicType => {
        let pointerStartPos: xy | null = null;
        let dragging = false;

        const onPointerMove = (e: PointerEvent) => {
                if (!props?.kit.activeConnection.from) return;

                const coords = clientToCanvasCoords(
                        e.clientX,
                        e.clientY,
                        props?.kit.viewport(),
                        props?.kit.container?.getBoundingClientRect()!,
                );

                if (coords) {
                        props?.kit.setActiveConnectionDestination(coords);
                }
        };

        const onUp = () => {
                if (!dragging) {
                        cleanupConnection();
                        return;
                }
                const kit = props?.kit;
                if (kit && kit.activeConnection.from) {
                        let to = kit.activeConnection.to;
                        // Making a new node if it's not connected to  any => to : id + side
                        if (
                                !to?.id &&
                                !kit.configs.disableAnchorConnectionCreation
                        ) {
                                const dest = kit.activeConnectionDestination();
                                const gridSize = props?.kit.configs.gridSize!;
                                if (dest) {
                                        const x = snapToGrid(
                                                dest.x - 75,
                                                gridSize,
                                        );
                                        const y = snapToGrid(dest.y, gridSize);
                                        const widthUnits = Math.round(
                                                150 / gridSize,
                                        );
                                        const heightUnits = Math.round(
                                                60 / gridSize,
                                        );
                                        const id = kit.randomId("node");
                                        const node: NodeType = {
                                                x,
                                                y,
                                                width:
                                                        widthUnits *
                                                        kit.configs.gridSize!,
                                                height:
                                                        heightUnits *
                                                        kit.configs.gridSize!,
                                                data: {
                                                        label: "Node",
                                                        component: "default",
                                                },
                                                ...kit.configs.defaultNode,
                                                id,
                                        };
                                        // TODO: tracker | mid
                                        kit.setNodes((prev) => [...prev, node]);
                                        kit.updateNodes(true);

                                        const fromSide =
                                                kit.activeConnection.from.side;
                                        const toSide = PositionList[
                                                PositionList.indexOf(fromSide) ^
                                                        1
                                        ] as Position;
                                        to = { id, side: to?.side ?? toSide };
                                }
                        }
                        // making a connection
                        if (to?.id && kit.activeConnection.from.id !== to.id) {
                                const connection: ConnectionType = {
                                        id: kit.randomId("connection"),
                                        from: kit.activeConnection.from!,
                                        to: to as ConnectionNode,
                                };
                                // TODO: tracker
                                kit.setConnections((prev) => [
                                        ...prev,
                                        connection,
                                ]);
                                kit.updateConnections();
                        }
                }

                cleanupConnection();
        };

        const startConnection = () => {
                if (!state.anchorRef) return;
                const { x, y, width, height } =
                        state.anchorRef.getBoundingClientRect();
                disableUserSelect();
                props &&
                        (props.kit.activeConnection = {
                                from: {
                                        side: props?.side,
                                        id: props?.id,
                                },
                        });

                const coords = clientToCanvasCoords(
                        x + width / 2,
                        y + height / 2,
                        props?.kit.viewport()!,
                        props?.kit.container?.getBoundingClientRect()!,
                );

                if (coords) {
                        props?.kit.setActiveConnectionDestination(coords);
                }
        };

        const onPointerDown = (e: PointerEvent) => {
                e.stopPropagation();
                e.preventDefault();

                pointerStartPos = { x: e.clientX, y: e.clientY };
                dragging = true;

                startConnection();

                window.addEventListener("pointermove", onPointerMove);
                window.addEventListener("pointerup", onUp, { once: true });
                window.addEventListener("pointercancel", onUp, { once: true });
        };

        const cleanupConnection = () => {
                enableUserSelect();
                if (props) {
                        props.kit.setActiveConnectionDestination(null);
                        props.kit.activeConnection = {};
                }
                window.removeEventListener("pointermove", onPointerMove);
                window.removeEventListener("pointerup", onUp);
                window.removeEventListener("pointercancel", onUp);
                pointerStartPos = null;
        };
        return { onPointerDown };
};
