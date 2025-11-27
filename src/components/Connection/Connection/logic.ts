import { ConnectionProps } from ".";
import type { StateType } from "./state";
import type { HelperType } from "./helper";
import { ConnectionType } from "src/types";
import { createEffect, onCleanup } from "solid-js";

export type LogicType = {
        setLabel: (label?: string) => void;
        onpointerdown: (e: PointerEvent) => void;
};

export const ConnectionLogic = (
        state: StateType,
        props: ConnectionProps,
        helper?: HelperType,
): LogicType => {
        const setSelected = (value: boolean) => {
                const current = props.kit.selection;
                if (value) {
                        current.addItem(props.connection.id, "connection");
                } else {
                        current.removeItem(props.connection.id, "connection");
                }
        };

        const setLabel = (label?: string) => {
                props.kit.setConnections(
                        (c: ConnectionType) => c.id === props.connection.id,
                        "label",
                        label,
                );
                props.kit.updateConnections();
        };

        const onpointerdown = (e: PointerEvent) => {
                e.stopPropagation();
                setSelected(true);
        };

        const controller = new AbortController();

        createEffect(() => {
                if (!state.connectionRef) return;

                if (state.selected()) {
                        state.connectionRef.focus();
                        window.addEventListener("mousedown", onClickOutside, {
                                signal: controller.signal,
                        });
                        window.addEventListener("keydown", onKeyDown, {
                                signal: controller.signal,
                        });
                } else if (state.connectionRef.classList.contains("selected")) {
                        state.connectionRef.blur();
                }
        });

        const onClickOutside = (e: MouseEvent) => {
                const target = e.target as Node;
                if (state.toolbarRef && state.toolbarRef.contains(target))
                        return;
                if (
                        state.connectionRef &&
                        !state.connectionRef.contains(target) &&
                        !e.ctrlKey
                ) {
                        setSelected(false);
                        window.removeEventListener("mousedown", onClickOutside);
                        window.removeEventListener("keydown", onKeyDown);
                }
        };

        const onKeyDown = (e: KeyboardEvent) => {
                if (e.key === "Escape") {
                        setSelected(false);
                        window.removeEventListener("keydown", onKeyDown);
                }
        };
        onCleanup(() => {
                controller.abort();
        });
        return { setLabel, onpointerdown };
};
