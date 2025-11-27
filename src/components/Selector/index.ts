import { createModule } from "../../utils/module";
import { createSelectorState } from "./state";
import type { StateType } from "./state";
import { SelectorLogic } from "./logic";
import type { LogicType } from "./logic";
import { SelectorView } from "./view";
import { SelectorHelper } from "./helper";
import type { HelperType } from "./helper";
import { Kit } from "src/types";

export type SelectorProps = {
        kit: Kit;
};

export const Selector = createModule<
        StateType,
        LogicType,
        SelectorProps,
        HelperType
>({
        create: (props: SelectorProps) => {
                const helper = SelectorHelper(props);
                const state = createSelectorState(props, helper);
                const logic = SelectorLogic(state, props, helper);

                return {
                        helper,
                        state,
                        logic,
                        view: (
                                state: StateType,
                                logic: LogicType,
                                props: SelectorProps,
                                helper: HelperType,
                        ) => SelectorView(state, logic, props, helper),
                };
        },
});

