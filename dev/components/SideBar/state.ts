import { Accessor, createSignal, Setter } from "solid-js";
import { SideBarProps } from ".";
import type { HelperType } from "./helper";

export type StateType = {
        selected: Accessor<string>;
        setSelected: Setter<string>;
};

export const createSideBarState = (
        props: SideBarProps,
        helper?: HelperType,
): StateType => {
        const [selected, setSelected] = createSignal<string>("");
        return { selected, setSelected };
};
