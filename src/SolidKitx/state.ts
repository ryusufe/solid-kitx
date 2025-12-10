import {
        ConnectionType,
        Kit,
        NodeType,
        SolidKitxProps,
        ViewPort,
} from "src/types";
import type { HelperType } from "./helper";
import { createKit } from "src/core/createKit";
import { Accessor, createMemo, JSX } from "solid-js";

export type StateType = {
        kit: Kit;
        Children: () => JSX.Element;
        containerRef: HTMLDivElement;
        vp: Accessor<ViewPort>;
        filteredNodes: Accessor<NodeType[]>;
        filteredConnections: Accessor<ConnectionType[]>;
};

export const createSolidKitxState = (
        props: SolidKitxProps,
        helper?: HelperType,
): StateType => {
        let containerRef!: HTMLDivElement;
        const kit = createKit(props);
        const Children = () => {
                const c = props.children;
                return typeof c === "function" ? c(kit) : c;
        };
        const vp = createMemo(() => kit.viewport());
        const filteredNodes = createMemo(() =>
                props.filterNodes
                        ? kit.nodes.filter(props.filterNodes)
                        : kit.nodes,
        );
        const filteredConnections = createMemo(() =>
                props.filterConnections
                        ? kit.connections.filter(props.filterConnections)
                        : kit.connections,
        );
        return {
                kit,
                containerRef,
                Children,
                vp,
                filteredConnections,
                filteredNodes,
        };
};
