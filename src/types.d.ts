import { Accessor, Component, JSX, Setter } from "solid-js";
import { SetStoreFunction } from "solid-js/store";

export interface NodePosition {
        x: number;
        y: number;
}

export interface NodeData<T = any> {
        label?: string;
        component?: {
                type: string;
                props?: T & { kit?: Kit; node?: NodeType };
        };
}

export interface NodeType<Data = any> extends NodePosition {
        id: string;
        data?: NodeData<Data>;
        width: number;
        height: number;
        class?: string;
        style?: JSX.CSSProperties;
}

export type Position = "top" | "left" | "bottom" | "right";

export interface ConnectionNode {
        id: string;
        side: Position;
}
export interface ConnectionType {
        id: string;
        from: ConnectionNode;
        to: ConnectionNode;
        label?: string;
        class?: string;
        style?: JSX.CSSProperties;
}

export interface ViewPort {
        x: number;
        y: number;
        zoom: number;
}

export interface CanvasViewport {
        x: number;
        y: number;
        zoom: number;
}

type ReturnedComponent = () => JSX.Element;

export interface NodeToolbarProps {
        kit: Kit;
        node: NodeType;
}

export interface ConnectionToolbarProps {
        kit: Kit;
        connection: ConnectionType;
}

export interface ComponentsType {
        "node-toolbar"?: Component<NodeToolbarProps>;
        "connection-toolbar"?: Component<ConnectionToolbarProps>;
        [key: string]: Component<any> | undefined;
}

export type ActiveConnectionType = Partial<{
        from: { id: string; side: Position };
        to: { id: string; side: Position };
}>;

export type Viewport = ViewPort;

export interface SolidKitProps {
        nodes: NodeType[];
        connections: ConnectionType[];
        viewport: ViewPort;
        onViewportChange: (vp: ViewPort) => void;
        onNodesChange: (nodes: NodeType[]) => void;
        onConnectionsChange: (connections: ConnectionType[]) => void;
        gridSize?: number;
        width?: number;
        height?: number;
        class?: string;
        children?: JSX.Element | ((kit: Kit) => JSX.Element);
        components?: ComponentsType;
}

// props

export interface Kit {
        nodes: NodeType[];
        setNodes: SetStoreFunction<NodeType[]>;

        connections: ConnectionType[];
        setConnections: SetStoreFunction<ConnectionType[]>;

        viewport: () => Viewport;
        setViewport: Setter<Viewport>;

        focus: Accessor<boolean>;
        setFocus: Setter<boolean>;

        selectedItems: () => Set<string>;
        setSelectedItems: Setter<Set<string>>;

        activeConnectionDestination: () => { x: number; y: number } | null;
        setActiveConnectionDestination: Setter<{ x: number; y: number } | null>;

        activeConnection: ActiveConnectionType;

        containerRect: DOMRect | null;

        gridSize: () => number;

        updateNodes: () => void;
        updateConnections: () => void;
        updateViewport: () => void;

        randomId: (type: "node" | "connection") => string;
}
