import { createModule } from "../../../src/utils/module";
import { createSideBarState } from "./state";
import type { StateType } from "./state";
import { SideBarLogic } from "./logic";
import type { LogicType } from "./logic";
import { SideBarView } from "./view";
import { SideBarHelper } from "./helper";
import type { HelperType } from "./helper";
import { Kit } from "solid-kitx";

export type SideBarProps = {
        kit: Kit;
};

export const SideBar = createModule<
        StateType,
        LogicType,
        SideBarProps,
        HelperType
>({
        create: (props: SideBarProps) => {
                const helper = SideBarHelper(props);
                const state = createSideBarState(props, helper);
                const logic = SideBarLogic(state, props, helper);

                return {
                        helper,
                        state,
                        logic,
                        view: (
                                state: StateType,
                                logic: LogicType,
                                props: SideBarProps,
                                helper: HelperType,
                                //@ts-ignore
                        ) => SideBarView(state, logic, props, helper),
                };
        },
});
