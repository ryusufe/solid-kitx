import { Accessor, Setter } from "solid-js";

export interface SelectedType {
        nodes: string[];
        connections: string[];
}
export interface SelectionType {
        getNodes: () => string[];
        setNodes: (nodes: string[]) => void;
        //
        getConnections: () => string[];
        setConnections: (connections: string[]) => void;
        //
        get: Accessor<SelectedType>;
        set: Setter<SelectedType>;
        addItem: (id: string, type: "node" | "connection") => void;
        removeItem: (id: string, type: "node" | "connection") => void;
        getMerged: () => string[];
        length: () => number;
        clear: () => void;
}
