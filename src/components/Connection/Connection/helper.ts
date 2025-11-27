import { NodeType } from "src/types";
import type { ConnectionProps } from ".";

export type HelperType = {
        getNodeRect: (id: string) => NodeType;
};

export const ConnectionHelper = (props: ConnectionProps): HelperType => {
        const getNodeRect = (id: string) =>
                props.kit.nodes.find((i) => i.id === id)!;
        return {
                getNodeRect,
        };
};

