import { Accessor, createMemo } from "solid-js";
import { EdgeProps } from ".";
import type { HelperType } from "./helper";

export type StateType = {
        size: Accessor<{
                width?: string;
                height?: string;
                "--cursor"?: string;
        }>;
};

export const createEdgeState = (
        props: EdgeProps,
        helper?: HelperType,
): StateType => {
        const size = createMemo(() => {
                if (props?.kit.configs.disableEdgeDrag) return {};
                const thickness = "calc(var(--node-border-width, 2px) + 10px)";

                return helper?.isCorner
                        ? {
                                  width: thickness,
                                  height: thickness,
                                  "--cursor": helper?.cursor,
                          }
                        : {
                                  width:
                                          helper?.single.axis === "y"
                                                  ? "100%"
                                                  : thickness,
                                  height:
                                          helper?.single.axis === "y"
                                                  ? thickness
                                                  : "100%",
                                  "--cursor": helper?.cursor,
                          };
        });
        return { size };
};
