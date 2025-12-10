import { createModule } from "../../../utils/module";
import { createNodeState } from "./state";
import type { StateType } from "./state";
import { NodeLogic } from "./logic";
import type { LogicType } from "./logic";
import { NodeView } from "./view";
import { NodeHelper } from "./helper";
import type { HelperType } from "./helper";
import { ComponentsType, Kit, NodeType } from "src/types";
import { Accessor } from "solid-js";

export type NodeProps = {
        index: Accessor<number>;
        node: NodeType;
        components?: ComponentsType;
        kit: Kit;
};

export const Node = createModule<StateType, LogicType, NodeProps, HelperType>({
        create: (props: NodeProps) => {
                const helper = NodeHelper(props);
                const state = createNodeState(props, helper);
                const logic = NodeLogic(state, props, helper);

                return {
                        helper,
                        state,
                        logic,
                        view: (
                                state: StateType,
                                logic: LogicType,
                                props: NodeProps,
                                helper: HelperType,
                        ) => NodeView(state, logic, props, helper),
                };
        },
});
