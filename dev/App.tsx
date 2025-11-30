import { createSignal, onMount, type Component } from "solid-js";
import { BackgroundGrid, Controls, Kit, Selector, SolidKitx } from "solid-kitx";
import { ConnectionType, NodeType, ViewPort } from "solid-kitx";
import "./styles.css";
import { render } from "solid-js/web";
import NodeToolbar from "./components/NodeToolbar";
import ConnectionToolbar from "./components/ConnectionToolbar";
import TopRightQA from "./components/TopRightQA";
import ExampleMarkdown from "./components/ExampleMarkdown";
import ExampleStatus from "./components/ExampleStatus";
import { createStore } from "solid-js/store";
import { createSign } from "node:crypto";
//import "solid-kitx/index.css";

interface DataType {
        nodes: NodeType[];
        connections: ConnectionType[];
        viewport: ViewPort;
        gridSize: number;
}

const App: Component = () => {
        const nodesStore = createStore<NodeType[]>(data.nodes);
        const connectionsStore = createStore<ConnectionType[]>(
                data.connections,
        );
        const viewportSignal = createSignal<ViewPort>(data.viewport);

        const onNodesChange = () => {
                console.log("nodes changed");
                // save in db
        };
        const onConnectionsChange = () => {
                console.log("connections changed");
                // save in db
        };
        const onViewportChange = () => {
                console.log("viewport changed");
                // save in db
        };

        return (
                <div
                        style={{
                                background: "#000",
                                width: "100vw",
                                height: "100vh",
                                display: "flex",
                                "align-items": "center",
                        }}
                >
                        <SolidKitx
                                nodesStore={nodesStore}
                                onNodesChange={onNodesChange}
                                connectionsStore={connectionsStore}
                                onConnectionsChange={onConnectionsChange}
                                viewportSignal={viewportSignal}
                                onViewportChange={onViewportChange}
                                defaultNode={defaultNode}
                                components={{
                                        "node-toolbar": NodeToolbar,
                                        "connection-toolbar": ConnectionToolbar,
                                        "example-markdown": ExampleMarkdown,
                                        "example-status": ExampleStatus,
                                }}
                        >
                                {(kit: Kit) => (
                                        <>
                                                <BackgroundGrid
                                                        kit={kit}
                                                        type="dash"
                                                />
                                                <Selector kit={kit} />
                                                <TopRightQA />
                                                <Controls kit={kit} />
                                        </>
                                )}
                        </SolidKitx>
                </div>
        );
};

const defaultNode: Partial<NodeType> = {
        width: 150,
        height: 60,
};

const data: DataType = {
        nodes: [
                {
                        id: "node-1",
                        x: 390,
                        y: 300,
                        width: 210,
                        height: 300,
                        data: {
                                label: "Color Changer",
                                component: "example-status",
                        },
                        style: { "outline-color": "#272727" },
                },
                {
                        id: "node-2",
                        x: 120,
                        y: 120,
                        width: 150,
                        height: 60,
                        data: { label: "Node A" },
                },
                {
                        id: "node-3",
                        x: 870,
                        y: 150,
                        width: 600,
                        height: 720,
                        data: {
                                label: "Example markdown",
                                component: "example-markdown",
                        },
                },
        ],

        connections: [
                {
                        id: "connection-1",
                        from: { id: "node-1", side: "left" },
                        to: { id: "node-2", side: "right" },
                        label: "Next",
                },
        ],
        viewport: { x: 0, y: 0, zoom: 1 },
        gridSize: 30,
};

render(() => <App />, document.getElementById("root")!);
