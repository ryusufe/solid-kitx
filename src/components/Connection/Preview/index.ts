import { createModule } from "../../../utils/module";
import { createPreviewState } from "./state";
import type { StateType } from "./state";
import { PreviewLogic } from "./logic";
import type { LogicType } from "./logic";
import { PreviewView } from "./view";
import { PreviewHelper } from "./helper";
import type { HelperType } from "./helper";
import { Kit } from "src/types";

export type PreviewProps = {
        kit: Kit;
};

export const Preview = createModule<
        StateType,
        LogicType,
        PreviewProps,
        HelperType
>({
        create: (props: PreviewProps) => {
                const helper = PreviewHelper(props);
                const state = createPreviewState(props, helper);
                const logic = PreviewLogic(state, props, helper);

                return {
                        helper,
                        state,
                        logic,
                        view: (
                                state: StateType,
                                logic: LogicType,
                                props: PreviewProps,
                                helper: HelperType,
                        ) => PreviewView(state, logic, props, helper),
                };
        },
});
