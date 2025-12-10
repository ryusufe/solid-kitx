import { createModule } from "../../../utils/module";
import { createConnectionState } from "./state";
import type { StateType } from "./state";
import { ConnectionLogic } from "./logic";
import type { LogicType } from "./logic";
import { ConnectionView } from "./view";
import { ConnectionHelper } from "./helper";
import type { HelperType } from "./helper";
import { ConnectionToolbarProps, ConnectionType, Kit } from "src/types";
import { Accessor, Component } from "solid-js";

export type ConnectionProps = {
        connection: ConnectionType;
        Toolbar?: Component<ConnectionToolbarProps>;
        kit: Kit;
        index: Accessor<number>;
};

export const Connection = createModule<
        StateType,
        LogicType,
        ConnectionProps,
        HelperType
>({
        create: (props: ConnectionProps) => {
                const helper = ConnectionHelper(props);
                const state = createConnectionState(props, helper);
                const logic = ConnectionLogic(state, props, helper);

                return {
                        helper,
                        state,
                        logic,
                        view: (
                                state: StateType,
                                logic: LogicType,
                                props: ConnectionProps,
                                helper: HelperType,
                        ) => ConnectionView(state, logic, props, helper),
                };
        },
});
