import { PreviewProps } from ".";
import type { StateType } from "./state";
import type { HelperType } from "./helper";
import { onCleanup, onMount } from "solid-js";

export type LogicType = {};

export const PreviewLogic = (
        state: StateType,
        props: PreviewProps,
        helper?: HelperType,
): LogicType => {
        const onMouseMove = (e: MouseEvent) => {
                const { x, y, zoom } = props.kit.viewport();
                const rect = props.kit.container?.getBoundingClientRect();
                if (!rect) return;

                props.kit.setActiveConnectionDestination({
                        x: (e.clientX - rect.left - x) / zoom,
                        y: (e.clientY - rect.top - y) / zoom,
                });
        };

        onMount(() => {
                window.addEventListener("pointermove", onMouseMove);
        });
        onCleanup(() => {
                window.removeEventListener("pointermove", onMouseMove);
        });
        return {};
};
