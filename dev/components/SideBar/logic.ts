import { SideBarProps } from ".";
import type { StateType } from "./state";
import type { HelperType } from "./helper";
import { createEffect, on, onCleanup, onMount } from "solid-js";
import { ConnectionType, NodeType, ViewPort } from "solid-kitx";
import { unwrap } from "solid-js/store";

interface Data {
        nodes: NodeType[];
        connections: ConnectionType[];
        viewport: ViewPort;
}
export type LogicType = {
        clearAll: () => void;
        exportAll: () => void;
        importAll: () => void;
};

export const SideBarLogic = (
        state: StateType,
        props: SideBarProps,
        helper?: HelperType,
): LogicType => {
        const kit = props.kit;
        const keydown = (e: KeyboardEvent) => {
                if (e.shiftKey && e.key === " ") {
                        props.kit.setFocus((prev) => !prev);
                }
        };
        const clearAll = () => {
                if (confirm("Are you sure you want to remove everything?")) {
                        localStorage.removeItem("nodes");
                        localStorage.removeItem("connections");
                        localStorage.removeItem("vp");
                        window.location.reload();
                }
        };
        const exportAll = () => {
                const data: Data = {
                        nodes: unwrap(kit.nodes),
                        connections: unwrap(kit.connections),
                        viewport: kit.viewport(),
                };

                const json = JSON.stringify(data, null, 2);
                const blob = new Blob([json], { type: "application/json" });

                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = "solid-kitx-export.json";
                a.click();
                URL.revokeObjectURL(url);
        };

        const importAll = () => {
                const input = document.createElement("input");
                input.type = "file";
                input.accept = "application/json";

                input.onchange = async (e: Event) => {
                        const file = (e.target as HTMLInputElement).files?.[0];
                        if (!file) return;

                        try {
                                const text = await file.text();
                                const parsed = JSON.parse(text);

                                if (
                                        !parsed.nodes ||
                                        !parsed.connections ||
                                        !parsed.viewport
                                ) {
                                        alert(
                                                "Invalid file format. Missing required fields.",
                                        );
                                        return;
                                }

                                kit.setNodes(parsed.nodes);

                                kit.setConnections(parsed.connections);

                                kit.setViewport(parsed.viewport);
                                kit.updateNodes();
                                kit.updateConnections();
                                kit.updateViewport();

                                console.log("Import successful:", parsed);
                        } catch (err) {
                                console.error(err);
                                alert("Failed to read file.");
                        }
                };

                input.click();
        };

        onMount(() => {
                window.addEventListener("keydown", keydown);
        });
        onCleanup(() => {
                window.removeEventListener("keydown", keydown);
        });
        return { clearAll, exportAll, importAll };
};
