import { Component, createEffect, createMemo, onCleanup, Show } from "solid-js";
import { Dynamic } from "solid-js/web";
import {
        ConnectionNode,
        ConnectionToolbarProps,
        ConnectionType,
        Kit,
} from "../types";
import { createPath } from "../lib/GetPath";

export interface ConnectionProps {
        connection: ConnectionType;
        Toolbar?: Component<ConnectionToolbarProps>;
        kit: Kit;
}
const ConnectionComponent: Component<ConnectionProps> = (props) => {
        let connectionRef!: SVGPathElement;
        let toolbarRef!: HTMLDivElement;
        const kit = props.kit;
        const selected = createMemo(() => {
                if (!kit) return false;
                const selectedSet = kit.selectedItems();
                return selectedSet.has(props.connection.id);
        });
        const getNodeRect = (id: string) => kit.nodes.find((i) => i.id === id)!;
        const coords = createMemo(() => {
                const { from, to } = props.connection;

                const src = getNodeRect(from.id);
                const tgt = getNodeRect(to.id);

                const getPoint = (
                        node: typeof src,
                        side: ConnectionNode["side"],
                ) => {
                        switch (side) {
                                case "top":
                                        return {
                                                x: node.x + node.width / 2,
                                                y: node.y,
                                        };
                                case "bottom":
                                        return {
                                                x: node.x + node.width / 2,
                                                y: node.y + node.height,
                                        };
                                case "left":
                                        return {
                                                x: node.x,
                                                y: node.y + node.height / 2,
                                        };
                                case "right":
                                        return {
                                                x: node.x + node.width,
                                                y: node.y + node.height / 2,
                                        };
                        }
                };

                return {
                        source: getPoint(src, from.side),
                        target: getPoint(tgt, to.side),
                };
        });
        const mid = createMemo(() => ({
                x: (coords().source.x + coords().target.x) / 2,
                y: (coords().source.y + coords().target.y) / 2,
        }));
        const setSelected = (value: boolean) => {
                const current = new Set(kit.selectedItems());
                if (value) {
                        current.add(props.connection.id);
                } else {
                        current.delete(props.connection.id);
                }
                kit.setSelectedItems(current);
        };

        const path = createMemo(() => {
                const { source, target } = coords();
                const { from, to } = props.connection;

                return createPath({
                        start: source,
                        startPos: from.side,
                        end: target,
                        endPos: to.side,
                });
        });

        const setLabel = (label: string | undefined) => {
                kit.setConnections(
                        (c: ConnectionType) => c.id === props.connection.id,
                        "label",
                        label,
                );
                kit.updateConnections();
        };

        //
        //
        const onMouseDown = () => {
                setSelected(true);
        };

        const controller = new AbortController();

        createEffect(() => {
                if (!connectionRef) return;

                if (selected()) {
                        connectionRef.focus();
                        window.addEventListener("mousedown", onClickOutside, {
                                signal: controller.signal,
                        });
                        window.addEventListener("keydown", onKeyDown, {
                                signal: controller.signal,
                        });
                } else if (connectionRef.classList.contains("selected")) {
                        connectionRef.blur();
                }
        });

        const onClickOutside = (e: MouseEvent) => {
                const target = e.target as Node;
                if (toolbarRef && toolbarRef.contains(target)) return;
                if (
                        connectionRef &&
                        !connectionRef.contains(target) &&
                        !e.ctrlKey
                ) {
                        setSelected(false);
                        window.removeEventListener("mousedown", onClickOutside);
                        window.removeEventListener("keydown", onKeyDown);
                }
        };

        const onKeyDown = (e: KeyboardEvent) => {
                if (e.key === "Escape") {
                        setSelected(false);
                        window.removeEventListener("keydown", onKeyDown);
                }
        };
        onCleanup(() => {
                controller.abort();
        });

        return (
                <>
                        <svg
                                class={`connection-svg ${
                                        props.connection.class ?? ""
                                }`}
                                style={{
                                        "z-index": 0,
                                        overflow: "visible",
                                        position: "absolute",
                                }}
                                stroke="currentColor"
                                ondblclick={() => setLabel("Test")}
                        >
                                <g
                                        ref={connectionRef}
                                        id={props.connection.id}
                                        class={`connection ${
                                                props.connection.class ?? ""
                                        }`}
                                        classList={{ selected: selected() }}
                                        style={{
                                                outline: 0,
                                                ...props.connection.style,
                                        }}
                                        onmousedown={onMouseDown}
                                >
                                        <path
                                                d={path()}
                                                fill="none"
                                                style={""}
                                        />
                                        <path
                                                d={path()}
                                                stroke-width="20"
                                                stroke="transparent"
                                                fill="none"
                                        />
                                </g>
                        </svg>

                        <Show when={props.Toolbar && selected()}>
                                <div
                                        ref={toolbarRef}
                                        class="connection-toolbar"
                                        style={{
                                                "--mid-x": mid().x + "px",
                                                "--mid-y": mid().y + "px",
                                                position: "absolute",
                                                left: "calc(var(--mid-x) + var(--left, 0px))",
                                                top: "calc(var(--mid-y) + var(--top, -2em))",
                                                transform: "translate(-50%, -50%)",
                                        }}
                                >
                                        <Dynamic
                                                component={props.Toolbar}
                                                kit={kit}
                                                connection={props.connection}
                                        />
                                </div>
                        </Show>
                        <Show when={props.connection.label !== undefined}>
                                <span
                                        class="connection-label"
                                        onBlur={(e) => {
                                                const value =
                                                        e.currentTarget.innerText.trim()
                                                                .length === 0
                                                                ? undefined
                                                                : e
                                                                          .currentTarget
                                                                          .innerText;

                                                setLabel(value);
                                        }}
                                        onKeyDown={(e) => {
                                                if (e.key === "Enter")
                                                        e.currentTarget.blur();
                                        }}
                                        style={{
                                                position: "absolute",
                                                "z-index": 1000,
                                                transform: "translate(-50%, -50%)",
                                                left: mid().x + "px",
                                                top: mid().y + "px",
                                        }}
                                        contenteditable="true"
                                >
                                        {props.connection.label}
                                </span>
                        </Show>
                </>
        );
};

export default ConnectionComponent;
