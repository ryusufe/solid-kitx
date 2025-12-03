import { Component, For } from "solid-js";
import { Kit, NodeType } from "solid-kitx";

interface FunctionData {
        inputs: string[];
        outputs: string[];
}

interface FunctionNodeProps {
        node: NodeType<FunctionData>;
        kit: Kit;
}

const FunctionNode: Component<FunctionNodeProps> = (props) => {
        const handlePropUpdate = (index: number, newValue: string) => {
                if (!newValue) {
                        props.kit.setNodes(
                                (n: NodeType) => n.id === props.node.id,
                                "data",
                                "extra",
                                "inputs",
                                props.node.data?.extra?.inputs.filter(
                                        (_, i) => i !== index,
                                ),
                        );
                } else {
                        props.kit.setNodes(
                                (n: NodeType) => n.id === props.node.id,
                                "data",
                                "extra",
                                "inputs",
                                index,
                                newValue,
                                // props.node.data?.extra?.inputs.map((v, i) =>
                                //         i !== index ? newValue : v,
                                // ),
                        );
                }
                props.kit.updateNodes();
        };

        const handleOutputUpdate = (index: number, newValue: string) => {
                if (!newValue) {
                        props.kit.setNodes(
                                (n: NodeType) => n.id === props.node.id,
                                "data",
                                "extra",
                                "outputs",
                                props.node.data?.extra?.outputs.filter(
                                        (_, i) => i !== index,
                                ),
                        );
                } else {
                        props.kit.setNodes(
                                (n: NodeType) => n.id === props.node.id,
                                "data",
                                "extra",
                                "outputs",
                                index,
                                newValue,
                                // props.node.data?.extra?.outputs.map((v, i) =>
                                //         i !== index ? newValue : v,
                                // ),
                        );
                }
                props.kit.updateNodes();
        };

        const addInput = () => {
                addItem("inputs", [
                        "new input",
                        ...(props.node.data?.extra?.inputs ?? []),
                ]);
        };
        const addOutput = () => {
                addItem("outputs", [
                        "new output",
                        ...(props.node.data?.extra?.outputs ?? []),
                ]);
        };
        const addItem = (type: "inputs" | "outputs", l: string[]) => {
                props.kit.setNodes(
                        (n: NodeType) => n.id === props.node.id,
                        "data",
                        "extra",
                        type,
                        l,
                );
                props.kit.updateNodes();
        };

        return (
                <div class="function-node">
                        <div class="section">
                                <div class="section-header">
                                        Inputs
                                        <button
                                                onpointerdown={addInput}
                                                class="btn"
                                        >
                                                +
                                        </button>
                                </div>
                                <For
                                        each={
                                                (
                                                        props.node.data
                                                                ?.extra as
                                                                | FunctionData
                                                                | undefined
                                                )?.inputs || []
                                        }
                                >
                                        {(prop, index) => (
                                                <div class="input-item">
                                                        <span class="icon">
                                                                ▸
                                                        </span>
                                                        <input
                                                                type="text"
                                                                value={prop}
                                                                onchange={(e) =>
                                                                        handlePropUpdate(
                                                                                index(),
                                                                                e
                                                                                        .currentTarget
                                                                                        .value,
                                                                        )
                                                                }
                                                        />
                                                </div>
                                        )}
                                </For>
                        </div>

                        <div class="divider" />

                        <div class="section">
                                <div class="section-header">
                                        Outputs
                                        <button
                                                onpointerdown={addOutput}
                                                class="btn"
                                        >
                                                +
                                        </button>
                                </div>
                                <For
                                        each={
                                                (
                                                        props.node.data
                                                                ?.extra as
                                                                | FunctionData
                                                                | undefined
                                                )?.outputs || []
                                        }
                                >
                                        {(output, index) => (
                                                <div class="output-item">
                                                        <span class="icon">
                                                                ◂
                                                        </span>
                                                        <input
                                                                type="text"
                                                                value={output}
                                                                onchange={(e) =>
                                                                        handleOutputUpdate(
                                                                                index(),
                                                                                e
                                                                                        .currentTarget
                                                                                        .value,
                                                                        )
                                                                }
                                                        />
                                                </div>
                                        )}
                                </For>
                        </div>
                </div>
        );
};

export default FunctionNode;
