import { Component, createMemo, Show } from "solid-js";
import { Kit, NodeType, Position, ViewPort } from "src/types";
import AnchorPoint from "./AnchorPoint";
import { createDragHandler, calculateDelta } from "../lib/eventUtils";

export type EdgePosition = Position | "tr" | "tl" | "br" | "bl";

const Edge: Component<{
        side: EdgePosition;
        node: NodeType;
        kit: Kit;
}> = (props) => {
        const isCorner = ["tl", "tr", "bl", "br"].includes(props.side);
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
                                  cursor,
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
                                  cursor,
                          };
        });

        const dragHandler = createDragHandler<{
                width: number;
                height: number;
                x: number;
                y: number;
                clientX: number;
                clientY: number;
                vp: ViewPort;
                gridSize: number;
        }>({
                onStart: (e) => {
                        return {
                                width: props.node.width,
                                height: props.node.height,
                                x: props.node.x,
                                y: props.node.y,
                                clientX: e.clientX,
                                clientY: e.clientY,
                                vp: props.kit.viewport(),
                                gridSize: props.kit.gridSize(),
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
                                        width += diff;
                                        if (
                                                props.side === "left" ||
                                                props.side === "tl" ||
                                                props.side === "bl"
                                        ) {
                                                x -= diff;
                                        }
                                } else {
                                        height += diff;
                                        if (
                                                props.side === "top" ||
                                                props.side === "tl" ||
                                                props.side === "tr"
                                        ) {
                                                y -= diff;
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
                const { from } = props.kit.activeConnection;
                if (!from) return;
                props.kit.activeConnection = {
                        from,
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
                        onPointerDown={dragHandler.onPointerDown}
                >
                        <Show when={!isCorner}>
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
