import { NodeType } from "./node";

export const configKeys = [
        "disableZoom",
        "minZoom",
        "maxZoom",
        "disableNodeDrag",
        "disableEdgeDrag",
        "gridSize",
        "minNodeWidth",
        "maxNodeWidth",
        "minNodeHeight",
        "maxNodeHeight",
        "defaultNode",
        "disableAnchorConnectionCreation",
        "disableKeyboardShortcuts",
        // "enableHistory",
        // "historyLimit",
] as const;

export interface Configs {
        // Viewport / Interaction
        disableZoom?: boolean;
        minZoom?: number;
        maxZoom?: number;
        // zoomStep?: number;

        // Dragging
        disableNodeDrag?: boolean;
        disableEdgeDrag?: boolean;
        gridSize?: number;

        // Resizing
        minNodeWidth?: number;
        maxNodeWidth?: number;
        minNodeHeight?: number;
        maxNodeHeight?: number;

        // Node Creation
        defaultNode?: Partial<NodeType>;

        // Connection Creation
        disableAnchorConnectionCreation?: boolean;
        // defaultConnectionType?: "freeform" | "orthogonal" | "straight";

        // Keyboard
        disableKeyboardShortcuts?: boolean;

        // History
        // enableHistory?: boolean;
        // historyLimit?: number;

        // disallowOverlappingNodes?: boolean;
}
