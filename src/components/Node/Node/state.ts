import { Accessor, createMemo } from "solid-js";
import { NodeProps } from ".";
import type { HelperType } from "./helper";

export type StateType = {
        type: Accessor<string | undefined>;
        nodeDiv: HTMLDivElement;
        hasComponent: Accessor<boolean>;
        Toolbar: Accessor<boolean>;
        selected: Accessor<boolean>;
};

export const createNodeState = (
        props: NodeProps,
        helper?: HelperType,
): StateType => {
        const type = createMemo(() => props.node.data?.component);
        let nodeDiv!: HTMLDivElement;
        const hasComponent = createMemo<boolean>(
                () =>
                        !!props.node.data?.component &&
                        props.node.data.component in props.components!,
        );
        //
        const Toolbar = createMemo(() => "node-toolbar" in props.components!);
        //
        const selected = createMemo(() => {
                const selectedSet = props.kit.selectedItems();
                return selectedSet.has(props.node.id);
        });

        return { type, nodeDiv, hasComponent, Toolbar, selected };
};

