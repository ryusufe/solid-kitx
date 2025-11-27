import { createModule } from "../../../utils/module";
import { createAnchorPointState } from "./state";
import type { StateType } from "./state";
import { AnchorPointLogic } from "./logic";
import type { LogicType } from "./logic";
import { AnchorPointView } from "./view";
import { AnchorPointHelper, HelperType } from "./helper";
import type { Kit, Position } from "src/types";

export type AnchorPointProps = {
        side: Position;
        kit: Kit;
        id: string;
};

const AnchorPoint = createModule<
        StateType,
        LogicType,
        AnchorPointProps,
        HelperType
>({
        create: (props: AnchorPointProps) => {
                const helper = AnchorPointHelper(props);
                const state = createAnchorPointState(props, helper);
                const logic = AnchorPointLogic(state, props, helper);

                return {
                        helper,
                        state,
                        logic,
                        view: (
                                state: StateType,
                                logic: LogicType,
                                props: AnchorPointProps,
                                helper: HelperType,
                        ) => AnchorPointView(state, logic, props, helper),
                };
        },
});

export default AnchorPoint;
