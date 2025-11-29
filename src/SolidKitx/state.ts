import { Kit, SolidKitxProps, ViewPort } from "src/types";
import type { HelperType } from "./helper";
import { createKit } from "src/core/createKit";
import { Accessor, createMemo, JSX } from "solid-js";

export type StateType = {
        kit: Kit;
        Children: () => JSX.Element;
        containerRef: HTMLDivElement;
        vp: Accessor<ViewPort>;
};

export const createSolidKitxState = (
        props: SolidKitxProps,
        helper?: HelperType,
): StateType => {
        let containerRef!: HTMLDivElement;
        const kit = createKit(props);
        const Children = () => {
                const c = props.children;
                return typeof c === "function" ? c(kit) : c;
        };

        const vp = createMemo(() => kit.viewport());
        return { kit, containerRef, Children, vp };
};
