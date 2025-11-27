import { Accessor, Setter } from "solid-js";
import { SetStoreFunction } from "solid-js/store";
import type { NodeType } from "./node";
import { ConnectionType, ActiveConnectionType } from "./connection";
import { Viewport, xy } from "./viewport";
import { ConfigsType } from "./configs";
import { SelectionType } from "src/types";

export interface Kit {
        nodes: NodeType[];
        setNodes: SetStoreFunction<NodeType[]>;

        connections: ConnectionType[];
        setConnections: SetStoreFunction<ConnectionType[]>;

        viewport: Accessor<Viewport>;
        setViewport: Setter<Viewport>;

        focus: Accessor<boolean>;
        setFocus: Setter<boolean>;

        selection: SelectionType;

        activeConnectionDestination: () => xy | null;
        setActiveConnectionDestination: Setter<xy | null>;

        activeConnection: ActiveConnectionType;

        container: HTMLDivElement | null;

        updateNodes: (skipHistory?: boolean) => void;
        updateConnections: (skipHistory?: boolean) => void;
        updateViewport: () => void;

        configs: ConfigsType;
        undo?: () => void;
        redo?: () => void;

        randomId: (type: "node" | "connection") => string;
}
