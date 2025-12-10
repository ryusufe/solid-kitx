import { createSignal, onMount, type Component } from "solid-js";
import { BackgroundGrid, Controls, Kit, Selector, SolidKitx } from "solid-kitx";
import { ConnectionType, NodeType, ViewPort } from "solid-kitx";
import "./styles.css";
import { render } from "solid-js/web";
import NodeToolbar from "./components/NodeToolbar";
import ConnectionToolbar from "./components/ConnectionToolbar";
import { createStore, unwrap } from "solid-js/store";
import { SideBar } from "./components/SideBar";
import { FieldsNode, FunctionNode, TaskNode } from "./components/NodeTypes";
import { Glob } from "./Glob";
//import "solid-kitx/index.css";

interface DataType {
        nodes: NodeType[];
        connections: ConnectionType[];
        viewport: ViewPort;
        gridSize: number;
}

const App: Component = () => {
        const nodesStore = createStore<NodeType[]>(
                JSON.parse(localStorage.nodes ?? "[]"),
        );
        const connectionsStore = createStore<ConnectionType[]>(
                JSON.parse(localStorage.connections ?? "[]"),
        );
        const viewportSignal = createSignal<ViewPort>(
                JSON.parse(localStorage.vp ?? '{ "x": 0, "y": 0, "zoom": 1 }'),
        );

        const onNodesChange = (changedIds?: string[]) => {
                console.log("nodes changed: ", changedIds?.join(", "));
                // save in db
                localStorage.nodes = JSON.stringify(unwrap(nodesStore[0]));
        };
        const onConnectionsChange = (changedIds?: string[]) => {
                console.log("connections changed: ", changedIds?.join(", "));
                // save in db
                localStorage.connections = JSON.stringify(
                        unwrap(connectionsStore[0]),
                );
        };
        const onViewportChange = () => {
                console.log("viewport changed");
                // save in db
                localStorage.vp = JSON.stringify(viewportSignal[0]());
        };

        return (
                <div
                        style={{
                                background: "#000",
                                width: "100vw",
                                height: "100vh",
                                display: "flex",
                                "align-items": "center",
                                position: "relative",
                        }}
                >
                        <SolidKitx
                                nodesStore={nodesStore}
                                onNodesChange={onNodesChange}
                                connectionsStore={connectionsStore}
                                onConnectionsChange={onConnectionsChange}
                                viewportSignal={viewportSignal}
                                onViewportChange={onViewportChange}
                                gridSize={1}
                                components={{
                                        "node-toolbar": NodeToolbar,
                                        "connection-toolbar": ConnectionToolbar,
                                        "fields-node": FieldsNode,
                                        "function-node": FunctionNode,
                                        "task-node": TaskNode,
                                }}
                        >
                                {(kit: Kit) => (
                                        <>
                                                <BackgroundGrid
                                                        kit={kit}
                                                        type={
                                                                Glob.backgroundType[0]() as
                                                                        | "dot"
                                                                        | "dash"
                                                        }
                                                        absoluteGrid={100}
                                                />
                                                <Selector kit={kit} />
                                                <Controls kit={kit} />
                                                <SideBar kit={kit} />
                                        </>
                                )}
                        </SolidKitx>
                        <div id="external" />
                </div>
        );
};

render(() => <App />, document.getElementById("root")!);
