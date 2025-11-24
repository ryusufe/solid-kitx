import { Component, createMemo } from "solid-js";
import { Kit } from "../types";

export const BackgroundGrid: Component<{
        kit: Kit;
        absoluteGrid?: number;
}> = (props) => {
        const grid = createMemo(
                () => props.absoluteGrid ?? props.kit.gridSize ?? 30,
        );
        const vp = createMemo(() => props.kit.viewport());
        const dif = createMemo(() => grid() * vp().zoom);

        return (
                <svg
                        class="background-grid"
                        style={{
                                position: "absolute",
                                width: "100%",
                                height: "100%",
                        }}
                >
                        <pattern
                                id="grid-pattern"
                                x={vp().x + dif() / 2}
                                y={vp().y + dif() / 2}
                                width={dif()}
                                height={dif()}
                                patternUnits="userSpaceOnUse"
                        >
                                <circle
                                        fill="currentColor"
                                        cx={vp().zoom}
                                        cy={vp().zoom}
                                        r={vp().zoom}
                                ></circle>
                        </pattern>
                        <rect
                                x="0"
                                y="0"
                                width="100%"
                                height="100%"
                                fill="url(#grid-pattern)"
                        ></rect>
                </svg>
        );
};
