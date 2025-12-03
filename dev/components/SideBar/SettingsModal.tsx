import { createSignal, Show, For, Switch, Match } from "solid-js";
import XIcon from "../../assets/icons/x.svg?raw";
import type { LogicType } from "./logic";

interface SettingsModalProps {
        visible: boolean;
        onClose: () => void;
        logic: LogicType;
}

type TabId = "general" | "data" | "appearance";

interface Tab {
        id: TabId;
        label: string;
        icon?: string;
}

type SettingItem = {
        id: string;
        title: string;
        description: string;
} & (
        | {
                  type?: "button" | "toggle";
                  action: () => void;
          }
        | {
                  type?: "options";
                  options: string[];

                  action: (s?: string) => void;
          }
);

export const SettingsModal = (props: SettingsModalProps) => {
        const [activeTab, setActiveTab] = createSignal<TabId>("general");

        const tabs: Tab[] = [
                { id: "general", label: "General" },
                { id: "data", label: "Data" },
                { id: "appearance", label: "Appearance" },
        ];

        const getCurrentTheme = () => {
                return document.documentElement.classList.contains("dark")
                        ? "dark"
                        : "light";
        };

        const [theme, setTheme] = createSignal(getCurrentTheme());

        const toggleTheme = () => {
                document.documentElement.classList.toggle("dark");
                const newTheme = getCurrentTheme();
                localStorage.theme = newTheme;
                setTheme(newTheme);
        };

        const settingsByTab: Record<TabId, SettingItem[]> = {
                general: [
                        {
                                id: "theme",
                                title: "Theme",
                                description: `Switch between light and dark mode. Current theme: ${theme()}`,
                                action: toggleTheme,
                                type: "button",
                        },
                ],
                data: [
                        {
                                id: "export",
                                title: "Export Backup",
                                description:
                                        "Download a backup file containing all your nodes and connections. Use this to save your work or transfer it to another device.",
                                action: props.logic.exportAll,
                                type: "button",
                        },
                        {
                                id: "import",
                                title: "Import Backup",
                                description:
                                        "Load a previously saved backup file to restore your nodes and connections. This will replace your current work.",
                                action: props.logic.importAll,
                                type: "button",
                        },
                        {
                                id: "clear",
                                title: "Clear All Data",
                                description:
                                        "Delete all nodes and connections from the canvas. This action cannot be undone. Make sure to export a backup first if you want to keep your work.",
                                action: props.logic.clearAll,
                                type: "button",
                        },
                ],
                appearance: [
                        {
                                id: "bg-type",
                                title: "Background Type",
                                description: "Change Background type.",
                                //@ts-ignore
                                action: props.logic.onBackgroundType,
                                type: "options",
                                options: ["dot", "dash"],
                        },
                ],
        };

        return (
                <Show when={props.visible}>
                        <div
                                class="settings-backdrop"
                                onpointerdown={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        props.onClose();
                                }}
                                style={{
                                        position: "fixed",
                                        top: "0",
                                        left: "0",
                                        width: "100%",
                                        height: "100%",
                                        "background-color":
                                                "rgba(0, 0, 0, 0.5)",
                                        "z-index": "100",
                                        display: "flex",
                                        "justify-content": "center",
                                        "align-items": "center",
                                }}
                        >
                                <div
                                        class="settings-modal"
                                        onpointerdown={(e) =>
                                                e.stopPropagation()
                                        }
                                        style={{
                                                "background-color":
                                                        "var(--node-bg, #ffffff)",
                                                "border-radius": "12px",
                                                "box-shadow":
                                                        "0 10px 40px rgba(0, 0, 0, 0.3)",
                                                width: "min(900px, 90vw)",
                                                height: "min(500px, 80vh)",
                                                display: "flex",
                                                overflow: "hidden",
                                                color: "var(--node-color, #000000)",
                                        }}
                                >
                                        <div
                                                class="settings-sidebar"
                                                style={{
                                                        width: "200px",
                                                        "background-color":
                                                                "var(--controls-bg, #f5f5f5)",
                                                        "border-right":
                                                                "1px solid var(--node-outline-color, #e0e0e0)",
                                                        padding: "1.5rem 0",
                                                        display: "flex",
                                                        "flex-direction":
                                                                "column",
                                                        gap: "0.5rem",
                                                }}
                                        >
                                                <div
                                                        style={{
                                                                "padding-inline":
                                                                        "1.5rem",
                                                                "margin-bottom":
                                                                        "1rem",
                                                        }}
                                                >
                                                        <h2
                                                                style={{
                                                                        margin: "0",
                                                                        "font-size":
                                                                                "1.25rem",
                                                                        "font-weight":
                                                                                "600",
                                                                }}
                                                        >
                                                                Settings
                                                        </h2>
                                                </div>
                                                <For each={tabs}>
                                                        {(tab) => (
                                                                <button
                                                                        class="settings-tab"
                                                                        classList={{
                                                                                active:
                                                                                        activeTab() ===
                                                                                        tab.id,
                                                                        }}
                                                                        onpointerdown={() =>
                                                                                setActiveTab(
                                                                                        tab.id,
                                                                                )
                                                                        }
                                                                        style={{
                                                                                background:
                                                                                        activeTab() ===
                                                                                        tab.id
                                                                                                ? "var(--controls-button-bg, #ffffff)"
                                                                                                : "transparent",
                                                                                border: "none",
                                                                                padding: "0.75rem 1.5rem",
                                                                                "text-align":
                                                                                        "left",
                                                                                cursor: "pointer",
                                                                                "font-size":
                                                                                        "0.95rem",
                                                                                color: "var(--node-color, #000000)",

                                                                                "font-weight":
                                                                                        activeTab() ===
                                                                                        tab.id
                                                                                                ? "500"
                                                                                                : "400",
                                                                        }}
                                                                >
                                                                        {
                                                                                tab.label
                                                                        }
                                                                </button>
                                                        )}
                                                </For>
                                        </div>

                                        <div
                                                class="settings-content"
                                                style={{
                                                        flex: "1",
                                                        padding: "2rem",
                                                        "overflow-y": "auto",
                                                        display: "flex",
                                                        "flex-direction":
                                                                "column",
                                                        gap: "1.5rem",
                                                }}
                                        >
                                                <div
                                                        style={{
                                                                display: "flex",
                                                                "justify-content":
                                                                        "space-between",
                                                                "align-items":
                                                                        "center",
                                                                "margin-bottom":
                                                                        "0.5rem",
                                                        }}
                                                >
                                                        <h3
                                                                style={{
                                                                        margin: "0",
                                                                        "font-size":
                                                                                "1.5rem",
                                                                        "font-weight":
                                                                                "600",
                                                                        "text-transform":
                                                                                "capitalize",
                                                                }}
                                                        >
                                                                {activeTab()}
                                                        </h3>
                                                        <button
                                                                class="close-button"
                                                                onpointerdown={
                                                                        props.onClose
                                                                }
                                                                style={{
                                                                        background: "transparent",
                                                                        border: "none",
                                                                        cursor: "pointer",
                                                                        padding: "0.5rem",
                                                                        "border-radius":
                                                                                "6px",
                                                                        display: "flex",
                                                                        "align-items":
                                                                                "center",
                                                                        "justify-content":
                                                                                "center",
                                                                }}
                                                                innerHTML={
                                                                        XIcon
                                                                }
                                                        ></button>
                                                </div>

                                                <div
                                                        style={{
                                                                display: "flex",
                                                                "flex-direction":
                                                                        "column",
                                                                gap: "1rem",
                                                        }}
                                                >
                                                        <For
                                                                each={
                                                                        settingsByTab[
                                                                                activeTab()
                                                                        ]
                                                                }
                                                        >
                                                                {(
                                                                        setting: SettingItem,
                                                                ) => (
                                                                        <div
                                                                                class="setting-item"
                                                                                style={{
                                                                                        display: "flex",
                                                                                        height: "10em",
                                                                                        gap: "1rem",
                                                                                        "align-items":
                                                                                                "flex-start",
                                                                                }}
                                                                        >
                                                                                <div
                                                                                        style={{
                                                                                                flex: "1",
                                                                                        }}
                                                                                >
                                                                                        <h4
                                                                                                style={{
                                                                                                        margin: "0 0 0.5rem 0",
                                                                                                        "font-size":
                                                                                                                "1.1rem",
                                                                                                        "font-weight":
                                                                                                                "500",
                                                                                                }}
                                                                                        >
                                                                                                {
                                                                                                        setting.title
                                                                                                }
                                                                                        </h4>
                                                                                        <p
                                                                                                style={{
                                                                                                        margin: "0",
                                                                                                        "font-size":
                                                                                                                "0.8rem",
                                                                                                        color: "var(--label-color, #666666)",
                                                                                                        "line-height":
                                                                                                                "1.5",
                                                                                                }}
                                                                                        >
                                                                                                {
                                                                                                        setting.description
                                                                                                }
                                                                                        </p>
                                                                                </div>
                                                                                <Switch>
                                                                                        <Match
                                                                                                when={
                                                                                                        setting.type &&
                                                                                                        [
                                                                                                                "button",
                                                                                                                "toggle",
                                                                                                        ].includes(
                                                                                                                setting.type,
                                                                                                        )
                                                                                                }
                                                                                        >
                                                                                                <button
                                                                                                        class="setting-action-button"
                                                                                                        onpointerdown={(
                                                                                                                e,
                                                                                                        ) => {
                                                                                                                e.stopPropagation();
                                                                                                                setting.action();
                                                                                                        }}
                                                                                                        style={{
                                                                                                                "flex-shrink":
                                                                                                                        "0",
                                                                                                                padding: "0.5rem 1rem",
                                                                                                                "background-color":
                                                                                                                        "var(--node-outline, #1a73e8)",
                                                                                                                color: "#ffffff",
                                                                                                                border: "none",
                                                                                                                "border-radius":
                                                                                                                        "6px",
                                                                                                                cursor: "pointer",
                                                                                                                "font-size":
                                                                                                                        "0.9rem",
                                                                                                                "font-weight":
                                                                                                                        "500",

                                                                                                                "white-space":
                                                                                                                        "nowrap",
                                                                                                        }}
                                                                                                >
                                                                                                        {setting.id ===
                                                                                                        "theme"
                                                                                                                ? "Toggle"
                                                                                                                : setting.id ===
                                                                                                                  "clear"
                                                                                                                ? "Clear"
                                                                                                                : setting.id ===
                                                                                                                  "export"
                                                                                                                ? "Export"
                                                                                                                : "Import"}
                                                                                                </button>
                                                                                        </Match>
                                                                                        <Match
                                                                                                when={
                                                                                                        setting.type &&
                                                                                                        setting.type ===
                                                                                                                "options"
                                                                                                }
                                                                                        >
                                                                                                <select
                                                                                                        onchange={(
                                                                                                                e,
                                                                                                        ) => {
                                                                                                                setting.action(
                                                                                                                        e
                                                                                                                                .currentTarget
                                                                                                                                .value,
                                                                                                                );
                                                                                                        }}
                                                                                                >
                                                                                                        <For
                                                                                                                each={
                                                                                                                        setting.type ===
                                                                                                                                "options" &&
                                                                                                                        setting.options
                                                                                                                }
                                                                                                        >
                                                                                                                {(
                                                                                                                        i,
                                                                                                                ) => (
                                                                                                                        <option
                                                                                                                                value={
                                                                                                                                        i
                                                                                                                                }
                                                                                                                        >
                                                                                                                                {
                                                                                                                                        i
                                                                                                                                }
                                                                                                                        </option>
                                                                                                                )}
                                                                                                        </For>
                                                                                                </select>
                                                                                        </Match>
                                                                                </Switch>
                                                                        </div>
                                                                )}
                                                        </For>

                                                        <Show
                                                                when={
                                                                        settingsByTab[
                                                                                activeTab()
                                                                        ]
                                                                                .length ===
                                                                        0
                                                                }
                                                        >
                                                                <div
                                                                        style={{
                                                                                padding: "3rem",
                                                                                "text-align":
                                                                                        "center",
                                                                                color: "var(--label-color, #999999)",
                                                                        }}
                                                                >
                                                                        <p
                                                                                style={{
                                                                                        margin: "0",
                                                                                        "font-size":
                                                                                                "1rem",
                                                                                }}
                                                                        >
                                                                                No
                                                                                settings
                                                                                available
                                                                                in
                                                                                this
                                                                                category
                                                                                yet.
                                                                        </p>
                                                                </div>
                                                        </Show>
                                                </div>
                                        </div>
                                </div>
                        </div>
                </Show>
        );
};
