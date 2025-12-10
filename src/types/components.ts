import { Accessor, Component } from "solid-js";
import { Kit } from "./kit";
import { NodeType } from "./node";
import { ConnectionType } from "./connection";

export interface NodeToolbarProps {
        kit: Kit;
        node: NodeType;
        index: Accessor<number>;
}

export interface ConnectionToolbarProps {
        kit: Kit;
        connection: ConnectionType;
        index: Accessor<number>;
}

export interface ComponentsType {
        "node-toolbar"?: Component<NodeToolbarProps>;
        "connection-toolbar"?: Component<ConnectionToolbarProps>;
        [key: string]: Component<any> | undefined;
}
