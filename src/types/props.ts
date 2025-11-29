import { JSX, Signal } from "solid-js";
import type { NodeType } from "./node";
import type { ConnectionType } from "./connection";
import type { ViewPort } from "./viewport";
import type { Kit } from "./kit";
import type { ComponentsType } from "./components";
import { ConfigsType } from "./configs";
import { SetStoreFunction } from "solid-js/store";

export interface SolidKitxProps extends ConfigsType {
        nodesStore: [get: NodeType[], set: SetStoreFunction<NodeType[]>];
        connectionsStore: [
                get: ConnectionType[],
                set: SetStoreFunction<ConnectionType[]>,
        ];
        viewportSignal: Signal<ViewPort>;
        onViewportChange: (vp: ViewPort) => void;
        onNodesChange: (nodes: NodeType[]) => void;
        onConnectionsChange: (connections: ConnectionType[]) => void;
        width?: number;
        height?: number;
        class?: string;
        children?: JSX.Element | ((kit: Kit) => JSX.Element);
        components?: ComponentsType;
}
