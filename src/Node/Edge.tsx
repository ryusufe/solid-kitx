import { Accessor, Component, createMemo, Show } from "solid-js";
import { Kit, NodeType, Position } from "src/types";
import AnchorPoint from "./AnchorPoint";

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
                : single.cursor;

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

        let startMouse = { x: 0, y: 0 };
        let startNode = { x: 0, y: 0, width: 0, height: 0 };
        let dragging = false;

        const onMouseDown = (e: MouseEvent) => {
                e.stopPropagation();

                document.documentElement.style.userSelect = "none";
                dragging = true;

                startMouse = { x: e.clientX, y: e.clientY };
                startNode = { ...props.node };

                window.addEventListener("mousemove", onMouseMove);
                window.addEventListener("mouseup", onMouseUp, { once: true });
        };

        const onMouseMove = (e: MouseEvent) => {
                if (!dragging) return;

                let { width, height, x, y } = startNode;

                for (const a of axes) {
                        const zoom = props.kit.viewport().zoom;
                        const delta =
                                a.axis === "x"
                                        ? Math.round(
                                                (e.clientX - startMouse.x) /
                                                zoom /
                                                props.kit.gridSize(),
                                        ) * props.kit.gridSize()
                                        : Math.round(
                                                (e.clientY - startMouse.y) /
                                                zoom /
                                                props.kit.gridSize(),
                                        ) * props.kit.gridSize();

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

                props.kit.setNodes((n: NodeType) => n.id === props.node.id, {
                        width,
                        height,
                        x,
                        y,
                });
        };

        const onMouseUp = () => {
                dragging = false;
                if (
                        (
                                [
                                        "width",
                                        "height",
                                        "x",
                                        "y",
                                ] as (keyof typeof startNode)[]
                        ).some((K) => startNode[K] !== props.node[K])
                ) {
                        props.kit.updateNodes();
                }
                document.documentElement.style.userSelect = "auto";
                window.removeEventListener("mousemove", onMouseMove);
        };

        const onMouseEnter = () => {
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

        const onMouseLeave = () => {
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
                        onMouseEnter={onMouseEnter}
                        onMouseLeave={onMouseLeave}
                        onMouseDown={onMouseDown}
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
