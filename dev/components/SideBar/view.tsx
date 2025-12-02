import { SideBarProps } from ".";
import type { StateType } from "./state";
import type { LogicType } from "./logic";
import type { HelperType, NodeComponentType } from "./helper.tsx";
import Icon from "../../assets/logo.svg?raw";
import { createSignal, For, onMount, Setter, Show } from "solid-js";
import { Kit, NodeType } from "solid-kitx";

export const SideBarView = (
        state: StateType,
        logic: LogicType,
        props: SideBarProps,
        helper?: HelperType,
) => {
        return (
                <div
                        class="sidebar kit-controls"
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
                        <div style={{ height: "20px" }} />
                        <button
                                onpointerdown={() => {
                                        document.documentElement.classList.toggle(
                                                "dark",
                                        );

                                        localStorage.theme =
                                                localStorage.theme === "dark"
                                                        ? "light"
                                                        : "dark";
                                }}
                        >
                                <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        stroke-width="2"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                >
                                        <path
                                                stroke="none"
                                                d="M0 0h24v24H0z"
                                                fill="none"
                                        />
                                        <path d="M12 9a3 3 0 0 0 0 6v-6z" />
                                        <path d="M6 6h3.5l2.5 -2.5l2.5 2.5h3.5v3.5l2.5 2.5l-2.5 2.5v3.5h-3.5l-2.5 2.5l-2.5 -2.5h-3.5v-3.5l-2.5 -2.5l2.5 -2.5z" />
                                </svg>
                        </button>
                        <button
                                title="Export Backup"
                                onpointerdown={logic.exportAll}
                        >
                                <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        stroke-width="2"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                >
                                        <path
                                                stroke="none"
                                                d="M0 0h24v24H0z"
                                                fill="none"
                                        />
                                        <path d="M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2" />
                                        <path d="M9 12h12l-3 -3" />
                                        <path d="M18 15l3 -3" />
                                </svg>
                        </button>
                        <button
                                title="Import Backup"
                                onpointerdown={logic.importAll}
                        >
                                <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        stroke-width="2"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                >
                                        <path
                                                stroke="none"
                                                d="M0 0h24v24H0z"
                                                fill="none"
                                        />
                                        <path d="M15 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2" />
                                        <path d="M21 12h-13l3 -3" />
                                        <path d="M11 15l-3 -3" />
                                </svg>
                        </button>
                        <button
                                onpointerdown={logic.clearAll}
                                title="Clear All"
                        >
                                <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        stroke-width="2"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        class="icon icon-tabler icons-tabler-outline icon-tabler-x"
                                >
                                        <path
                                                stroke="none"
                                                d="M0 0h24v24H0z"
                                                fill="none"
                                        />
                                        <path d="M18 6l-12 12" />
                                        <path d="M6 6l12 12" />
                                </svg>
                        </button>
                        <div style={{ height: "50px" }} />
                        <For each={helper?.nodeTypes}>
                                {(nodeType) => (
                                        <button
                                                title={nodeType.label}
                                                onclick={() =>
                                                        state.setSelected(
                                                                (prev) =>
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
                                        >
                                                {nodeType.icon()}
                                        </button>
                                )}
                        </For>
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
                </div>
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
