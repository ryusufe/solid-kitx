import type { SideBarProps } from ".";

export type HelperType = { nodeTypes: NodeComponentType[] };

export interface NodeComponentType {
        type: string;
        label: string;
        description: string;
        defaultWidth: number;
        defaultHeight: number;
        defaultData: Record<string, any>;
        icon: () => any;
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
                                fields: ["field1", "field2"],
                                description: "Enter description here",
                        },
                        icon: () => (
                                <svg
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        stroke-width="2"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        style={{ "pointer-events": "none" }}
                                >
                                        <rect
                                                x="3"
                                                y="3"
                                                width="18"
                                                height="18"
                                                rx="2"
                                                ry="2"
                                        />
                                        <line x1="9" y1="3" x2="9" y2="21" />
                                        <line x1="3" y1="9" x2="21" y2="9" />
                                        <line x1="3" y1="15" x2="21" y2="15" />
                                </svg>
                        ),
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
                        icon: () => (
                                <svg
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        stroke-width="2"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        style={{ "pointer-events": "none" }}
                                >
                                        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                                        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                                        <circle cx="12" cy="12" r="2" />
                                        <path d="M12 7v3" />
                                        <path d="M12 14v3" />
                                </svg>
                        ),
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
                        icon: () => (
                                <svg
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        stroke-width="2"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        style={{ "pointer-events": "none" }}
                                >
                                        <path d="M9 11l3 3L22 4" />
                                        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                                </svg>
                        ),
                },
        ];

        return { nodeTypes };
};
