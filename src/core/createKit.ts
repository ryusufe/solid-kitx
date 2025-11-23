import { createSignal } from "solid-js";
import { createStore } from "solid-js/store";
import {
        type Kit,
        type SolidKitProps,
        type ActiveConnectionType,
} from "../types";

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

        const [gridSize, setGridSize] = createSignal(props.gridSize ?? 30);

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
                setGridSize,
                updateNodes,
                updateConnections,
                updateViewport,
                randomId,
                defaultNode: props.defaultNode,
        };
};
