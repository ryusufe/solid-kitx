import { Accessor, Setter } from "solid-js";
import { SetStoreFunction } from "solid-js/store";
import type { NodeType } from "./node";
import { ConnectionType, ActiveConnectionType } from "./connection";
import { Viewport } from "./viewport";

export interface Kit {
    nodes: NodeType[];
    setNodes: SetStoreFunction<NodeType[]>;

    connections: ConnectionType[];
    setConnections: SetStoreFunction<ConnectionType[]>;

    viewport: Accessor<Viewport>;
    setViewport: Setter<Viewport>;

    focus: Accessor<boolean>;
    setFocus: Setter<boolean>;

    selectedItems: () => Set<string>;
    setSelectedItems: Setter<Set<string>>;

    activeConnectionDestination: () => { x: number; y: number } | null;
    setActiveConnectionDestination: Setter<{ x: number; y: number } | null>;

    activeConnection: ActiveConnectionType;

    container: HTMLDivElement | null;

    gridSize: Accessor<number>;
    setGridSize: Setter<number>;

    defaultNode?: Partial<NodeType>;

    updateNodes: () => void;
    updateConnections: () => void;
    updateViewport: () => void;

    randomId: (type: "node" | "connection") => string;
}
