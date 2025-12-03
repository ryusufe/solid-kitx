import type { SideBarProps } from ".";
import TableIcon from "../../assets/icons/table.svg?raw";
import FunctionIcon from "../../assets/icons/functions.svg?raw";
import CheckIcon from "../../assets/icons/check.svg?raw";

export type HelperType = { nodeTypes: NodeComponentType[] };

export interface NodeComponentType {
        type: string;
        label: string;
        description: string;
        defaultWidth: number;
        defaultHeight: number;
        defaultData: Record<string, any>;
        icon: string;
}

export const SideBarHelper = (props: SideBarProps): HelperType => {
        const nodeTypes: NodeComponentType[] = [
                {
                        type: "fields-node",
                        label: "Fields",
                        description:
                                "A structured set of fields for grouping data.",
                        defaultWidth: 250,
                        defaultHeight: 160,
                        defaultData: {
                                fields: ["field1 : Type", "field2"],
                                description: "Enter description here",
                        },
                        icon: TableIcon,
                },
                {
                        type: "function-node",
                        label: "Function",
                        description:
                                "Executes a function with inputs and outputs.",
                        defaultWidth: 245,
                        defaultHeight: 215,
                        defaultData: {
                                inputs: ["input1", "input2"],
                                outputs: ["result"],
                        },
                        icon: FunctionIcon,
                },
                {
                        type: "task-node",
                        label: "Tasks",
                        description:
                                "Represents a step or an action in a workflow.",
                        defaultWidth: 220,
                        defaultHeight: 110,
                        defaultData: {
                                tasks: [
                                        {
                                                description: "New step",
                                                done: false,
                                        },
                                ],
                        },
                        icon: CheckIcon,
                },
        ];

        return { nodeTypes };
};
