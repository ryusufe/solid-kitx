import { createModule } from "../utils/module";
import { createSolidKitxState } from "./state";
import type { StateType } from "./state";
import { SolidKitxLogic } from "./logic";
import type { LogicType } from "./logic";
import { SolidKitxView } from "./view";
import { SolidKitxHelper } from "./helper";
import type { HelperType } from "./helper";
import { SolidKitxProps } from "src/types";

export const SolidKitx = createModule<
        StateType,
        LogicType,
        SolidKitxProps,
        HelperType
>({
        create: (props: SolidKitxProps) => {
                const helper = SolidKitxHelper(props);
                const state = createSolidKitxState(props, helper);
                const logic = SolidKitxLogic(state, props, helper);

                return {
                        helper,
                        state,
                        logic,
                        view: (
                                state: StateType,
                                logic: LogicType,
                                props: SolidKitxProps,
                                helper: HelperType,
                        ) => SolidKitxView(state, logic, props, helper),
                };
        },
});

