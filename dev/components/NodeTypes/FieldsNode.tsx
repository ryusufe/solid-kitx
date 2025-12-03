import {
        Component,
        For,
        createSignal,
        onMount,
        onCleanup,
        createEffect,
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

                setFocusIndex(newIndex);
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
                                                let inputRef!: HTMLInputElement;

                                                createEffect(() => {
                                                        if (
                                                                focusIndex() ===
                                                                index()
                                                        ) {
                                                                inputRef?.focus();
                                                                inputRef?.select();
                                                                setFocusIndex(
                                                                        null,
                                                                );
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
                                                                        value={
                                                                                field
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
                                                        </div>
                                                );
                                        }}
                                </For>
                        </div>
                </div>
        );
};

export default FieldsNode;
