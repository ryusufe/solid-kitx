import { ControlsProps } from ".";
import type { StateType } from "./state";
import type { LogicType } from "./logic";
import type { HelperType } from "./helper";

export const ControlsView = (
        state: StateType,
        logic: LogicType,
        props: ControlsProps,
        helper?: HelperType,
) => {
        return (
                <div
                        class="kitx-controls"
                        style={{ right: "10px", bottom: "10px" }}
                >
                        <button
                                onpointerdown={() =>
                                        props.kit.setFocus((prev) => !prev)
                                }
                                classList={{ on: props.kit.focus() }}
                        >
                                <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 297 297"
                                        fill="currentColor"
                                >
                                        <g>
                                                <path
                                                        d="M294.077,251.199l-59.105-59.107l42.167-24.356c3.295-1.903,5.212-5.52,4.938-9.315c-0.274-3.796-2.692-7.101-6.226-8.51
		L87.82,74.905c-3.686-1.472-7.895-0.605-10.702,2.201c-2.807,2.808-3.674,7.016-2.203,10.702l74.994,188.053
		c1.41,3.534,4.715,5.953,8.511,6.227c3.796,0.276,7.414-1.642,9.316-4.938l24.354-42.167l59.101,59.107
		c1.862,1.863,4.39,2.91,7.023,2.91c2.635,0,5.161-1.047,7.023-2.91l28.841-28.845C297.956,261.366,297.956,255.078,294.077,251.199
		z"
                                                />
                                                <path
                                                        d="M43.61,29.552c-3.879-3.876-10.166-3.877-14.047,0c-3.878,3.879-3.878,10.168,0,14.047l22.069,22.069
		c1.939,1.939,4.48,2.909,7.023,2.909c2.541,0,5.083-0.97,7.022-2.909c3.879-3.879,3.879-10.167,0-14.046L43.61,29.552z"
                                                />
                                                <path
                                                        d="M51.089,98.215c0-5.484-4.447-9.932-9.933-9.932H9.946c-5.485,0-9.933,4.447-9.933,9.932c0,5.485,4.447,9.933,9.933,9.933
		h31.21C46.642,108.147,51.089,103.7,51.089,98.215z"
                                                />
                                                <path
                                                        d="M47.063,128.869l-22.072,22.071c-3.878,3.879-3.878,10.168,0,14.046c1.94,1.939,4.482,2.909,7.023,2.909
		c2.541,0,5.084-0.97,7.023-2.909l22.071-22.07c3.879-3.879,3.879-10.168,0-14.047C57.23,124.993,50.944,124.992,47.063,128.869z"
                                                />
                                                <path
                                                        d="M98.222,51.078c5.485,0,9.933-4.447,9.933-9.933V9.932c0-5.485-4.447-9.932-9.933-9.932c-5.484,0-9.932,4.446-9.932,9.932
		v31.214C88.29,46.631,92.737,51.078,98.222,51.078z"
                                                />
                                                <path
                                                        d="M135.894,64.006c2.543,0,5.084-0.97,7.023-2.909l22.068-22.069c3.879-3.879,3.879-10.168,0-14.047
		c-3.879-3.877-10.168-3.877-14.046,0l-22.068,22.07c-3.879,3.879-3.879,10.168,0,14.046
		C130.811,63.036,133.352,64.006,135.894,64.006z"
                                                />
                                        </g>
                                </svg>
                        </button>
                        <button
                                class="control-button"
                                onpointerdown={logic.zoomIn}
                        >
                                <svg
                                        viewBox="0 0 24 24"
                                        id="plus"
                                        data-name="Flat Line"
                                        xmlns="http://www.w3.org/2000/svg"
                                        stroke="currentColor"
                                >
                                        <path
                                                d="M5,12H19M12,5V19"
                                                fill="none"
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                stroke-width={"2"}
                                        ></path>
                                </svg>
                        </button>
                        <button
                                class="control-button"
                                onpointerdown={logic.zoomOut}
                        >
                                <svg
                                        viewBox="0 0 24 24"
                                        id="minus"
                                        data-name="Flat Line"
                                        xmlns="http://www.w3.org/2000/svg"
                                        stroke="currentColor"
                                >
                                        <line
                                                fill="none"
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                stroke-width={"2"}
                                                x1="19"
                                                y1="12"
                                                x2="5"
                                                y2="12"
                                        ></line>
                                </svg>
                        </button>
                        <button
                                class="control-button"
                                onpointerdown={logic.fitView}
                        >
                                <svg
                                        viewBox="0 0 24 24"
                                        id="maximize-size"
                                        data-name="Flat Line"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width={"2"}
                                        stroke="currentColor"
                                >
                                        <path d="M9,9,3.29,3.29M15,9l5.71-5.71M9,15,3.29,20.71m17.42,0L15,15"></path>
                                        <path
                                                data-name="primary"
                                                d="M3,8V4A1,1,0,0,1,4,3H8"
                                        ></path>
                                        <path
                                                data-name="primary"
                                                d="M16,3h4a1,1,0,0,1,1,1V8"
                                        ></path>
                                        <path
                                                data-name="primary"
                                                d="M8,21H4a1,1,0,0,1-1-1V16"
                                        ></path>
                                        <path
                                                data-name="primary"
                                                d="M21,16v4a1,1,0,0,1-1,1H16"
                                        ></path>
                                </svg>
                        </button>
                </div>
        );
};
