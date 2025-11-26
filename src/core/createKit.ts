import { createEffect, createSignal, on, splitProps } from "solid-js";
import { createStore, unwrap } from "solid-js/store";
import {
        type Kit,
        type SolidKitProps,
        type ActiveConnectionType,
        xy,
} from "../types";
import { configKeys, ConfigsType } from "../types/configs";

// interface History {
//         nodes: NodeType[];
//         connections: ConnectionType[];
// }

export const createKit = (props: SolidKitProps): Kit => {
        const [nodes, setNodes] = props.nodesStore;
        const [connections, setConnections] = props.connectionsStore;
        const [viewport, setViewport] = createSignal(
                props.viewport || { x: 0, y: 0, zoom: 1 },
        );

        const [focus, setFocus] = createSignal(false);
        const [selectedItems, setSelectedItems] = createSignal(
                new Set<string>(),
        );
        const [activeConnectionDestination, setActiveConnectionDestination] =
                createSignal<xy | null>(null);

        const updateViewport = () => props.onViewportChange?.(viewport());

        const randomId = (type: "connection" | "node") =>
                type + "-" + Math.random().toString(36).substring(2, 10);

        // History
        // const [history, setHistory] = createSignal<History[]>([
        //         {
        //                 nodes: structuredClone(unwrap(nodes)),
        //                 connections: structuredClone(unwrap(connections)),
        //         },
        // ]);
        // const [redoStack, setRedoStack] = createSignal<History[]>([]);
        // const historyLimit = props.historyLimit ?? 20;
        //
        // const pushHistory = () => {
        //         if (!props.enableHistory) return;
        //
        //         setHistory((h) => {
        //                 const next = [
        //                         ...h,
        //                         {
        //                                 nodes: structuredClone(unwrap(nodes)),
        //                                 connections: structuredClone(
        //                                         unwrap(connections),
        //                                 ),
        //                         },
        //                 ];
        //                 if (next.length > historyLimit) next.shift();
        //                 return next;
        //         });
        //         setRedoStack([]);
        // };
        //
        const updateNodes = (skipHistory?: boolean) => {
                // !skipHistory && pushHistory();
                props.onNodesChange(unwrap(nodes));
        };

        const updateConnections = (skipHistory?: boolean) => {
                // !skipHistory && pushHistory();
                props.onConnectionsChange(unwrap(connections));
        };
        //
        // const undo = () => {
        //         if (!props.enableHistory) return;
        //         const h = history();
        //         if (h.length === 0) return;
        //
        //         const previous = h[h.length - 1];
        //         if (!previous) return;
        //         setRedoStack((r) => [
        //                 ...r,
        //                 {
        //                         nodes: structuredClone(unwrap(nodes)),
        //                         connections: structuredClone(
        //                                 unwrap(connections),
        //                         ),
        //                 },
        //         ]);
        //
        //         setNodes(previous.nodes);
        //         setConnections(previous.connections);
        //
        //         setHistory(h.slice(0, h.length - 1));
        //
        //         updateNodes(true);
        //         updateConnections(true);
        // };
        //
        // const redo = () => {
        //         if (!props.enableHistory) return;
        //
        //         const r = redoStack();
        //         if (r.length === 0) return;
        //
        //         const next = r[r.length - 1];
        //
        //         if (!next) return;
        //         pushHistory();
        //
        //         setNodes(next.nodes);
        //         setConnections(next.connections);
        //
        //         setRedoStack(r.slice(0, r.length - 1));
        //
        //         updateNodes(true);
        //         updateConnections(true);
        // };
        //
        const [configs] = splitProps(props, configKeys);

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
                updateNodes,
                updateConnections,
                updateViewport,
                randomId,
                // redo,
                // undo,
                configs,
        };
};
