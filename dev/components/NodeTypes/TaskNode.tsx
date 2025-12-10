import { Accessor, Component, createMemo, For, Show } from "solid-js";
import { Kit, NodeType } from "solid-kitx";

interface TaskItem {
        done: boolean;
        description: string;
}

interface TaskData {
        tasks: TaskItem[];
}

interface TaskNodeProps {
        node: NodeType<TaskData>;
        kit: Kit;
        index: Accessor<number>;
}

const TaskNode: Component<TaskNodeProps> = (props) => {
        const allDone = createMemo(
                () => props.node.data?.extra?.tasks.every((t) => t.done),
        );

        const toggleDone = (index: number) => {
                props.kit.setNodes(
                        props.index(),
                        "data",
                        "extra",
                        "tasks",
                        index,
                        "done",
                        (v: boolean) => !v,
                );
                props.kit.updateNodes();
        };

        const saveDescription = (index: number, newValue: string) => {
                props.kit.setNodes(
                        props.index(),
                        "data",
                        "extra",
                        "tasks",
                        index,
                        "description",
                        newValue,
                );
                props.kit.updateNodes();
        };

        return (
                <div class="task-node">
                        <div
                                classList={{
                                        "status-badge": true,
                                        completed: allDone(),
                                        pending: !allDone(),
                                }}
                        >
                                <Show when={allDone()} fallback={"○ Pending"}>
                                        ✓ Completed
                                </Show>
                        </div>
                        <For each={props.node.data?.extra?.tasks}>
                                {(task, index) => (
                                        <div class="task-item">
                                                <div
                                                        onpointerdown={() =>
                                                                toggleDone(
                                                                        index(),
                                                                )
                                                        }
                                                        classList={{
                                                                checkbox: true,
                                                                checked: task.done,
                                                        }}
                                                >
                                                        <Show when={task.done}>
                                                                <svg
                                                                        width="14"
                                                                        height="14"
                                                                        viewBox="0 0 24 24"
                                                                        fill="none"
                                                                        stroke="white"
                                                                        stroke-width="3"
                                                                        stroke-linecap="round"
                                                                        stroke-linejoin="round"
                                                                >
                                                                        <polyline points="20 6 9 17 4 12" />
                                                                </svg>
                                                        </Show>
                                                </div>

                                                <div class="task-content">
                                                        <div>
                                                                <textarea
                                                                        value={
                                                                                task.description
                                                                        }
                                                                        onchange={(
                                                                                e,
                                                                        ) =>
                                                                                saveDescription(
                                                                                        index(),
                                                                                        e
                                                                                                .currentTarget
                                                                                                .value,
                                                                                )
                                                                        }
                                                                />
                                                        </div>
                                                </div>
                                        </div>
                                )}
                        </For>
                </div>
        );
};

export default TaskNode;
