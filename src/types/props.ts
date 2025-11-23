import { JSX } from "solid-js";
import type { NodeType } from "./node";
import type { ConnectionType } from "./connection";
import type { ViewPort } from "./viewport";
import type { Kit } from "./kit";
import type { ComponentsType } from "./components";

export interface SolidKitProps {
    nodes: NodeType[];
    connections: ConnectionType[];
    viewport: ViewPort;
    onViewportChange: (vp: ViewPort) => void;
    onNodesChange: (nodes: NodeType[]) => void;
    onConnectionsChange: (connections: ConnectionType[]) => void;
    defaultNode?: Partial<NodeType>;
    gridSize?: number;
    width?: number;
    height?: number;
    class?: string;
    children?: JSX.Element | ((kit: Kit) => JSX.Element);
    components?: ComponentsType;
}
