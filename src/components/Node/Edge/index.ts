import { createModule } from "../../../utils/module";
import { createEdgeState } from "./state";
import type { StateType } from "./state";
import { EdgeLogic } from "./logic";
import type { LogicType } from "./logic";
import { EdgeView } from "./view";
import { EdgeHelper, HelperType } from "./helper";
import { Kit, NodeType, Position } from "src/types";
import { Accessor } from "solid-js";

export type EdgePosition = Position | "tr" | "tl" | "br" | "bl";
export type EdgeProps = {
        index: Accessor<number>;
        side: EdgePosition;
        node: NodeType;
        kit: Kit;
};

export const Edge = createModule<StateType, LogicType, EdgeProps, HelperType>({
        create: (props: EdgeProps) => {
                const helper = EdgeHelper(props);
                const state = createEdgeState(props, helper);
                const logic = EdgeLogic(state, props, helper);

                return {
                        helper,
                        state,
                        logic,
                        view: (
                                state: StateType,
                                logic: LogicType,
                                props: EdgeProps,
                                helper: HelperType,
                        ) => EdgeView(state, logic, props, helper),
                };
        },
});
