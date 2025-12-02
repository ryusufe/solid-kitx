import { JSX } from "solid-js";
import { xy } from "./viewport";

export interface NodeData<T = any> {
        label?: string;
        component?: string;
        extra?: T;
}

export interface NodeType<Data = any> extends xy {
        id: string;
        data?: NodeData<Data>;
        width: number;
        height: number;
        class?: string;
        style?: JSX.CSSProperties;
}
