import { EdgeProps } from ".";
import type { StateType } from "./state";
import type { HelperType } from "./helper";
import { calculateDelta, createDragHandler } from "src/utils/events";
import { NodeType, Position, ViewPort, xy } from "src/types";

export type LogicType = {
        onPointerDown: (e: PointerEvent) => void;
        onPointerEnter: (e: PointerEvent) => void;
        onPointerLeave: (e: PointerEvent) => void;
        positionStyle: {
                top?: string;
                left?: string;
                right?: string;
                bottom?: string;
        };
};

export const EdgeLogic = (
        state: StateType,
        props: EdgeProps,
        helper?: HelperType,
): LogicType => {
        const clamp = (value: number, min: number, max: number) =>
                Math.max(min, Math.min(value, max));

        const getRespectedWidth = (value: number) => {
                const { minNodeWidth = 1, maxNodeWidth = 10000 } =
                        props.kit.configs;
                return clamp(value, minNodeWidth, maxNodeWidth);
        };

        const getRespectedHeight = (value: number) => {
                const { minNodeHeight = 1, maxNodeHeight = 10000 } =
                        props.kit.configs;
                return clamp(value, minNodeHeight, maxNodeHeight);
        };

        const positionStyle = (() => {
                switch (props.side) {
                        case "top":
                        case "bottom":
                        case "left":
                        case "right":
                                return { [props.side]: "var(--off-v)" };
                        case "tl":
                                return {
                                        top: "var(--off-v)",
                                        left: "var(--off-v)",
                                };
                        case "tr":
                                return {
                                        top: "var(--off-v)",
                                        right: "var(--off-v)",
                                };
                        case "bl":
                                return {
                                        bottom: "var(--off-v)",
                                        left: "var(--off-v)",
                                };
                        case "br":
                                return {
                                        bottom: "var(--off-v)",
                                        right: "var(--off-v)",
                                };
                }
        })();

        const cornerAxes =
                props.side === "tl"
                        ? [
                                  { axis: "x", sign: -1 },
                                  { axis: "y", sign: -1 },
                          ]
                        : props.side === "tr"
                        ? [
                                  { axis: "x", sign: 1 },
                                  { axis: "y", sign: -1 },
                          ]
                        : props.side === "bl"
                        ? [
                                  { axis: "x", sign: -1 },
                                  { axis: "y", sign: 1 },
                          ]
                        : props.side === "br"
                        ? [
                                  { axis: "x", sign: 1 },
                                  { axis: "y", sign: 1 },
                          ]
                        : [];

        const axes = helper?.isCorner ? cornerAxes : [helper?.single];

        const dragHandler = createDragHandler<
                {
                        width: number;
                        height: number;
                        clientX: number;
                        clientY: number;
                        vp: ViewPort;
                        gridSize: number;
                } & xy
        >({
                onStart: (e) => {
                        return {
                                width: props.node.width,
                                height: props.node.height,
                                x: props.node.x,
                                y: props.node.y,
                                clientX: e.clientX,
                                clientY: e.clientY,
                                vp: props.kit.viewport(),
                                gridSize: props.kit.configs.gridSize!,
                        };
                },
                onMove: (e, startNode) => {
                        let { width, height, x, y, vp, gridSize } = startNode;

                        for (const a of axes) {
                                const zoom = vp.zoom;
                                const delta =
                                        a?.axis === "x"
                                                ? calculateDelta(
                                                          e.clientX,
                                                          startNode.clientX,
                                                          zoom,
                                                          gridSize,
                                                  )
                                                : calculateDelta(
                                                          e.clientY,
                                                          startNode.clientY,
                                                          zoom,
                                                          gridSize,
                                                  );
                                const diff = delta * (a?.sign ?? 1);

                                if (a?.axis === "x") {
                                        let newWidth = width + diff;
                                        const clampedWidth =
                                                getRespectedWidth(newWidth);
                                        const actualDiff = clampedWidth - width;

                                        width = clampedWidth;
                                        if (
                                                props.side === "left" ||
                                                props.side === "tl" ||
                                                props.side === "bl"
                                        ) {
                                                x -= actualDiff;
                                        }
                                } else {
                                        let newHeight = height + diff;
                                        const clampedHeight =
                                                getRespectedHeight(newHeight);
                                        const actualDiff =
                                                clampedHeight - height;

                                        height = clampedHeight;
                                        if (
                                                props.side === "top" ||
                                                props.side === "tl" ||
                                                props.side === "tr"
                                        ) {
                                                y -= actualDiff;
                                        }
                                }
                        }

                        props.kit.setNodes(
                                (n: NodeType) => n.id === props.node.id,
                                {
                                        width,
                                        height,
                                        x,
                                        y,
                                },
                        );
                },

                onEnd: (_, startNode) => {
                        if (
                                (["width", "height", "x", "y"] as const).some(
                                        (K) => startNode[K] !== props.node[K],
                                )
                        ) {
                                props.kit.updateNodes();
                        }
                },
                stopPropagation: true,
                preventDefault: true,
                disableSelection: true,
        });
        const onPointerDown = (e: PointerEvent) => {
                if (props.kit.configs.disableEdgeDrag) return;
                dragHandler.onPointerDown(e);
        };

        const onPointerEnter = () => {
                const { from } = props.kit.activeConnection;
                if (!from || helper?.isCorner) return;
                props.kit.activeConnection = {
                        from,
                        to: {
                                side: props.side as Position,
                                id: props.node.id,
                        },
                };
        };

        const onPointerLeave = () => {
                const act = props.kit.activeConnection;
                if (!act.from) return;
                props.kit.activeConnection = {
                        ...act,
                        to: { id: undefined, side: act.to?.side },
                };
        };

        return { onPointerLeave, onPointerDown, onPointerEnter, positionStyle };
};
