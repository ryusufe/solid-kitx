import { JSX } from "solid-js";
import { Kit } from "./kit";

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
