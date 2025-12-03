import {
        Component,
        For,
        createSignal,
        onMount,
        onCleanup,
        createEffect,
        createMemo,
        Show,
} from "solid-js";
import { Kit, NodeType } from "solid-kitx";

interface FieldsData {
        fields: string[];
        description: string;
}

interface FieldsNodeProps {
        node: NodeType<FieldsData>;
        kit: Kit;
}

const FieldsNode: Component<FieldsNodeProps> = (props) => {
        const [focusIndex, setFocusIndex] = createSignal<number | null>(null);

        const handleDescriptionUpdate = (text: string) => {
                props.kit.setNodes(
                        (n: NodeType) => n.id === props.node.id,
                        "data",
                        "extra",
                        "description",
                        text,
                );
        };

        const handleFieldUpdate = (index: number, newValue: string) => {
                if (!newValue) {
                        props.kit.setNodes(
                                (n: NodeType) => n.id === props.node.id,
                                "data",
                                "extra",
                                "fields",
                                props.node.data?.extra?.fields.filter(
                                        (_, i) => i !== index,
                                ),
                        );
                } else {
                        props.kit.setNodes(
                                (n: NodeType) => n.id === props.node.id,
                                "data",
                                "extra",
                                "fields",
                                index,
                                newValue,
                        );
                }
        };

        const addField = () => {
                const newIndex = props.node.data?.extra?.fields?.length ?? 0;
                props.kit.setNodes(
                        (n: NodeType) => n.id === props.node.id,
                        "data",
                        "extra",
                        "fields",
                        [...(props.node.data?.extra?.fields ?? []), ""],
                );
        };

        return (
                <div class="fields-node">
                        <div>
                                <textarea
                                        value={
                                                props.node.data?.extra
                                                        ?.description ?? ""
                                        }
                                        onInput={(e) =>
                                                handleDescriptionUpdate(
                                                        e.currentTarget.value,
                                                )
                                        }
                                        onchange={() => props.kit.updateNodes()}
                                />
                        </div>

                        <div>
                                <For
                                        each={
                                                (
                                                        props.node.data
                                                                ?.extra as
                                                                | FieldsData
                                                                | undefined
                                                )?.fields || []
                                        }
                                >
                                        {(field, index) => {
                                                const [value, setValue] =
                                                        createSignal(field);
                                                const rightPart = createMemo(
                                                        () =>
                                                                value().includes(
                                                                        ":",
                                                                ) &&
                                                                value().split(
                                                                        ":",
                                                                )[1],
                                                );
                                                const focused = createMemo(
                                                        () =>
                                                                focusIndex() ===
                                                                index(),
                                                );
                                                let inputRef!: HTMLInputElement;

                                                createEffect(() => {
                                                        if (focused()) {
                                                                inputRef?.focus();
                                                                inputRef?.select();
                                                        }
                                                });

                                                return (
                                                        <div class="field-item">
                                                                <div class="field-dot" />
                                                                <input
                                                                        ref={
                                                                                inputRef
                                                                        }
                                                                        type="text"
                                                                        onfocus={() =>
                                                                                setFocusIndex(
                                                                                        index(),
                                                                                )
                                                                        }
                                                                        onblur={() =>
                                                                                setFocusIndex(
                                                                                        null,
                                                                                )
                                                                        }
                                                                        value={
                                                                                focused()
                                                                                        ? value()
                                                                                        : value().split(
                                                                                                  ":",
                                                                                          )[0]
                                                                        }
                                                                        onkeydown={(
                                                                                e,
                                                                        ) => {
                                                                                if (
                                                                                        e.key ===
                                                                                        "Enter"
                                                                                )
                                                                                        addField();
                                                                        }}
                                                                        oninput={(
                                                                                e,
                                                                        ) =>
                                                                                setValue(
                                                                                        e
                                                                                                .currentTarget
                                                                                                .value,
                                                                                )
                                                                        }
                                                                        onChange={(
                                                                                e,
                                                                        ) => {
                                                                                handleFieldUpdate(
                                                                                        index(),
                                                                                        e
                                                                                                .currentTarget
                                                                                                .value,
                                                                                );
                                                                                props.kit.updateNodes();
                                                                        }}
                                                                />
                                                                <Show
                                                                        when={
                                                                                !focused() &&
                                                                                rightPart()
                                                                        }
                                                                >
                                                                        <div
                                                                                style={{
                                                                                        position: "absolute",
                                                                                        right: 0,
                                                                                        height: "100%",
                                                                                        display: "flex",
                                                                                        "align-items":
                                                                                                "center",
                                                                                        "padding-inline":
                                                                                                "5px",
                                                                                        background: "#1a73e8",
                                                                                        color: "white",
                                                                                }}
                                                                        >
                                                                                {
                                                                                        field.split(
                                                                                                ":",
                                                                                        )[1]
                                                                                }
                                                                        </div>
                                                                </Show>
                                                        </div>
                                                );
                                        }}
                                </For>
                        </div>
                </div>
        );
};

export default FieldsNode;
