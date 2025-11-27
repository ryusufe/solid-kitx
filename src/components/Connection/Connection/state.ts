import { Accessor, createMemo } from "solid-js";
import { ConnectionProps } from ".";
import type { HelperType } from "./helper";
import { ConnectionNode, NodeType, xy } from "src/types";
import { createPath } from "src/utils/path";

export type StateType = {
        connectionRef: SVGPathElement;
        toolbarRef: HTMLDivElement;
        selected: Accessor<boolean>;
        mid: Accessor<xy>;
        path: Accessor<string>;
};

export const createConnectionState = (
        props: ConnectionProps,
        helper?: HelperType,
): StateType => {
        let connectionRef!: SVGPathElement;
        let toolbarRef!: HTMLDivElement;
        const selected = createMemo(() => {
                const selectedSet = props.kit.selection.getConnections();
                return selectedSet.includes(props.connection.id);
        });
        const coords = createMemo(() => {
                const { from, to } = props.connection;

                const src = helper?.getNodeRect(from.id);
                const tgt = helper?.getNodeRect(to.id);

                const getPoint = (
                        node: NodeType,
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
                        source: getPoint(src!, from.side),
                        target: getPoint(tgt!, to.side),
                };
        });
        const mid = createMemo(() => ({
                x: (coords().source.x + coords().target.x) / 2,
                y: (coords().source.y + coords().target.y) / 2,
        }));
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
        return { connectionRef, toolbarRef, mid, path, selected };
};
