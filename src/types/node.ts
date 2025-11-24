import { JSX } from "solid-js";
import { Kit } from "./kit";
import { xy } from "./viewport";

export interface NodeData<T = any> {
        label?: string;
        component?: {
                type: string;
                props?: T & { kit?: Kit; node?: NodeType };
        };
}

export interface NodeType<Data = any> extends xy {
        id: string;
        data?: NodeData<Data>;
        width: number;
        height: number;
        class?: string;
        style?: JSX.CSSProperties;
}
