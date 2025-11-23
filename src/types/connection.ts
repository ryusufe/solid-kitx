import { JSX } from "solid-js";
import { Position } from "./position";
// export type Position = "top" | "left" | "bottom" | "right";

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

export type ActiveConnectionType = Partial<{
        from: { id: string; side: Position };
        to: { id: string; side: Position };
}>;
