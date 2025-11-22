import { Component, createMemo, onCleanup, onMount } from "solid-js";
import { createPath } from "../lib/GetPath";
import { Kit, Position } from "../types";

const sides = ["top", "bottom", "left", "right"] as Position[];
const ConnectionPreview: Component<{ kit: Kit }> = (props) => {
        const start = props.kit.activeConnectionDestination() as {
                x: number;
                y: number;
        };
        const startPos = props.kit.activeConnection.from!.side;
        const path = createMemo(() => {
                return createPath({
                        start: start,
                        startPos,
                        end: props.kit.activeConnectionDestination() as {
                                x: number;
                                y: number;
                        },
                        endPos:
                                props.kit.activeConnection.to?.side ??
                                sides[sides.indexOf(startPos) ^ 1] ??
                                "top",
                });
        });
        const onMouseMove = (e: MouseEvent) => {
                const { x, y, zoom } = props.kit.viewport();
                const rect = props.kit.container?.getBoundingClientRect();
                if (!rect) return;

                props.kit.setActiveConnectionDestination({
                        x: (e.clientX - rect.left - x) / zoom,
                        y: (e.clientY - rect.top - y) / zoom,
                });
        };

        onMount(() => {
                window.addEventListener("mousemove", onMouseMove);
        });
        onCleanup(() => {
                window.removeEventListener("mousemove", onMouseMove);
        });

        return (
                <svg
                        style={{
                                "z-index": 0,
                                overflow: "visible",
                                position: "absolute",
                        }}
                        stroke="currentColor"
                >
                        <g
                                tabindex={"0"}
                                class={`connection connection-preview`}
                        >
                                <path
                                        d={path()}
                                        fill="none"
                                        style={{
                                                transition: "all 0.1s",
                                                "stroke-width":
                                                        "var(--connection-width, 2)",
                                        }}
                                />
                        </g>
                </svg>
        );
};

export default ConnectionPreview;
