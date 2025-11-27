import { createModule } from "../../utils/module";
import { createControlsState } from "./state";
import type { StateType } from "./state";
import { ControlsLogic } from "./logic";
import type { LogicType } from "./logic";
import { ControlsView } from "./view";
import { ControlsHelper } from "./helper";
import type { HelperType } from "./helper";
import { Kit } from "src/types";

export type ControlsProps = {
        kit: Kit;
};

export const Controls = createModule<
        StateType,
        LogicType,
        ControlsProps,
        HelperType
>({
        create: (props: ControlsProps) => {
                const helper = ControlsHelper(props);
                const state = createControlsState(props, helper);
                const logic = ControlsLogic(state, props, helper);

                return {
                        helper,
                        state,
                        logic,
                        view: (
                                state: StateType,
                                logic: LogicType,
                                props: ControlsProps,
                                helper: HelperType,
                        ) => ControlsView(state, logic, props, helper),
                };
        },
});

