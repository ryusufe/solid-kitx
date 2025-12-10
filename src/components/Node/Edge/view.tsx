import { EdgeProps } from ".";
import type { StateType } from "./state";
import type { LogicType } from "./logic";
import type { HelperType } from "./helper";
import { Show } from "solid-js";
import AnchorPoint from "../AnchorPoint";
import { Position } from "src/types";

export const EdgeView = (
        state: StateType,
        logic: LogicType,
        props?: EdgeProps,
        helper?: HelperType,
) => {
        return (
                <div
                        class="node-edge"
                        style={{
                                ...state.size(),
                                ...logic.positionStyle,
                        }}
                        onpointerenter={logic.onPointerEnter}
                        onpointerleave={logic.onPointerLeave}
                        on:pointerdown={logic.onPointerDown}
                >
                        <Show
                                when={
                                        !helper?.isCorner &&
                                        !props?.kit.configs.disableNodeAnchors
                                }
                        >
                                <AnchorPoint
                                        index={props?.index}
                                        side={props?.side as Position}
                                        kit={props?.kit!}
                                        id={props?.node.id!}
                                />
                        </Show>
                </div>
        );
};
