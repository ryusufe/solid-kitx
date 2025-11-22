import { Component, createMemo, createSignal, For } from "solid-js";
import { Kit, NodeType } from "solid-kitx";
const colors = [
        "#fee440",
        "#00f6ed",
        "#4cc9f0",
        "#4361ee",
        "#3a0ca3",
        "#ff006e",
        "#fb5607",
        "#ffbe0b",
        "#8338ec",
        "#3a86ff",

        "#06d6a0",
        "#1b9aaa",
        "#ef476f",
        "#ffc43d",
        "#eeeeee",
        "#8ac926",
        "#ff595e",
        "#1982c4",
        "#6a4c93",
        "#a1c181",

        "#ff9f1c",
        "#2ec4b6",
        "#e71d36",
        "#011627",
        "#b56576",
        "#6d6875",
        "#4cc9f0",
        "#80ffdb",
        "#edf6f9",
        "#c9ada7",
];

const ExampleStatus: Component<{ kit: Kit; node: NodeType }> = (props) => {
        let property = "outline-color";
        const selected = createMemo((prev) => {
                const selectedItems = props.kit.selectedItems();
                const size = selectedItems.size;
                if (size === 0) return "Select a node";
                const s = selectedItems.values().next().value;
                if (s === props.node.id)
                        return typeof prev === "string"
                                ? prev
                                : "Select a node";
                return s;
        });
        const onSelect = (c: string) => {
                if (selected() === "Select") return;
                props.kit.setNodes((prev: NodeType[]) =>
                        prev.map((n) =>
                                n.id === selected()
                                        ? {
                                                  ...n,
                                                  style: {
                                                          ...n.style,
                                                          [property]: c,
                                                  },
                                          }
                                        : n,
                        ),
                );
        };
        return (
                <div
                        style={{
                                width: "100%",
                                height: "100%",
                                "background-color": "#272727",
                                color: "white",
                                "align-items": "center",
                                display: "flex",
                                "flex-direction": "column",
                                "justify-content": "space-between",
                                padding: "14px",
                                "border-radius": "8px",
                                "box-sizing": "border-box",
                                "font-family": "sans-serif",
                                "font-size": "14px",
                        }}
                >
                        <div
                                style={{
                                        display: "flex",
                                        "justify-content": "space-between",
                                        width: "100%",
                                        "align-items": "center",
                                }}
                        >
                                <div>{selected()}</div>
                                <div
                                        style={{
                                                width: "12px",
                                                height: "12px",
                                                "border-radius": "50%",
                                                "background-color": "#22c55e",
                                                "box-shadow": "0 0 4px #22c55e",
                                        }}
                                />
                        </div>
                        <div
                                style={{
                                        "margin-top": "10px",
                                        display: "grid",
                                        "grid-template-columns":
                                                "repeat(5, 1fr)",
                                        "grid-template-rows": "repeat(6, 1fr)",
                                        gap: "4px",
                                        width: "100%",
                                        flex: 1,
                                        "box-sizing": "border-box",
                                }}
                        >
                                <For each={colors}>
                                        {(c) => (
                                                <div
                                                        onclick={() =>
                                                                onSelect(c)
                                                        }
                                                        ontouchstart={() =>
                                                                onSelect(c)
                                                        }
                                                        style={{
                                                                "background-color":
                                                                        c,
                                                                width: "100%",
                                                                height: "100%",
                                                                cursor: "pointer",
                                                                "border-radius":
                                                                        "4px",
                                                                "box-shadow":
                                                                        "0 0 3px rgba(0,0,0,0.4)",
                                                        }}
                                                />
                                        )}
                                </For>
                        </div>
                        <select
                                style={{ width: "100%", "margin-top": "10px" }}
                                onchange={(v) => {
                                        property = v.currentTarget.value;
                                }}
                        >
                                <option value="outline-color">outline</option>
                                <option value="color">text</option>
                                <option value="background-color">
                                        background
                                </option>
                        </select>
                </div>
        );
};

export default ExampleStatus;
