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
        /**
         * Fired when one or more nodes have changed.
         * @param changedNodes Only the ids of the nodes that changed.
         */
        onNodesChange: (changedNodes?: string[]) => void;
        /**
         * Fired when one or more connections have changed.
         * @param changedConnections Only the ids of the connections that changed.
         */
        onConnectionsChange: (changedConnections?: string[]) => void;
        width?: number;
        height?: number;
        class?: string;
        children?: JSX.Element | ((kit: Kit) => JSX.Element);
        components?: ComponentsType;
}
