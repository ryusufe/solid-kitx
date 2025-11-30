import { createModule } from "../../utils/module";
import { createBackgroundGridState } from "./state";
import type { StateType } from "./state";
import { BackgroundGridLogic, LogicType } from "./logic";
import { BackgroundGridView } from "./view";
import { BackgroundGridHelper, HelperType } from "./helper";
import { Kit } from "src/types";

export type BackgroundGridProps = {
        kit: Kit;
        absoluteGrid?: number;
} & ({ type?: "dot" } | { type?: "dash"; dashWidth?: number });

export const BackgroundGrid = createModule<
        StateType,
        LogicType,
        BackgroundGridProps,
        HelperType
>({
        create: (props: BackgroundGridProps) => {
                const helper = BackgroundGridHelper(props);
                const state = createBackgroundGridState(props, helper);
                const logic = BackgroundGridLogic(state, props, helper);

                return {
                        helper,
                        state,
                        logic,
                        view: (
                                state: StateType,
                                logic: LogicType,
                                props: BackgroundGridProps,
                                helper: HelperType,
                        ) => BackgroundGridView(state, logic, props, helper),
                };
        },
});
