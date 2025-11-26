import { Component, createMemo, Show } from "solid-js";
import { Kit, NodeType, Position, ViewPort, xy } from "../../types";
import AnchorPoint from "./AnchorPoint";
import { createDragHandler, calculateDelta } from "../../utils/events";

export type EdgePosition = Position | "tr" | "tl" | "br" | "bl";

const Edge: Component<{
        side: EdgePosition;
        node: NodeType;
        kit: Kit;
}> = (props) => {
        const isCorner = ["tl", "tr", "bl", "br"].includes(props.side);

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
        const single = {
                top: { axis: "y", sign: -1, cursor: "ns-resize" },
                bottom: { axis: "y", sign: 1, cursor: "ns-resize" },
                left: { axis: "x", sign: -1, cursor: "ew-resize" },
                right: { axis: "x", sign: 1, cursor: "ew-resize" },
        }[props.side as Position];

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

        const axes = isCorner ? cornerAxes : [single];

        const cursor = isCorner
                ? props.side === "tl" || props.side === "br"
                        ? "nwse-resize"
                        : "nesw-resize"
                : single?.cursor ?? "default";

        const size = createMemo(() => {
                const thickness = "calc(var(--node-border-width, 2px) + 10px)";

                return isCorner
                        ? {
                                  width: thickness,
                                  height: thickness,
                                  "--cursor": cursor,
                          }
                        : {
                                  width:
                                          single.axis === "y"
                                                  ? "100%"
                                                  : thickness,
                                  height:
                                          single.axis === "y"
                                                  ? thickness
                                                  : "100%",
                                  "--cursor": cursor,
                          };
        });

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
                                        a.axis === "x"
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
                                const diff = delta * a.sign;

                                if (a.axis === "x") {
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

        const onPinterEnter = () => {
                const { from } = props.kit.activeConnection;
                if (!from || isCorner) return;
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

        return (
                <div
                        class="node-edge"
                        style={{
                                ...size(),
                                ...positionStyle,
                        }}
                        onpointerenter={onPinterEnter}
                        onpointerleave={onPointerLeave}
                        onPointerDown={onPointerDown}
                >
                        <Show
                                when={
                                        !isCorner &&
                                        props.kit.configs.disableNodeAnchors
                                }
                        >
                                <AnchorPoint
                                        side={props.side as Position}
                                        kit={props.kit}
                                        id={props.node.id}
                                />
                        </Show>
                </div>
        );
};

export default Edge;
