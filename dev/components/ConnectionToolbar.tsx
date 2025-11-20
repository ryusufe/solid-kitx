import { ConnectionType, Kit, NodeType } from "solid-kitx";

const ConnectionToolbar = (props: { kit: Kit; connection: ConnectionType }) => {
        const changeLineColor = () => {
                const input = document.createElement("input");
                input.type = "color";
                input.click();
                input.addEventListener("input", () => {
                        console.log(input.value);
                        props.kit.setConnections((prev: ConnectionType[]) =>
                                prev.map((c) =>
                                        c.id === props.connection.id
                                                ? {
                                                          ...c,
                                                          style: {
                                                                  ...c.style,
                                                                  stroke: input.value,
                                                          },
                                                  }
                                                : c,
                                ),
                        );
                        props.kit.updateConnections();
                });
        };

        const removeConnection = () => {
                props.kit.setConnections((prev: ConnectionType[]) =>
                        prev.filter((n) => n.id !== props.connection.id),
                );
                props.kit.updateConnections();
        };

        return (
                <div class="kit-controls" style={{ "--flex-direction": "row" }}>
                        <button onclick={removeConnection}>
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
                        <button onclick={changeLineColor}>
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

export default ConnectionToolbar;
