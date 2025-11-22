import { createSignal } from "solid-js";
import { createStore } from "solid-js/store";
import { SolidKitProps, Position, Kit } from "../types";

//export type KitStore = ReturnType<typeof createKit>;

export type ActiveConnectionType = Partial<{
        from: { id: string; side: Position };
        to: { id: string; side: Position };
}>;

export const createKit = (props: SolidKitProps): Kit => {
        const [nodes, setNodes] = createStore(props.nodes || []);
        const [connections, setConnections] = createStore(
                props.connections || [],
        );
        const [viewport, setViewport] = createSignal(
                props.viewport || { x: 0, y: 0, zoom: 1 },
        );
        const [focus, setFocus] = createSignal(false);
        const [selectedItems, setSelectedItems] = createSignal(
                new Set<string>(),
        );
        const [activeConnectionDestination, setActiveConnectionDestination] =
                createSignal<{ x: number; y: number } | null>(null);

        const gridSize = () => props.gridSize ?? 30;

        const updateNodes = () => props.onNodesChange?.(nodes);
        const updateConnections = () =>
                props.onConnectionsChange?.(connections);
        const updateViewport = () => props.onViewportChange?.(viewport());

        const randomId = (type: "connection" | "node") =>
                type + "-" + Math.random().toString(36).substring(2, 10);

        return {
                nodes,
                setNodes,
                connections,
                setConnections,
                viewport,
                setViewport,
                focus,
                setFocus,
                selectedItems,
                setSelectedItems,
                activeConnectionDestination,
                setActiveConnectionDestination,
                activeConnection: {} as ActiveConnectionType,
                container: null as HTMLDivElement | null,
                gridSize,
                updateNodes,
                updateConnections,
                updateViewport,
                randomId,
        };
};
