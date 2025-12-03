import { Accessor, createEffect, createSignal, on, Setter } from "solid-js";
import { SideBarProps } from ".";
import type { HelperType } from "./helper";

export type StateType = {
        selected: Accessor<string>;
        setSelected: Setter<string>;
        settingsVisible: Accessor<boolean>;
        setSettingsVisible: Setter<boolean>;
        isNodesVisible: Accessor<boolean>;
        setNodesVisible: Setter<boolean>;
};

export const createSideBarState = (
        props: SideBarProps,
        helper?: HelperType,
): StateType => {
        const [selected, setSelected] = createSignal<string>("");
        const [settingsVisible, setSettingsVisible] = createSignal(false);
        const [isNodesVisible, setNodesVisible] = createSignal(false);

        return {
                selected,
                setSelected,
                settingsVisible,
                setSettingsVisible,
                isNodesVisible,
                setNodesVisible,
        };
};
