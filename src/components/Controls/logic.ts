import { ControlsProps } from ".";
import type { StateType } from "./state";
import type { HelperType } from "./helper";

export type LogicType = {
        zoomIn: () => void;
        zoomOut: () => void;
        fitView: () => void;
};

export const ControlsLogic = (
        state: StateType,
        props: ControlsProps,
        helper?: HelperType,
): LogicType => {
        const zoomIn = () => {
                const prev = props.kit.viewport();
                const zoomPer = Math.min(5, prev.zoom + 0.1);
                props.kit.setViewport({
                        ...prev,
                        zoom: zoomPer,
                });
                props.kit.updateViewport();
        };

        const zoomOut = () => {
                const prev = props.kit.viewport();
                props.kit.setViewport({
                        ...prev,
                        zoom: Math.max(0.1, prev.zoom - 0.1),
                });
                props.kit.updateViewport();
        };

        const fitView = () => {
                if (!props.kit.container || props.kit.nodes.length === 0)
                        return;

                const nodes = props.kit.nodes;
                let minX = Infinity;
                let minY = Infinity;
                let maxX = -Infinity;
                let maxY = -Infinity;

                nodes.forEach((node) => {
                        minX = Math.min(minX, node.x);
                        minY = Math.min(minY, node.y);
                        maxX = Math.max(maxX, node.x + node.width);
                        maxY = Math.max(maxY, node.y + node.height);
                });

                const { width: containerWidth, height: containerHeight } =
                        props.kit.container.getBoundingClientRect();
                const padding = 40;

                const kitWidth = maxX - minX;
                const kitHeight = maxY - minY;

                if (kitWidth <= 0 || kitHeight <= 0) return;

                const zoom = Math.min(
                        (containerWidth - padding * 2) / kitWidth,
                        (containerHeight - padding * 2) / kitHeight,
                );

                const finalZoom = Math.min(zoom, 1);

                const centerKitX = minX + kitWidth / 2;
                const centerKitY = minY + kitHeight / 2;

                const x = containerWidth / 2 - centerKitX * finalZoom;
                const y = containerHeight / 2 - centerKitY * finalZoom;

                props.kit.setViewport({
                        x,
                        y,
                        zoom: finalZoom,
                });
                props.kit.updateViewport();
        };

        return { zoomIn, zoomOut, fitView };
};

