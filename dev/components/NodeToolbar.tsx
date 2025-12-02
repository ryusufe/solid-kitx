import { createMemo, createSignal, Match, Switch } from "solid-js";
import { reconcile } from "solid-js/store";
import { ConnectionType, Kit, NodeType } from "solid-kitx";

const NodeToolbar = (props: { kit: Kit; node: NodeType }) => {
        const isTaskNode = createMemo(
                () => props.node.data?.component === "task-node",
        );
        const removeNode = () => {
                const n_id = props.node.id;
                props.kit.setConnections(
                        reconcile(
                                props.kit.connections.filter(
                                        (c) =>
                                                c.from.id !== n_id &&
                                                c.to.id !== n_id,
                                ),
                        ),
                );
                props.kit.setNodes(
                        reconcile(props.kit.nodes.filter((n) => n.id !== n_id)),
                );
                props.kit.updateNodes();
        };
        const addField = () => {
                props.kit.setNodes(
                        (n: NodeType) => n.id === props.node.id,
                        "data",
                        "extra",
                        "fields",
                        [
                                "new field",
                                ...(props.node.data?.extra?.fields ?? []),
                        ],
                );
        };
        const addTask = () => {
                props.kit.setNodes(
                        (n: NodeType) => n.id === props.node.id,
                        "data",
                        "extra",
                        "tasks",
                        [
                                { description: "new task", done: false },
                                ...props.node.data?.extra.tasks,
                        ],
                );
        };

        return (
                <div class="kit-controls" style={{ "--flex-direction": "row" }}>
                        <button onpointerdown={removeNode} title="Remove Node">
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
                        <Switch>
                                <Match
                                        when={[
                                                "fields-node",
                                                "task-node",
                                        ].includes(props.node.data?.component!)}
                                >
                                        <button
                                                onpointerdown={
                                                        isTaskNode()
                                                                ? addTask
                                                                : addField
                                                }
                                                title={
                                                        isTaskNode()
                                                                ? "Add Task"
                                                                : "Add field"
                                                }
                                        >
                                                <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        viewBox="0 0 24 24"
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
                                                        <path d="M12 5l0 14" />
                                                        <path d="M5 12l14 0" />
                                                </svg>
                                        </button>
                                </Match>
                        </Switch>
                </div>
        );
};

export default NodeToolbar;
