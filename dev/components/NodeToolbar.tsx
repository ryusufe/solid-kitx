import { ConnectionType, Kit, NodeType } from "solid-kitx";

const NodeToolbar = (props: { kit: Kit; node: NodeType }) => {
        const changeOutlineColor = () => {
                const input = document.createElement("input");
                input.type = "color";
                input.click();
                input.addEventListener("input", () => {
                        // certain css properties depend on the state (hover, active, ...) of the node, and the example below overrides
                        // all of those so it will be a static color, a better solution would be assiging that value to a custom css variable
                        // then apply it inside a css file under the class of that node (.node or (node as NodeType).class)
                        props.kit.setNodes((prev: NodeType[]) =>
                                prev.map((n) =>
                                        n.id === props.node.id
                                                ? {
                                                          ...n,
                                                          style: {
                                                                  ...n.style,
                                                                  "outline-color":
                                                                          input.value,
                                                          },
                                                  }
                                                : n,
                                ),
                        );
                        props.kit.updateNodes();
                });
        };

        const removeNode = () => {
                const n_id = props.node.id;
                props.kit.setConnections((prev: ConnectionType[]) =>
                        prev.filter(
                                (c) => c.from.id !== n_id && c.to.id !== n_id,
                        ),
                );
                props.kit.setNodes((prev: NodeType[]) =>
                        prev.filter((n) => n.id !== n_id),
                );
                props.kit.updateNodes();
        };

        return (
                <div class="kit-controls" style={{ "--flex-direction": "row" }}>
                        <button onclick={removeNode} ontouchstart={removeNode}>
                                <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        stroke-width="2"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        class="icon icon-tabler icons-tabler-outline icon-tabler-trash"
                                >
                                        <path
                                                stroke="none"
                                                d="M0 0h24v24H0z"
                                                fill="none"
                                        />
                                        <path d="M4 7l16 0" />
                                        <path d="M10 11l0 6" />
                                        <path d="M14 11l0 6" />
                                        <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
                                        <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
                                </svg>
                        </button>
                        <button
                                onclick={changeOutlineColor}
                                ontouchstart={changeOutlineColor}
                                title="Changes outline color"
                        >
                                <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        stroke-width="2"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        class="icon icon-tabler icons-tabler-outline icon-tabler-palette"
                                >
                                        <path
                                                stroke="none"
                                                d="M0 0h24v24H0z"
                                                fill="none"
                                        />
                                        <path d="M12 21a9 9 0 0 1 0 -18c4.97 0 9 3.582 9 8c0 1.06 -.474 2.078 -1.318 2.828c-.844 .75 -1.989 1.172 -3.182 1.172h-2.5a2 2 0 0 0 -1 3.75a1.3 1.3 0 0 1 -1 2.25" />
                                        <path d="M8.5 10.5m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
                                        <path d="M12.5 7.5m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
                                        <path d="M16.5 10.5m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
                                </svg>
                        </button>
                </div>
        );
};

export default NodeToolbar;
