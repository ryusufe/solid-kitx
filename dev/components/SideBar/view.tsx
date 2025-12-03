import Icon from "../../assets/logo.svg?raw";
import GearIcon from "../../assets/icons/gear.svg?raw";
import NewNodeIcon from "../../assets/icons/newNode.svg?raw";
import { SideBarProps } from ".";
import type { StateType } from "./state";
import type { LogicType } from "./logic";
import type { HelperType, NodeComponentType } from "./helper.tsx";
import { createSignal, For, onMount, Setter, Show } from "solid-js";
import { Kit, NodeType } from "solid-kitx";
import { SettingsModal } from "./SettingsModal";
import { Portal } from "solid-js/web";

export const SideBarView = (
        state: StateType,
        logic: LogicType,
        props: SideBarProps,
        helper?: HelperType,
) => {
        return (
                <>
                        <div
                                class="kitx-controls"
                                style={{
                                        top: "10px",
                                        right: "10px",
                                }}
                                onpointerdown={(e) => e.stopPropagation()}
                        >
                                <button
                                        innerHTML={Icon}
                                        onpointerdown={() =>
                                                window.open(
                                                        "https://github.com/ryusufe/solid-kitx/",
                                                        "_blank",
                                                )
                                        }
                                        title="Github"
                                ></button>
                                <hr style={{ border: 0, height: ".5em" }} />
                                <button
                                        title="Expand Settings"
                                        innerHTML={GearIcon}
                                        onpointerdown={() =>
                                                state.setSettingsVisible(
                                                        (prev) => !prev,
                                                )
                                        }
                                ></button>
                                <hr style={{ border: 0, height: ".5em" }} />
                                <For each={helper?.nodeTypes}>
                                        {(nodeType) => (
                                                <button
                                                        title={nodeType.label}
                                                        onclick={() =>
                                                                state.setSelected(
                                                                        (
                                                                                prev,
                                                                        ) =>
                                                                                prev ===
                                                                                nodeType.type
                                                                                        ? ""
                                                                                        : nodeType.type,
                                                                )
                                                        }
                                                        classList={{
                                                                on:
                                                                        nodeType.type ===
                                                                        state.selected(),
                                                        }}
                                                        innerHTML={
                                                                nodeType.icon
                                                        }
                                                ></button>
                                        )}
                                </For>
                        </div>
                        <Portal mount={document.getElementById("external")!}>
                                <SettingsModal
                                        visible={state.settingsVisible()}
                                        onClose={() =>
                                                state.setSettingsVisible(false)
                                        }
                                        logic={logic}
                                />
                        </Portal>
                        <Show when={state.selected()}>
                                <NodePreview
                                        selected={
                                                helper?.nodeTypes.find(
                                                        (i) =>
                                                                i.type ===
                                                                state.selected(),
                                                )!
                                        }
                                        setSelected={state.setSelected}
                                        kit={props.kit}
                                />
                        </Show>
                </>
        );
};

const NodePreview = ({
        selected,
        setSelected,
        kit,
}: {
        selected: NodeComponentType;
        setSelected: Setter<string>;
        kit: Kit;
}) => {
        const [position, setPosition] = createSignal({ x: 0, y: 0 });
        let offset = {
                x: selected.defaultWidth / 2,
                y: selected.defaultHeight / 2,
        };

        const move = (e: PointerEvent) => {
                setPosition({
                        x: e.clientX - offset.x,
                        y: e.clientY - offset.y,
                });
        };
        const off = () => {
                const newNode: NodeType = {
                        id: kit.randomId("node"),
                        ...position(),
                        height: selected.defaultHeight,
                        width: selected.defaultWidth,
                        // class: selected.type,
                        data: {
                                label: selected.label,
                                component: selected.type,
                                extra: selected.defaultData,
                        },
                };
                kit.setNodes((prev) => [...prev, newNode]);
                setSelected("");
                kit.updateNodes();
                window.removeEventListener("pointermove", move);
                window.removeEventListener("keydown", keydown);
        };

        const keydown = (e: KeyboardEvent) => {
                if (e.key === "Escape") {
                        setSelected("");
                        window.removeEventListener("keydown", keydown);
                        window.removeEventListener("pointermove", move);
                        window.removeEventListener("pointerup", off);
                }
        };
        onMount(() => {
                window.addEventListener("pointerup", off, { once: true });
                window.addEventListener("pointermove", move);
                window.addEventListener("keydown", keydown);
                setPosition({
                        x: (window.innerWidth - selected.defaultWidth) / 2,
                        y: (window.innerHeight - selected.defaultHeight) / 2,
                });
        });

        return (
                <div
                        class="node-preview"
                        style={{
                                width: selected.defaultWidth + "px",
                                height: selected.defaultHeight + "px",
                                transform: `translate(${position().x}px, ${
                                        position().y
                                }px)`,
                        }}
                >
                        {selected.label}
                </div>
        );
};
