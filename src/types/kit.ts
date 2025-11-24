import { Accessor, Setter } from "solid-js";
import { SetStoreFunction } from "solid-js/store";
import type { NodeType } from "./node";
import { ConnectionType, ActiveConnectionType } from "./connection";
import { Viewport, xy } from "./viewport";
import { Configs } from "./configs";

export interface Kit extends Configs {
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

        activeConnectionDestination: () => xy | null;
        setActiveConnectionDestination: Setter<xy | null>;

        activeConnection: ActiveConnectionType;

        container: HTMLDivElement | null;

        updateNodes: (skipHistory?: boolean) => void;
        updateConnections: (skipHistory?: boolean) => void;
        updateViewport: () => void;

        undo?: () => void;
        redo?: () => void;

        randomId: (type: "node" | "connection") => string;
}
