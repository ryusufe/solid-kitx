# Solid Kit

![Solid Kit Banner](https://github.com/ryusufe/solid-kitx/raw/main/assets/banner.png)

A minimal, lightweight, and highly customizable node-based graph library for solidjs. Built with performance and flexibility in mind.
<a style="font-size:2em" href="https://ryusufe.github.io/solid-kitx/">✨DEMO</a>


```bash
npm install solid-kitx
```

## Basic Usage


```tsx
import { createSignal, Component } from "solid-js";
import { SolidKit, ConnectionType, NodeType, ViewPort } from "solid-kitx";
import "solid-kitx/index.css";

const App: Component = () => {
  const [nodes, setNodes] = createSignal<NodeType[]>([
    {
      id: "node-1",
      x: 100,
      y: 100,
      width: 150,
      height: 100,
      data: { label: "Node 1" },
    },
    {
      id: "node-2",
      x: 400,
      y: 200,
      width: 150,
      height: 100,
      data: { label: "Node 2" },
    },
  ]);

  const [connections, setConnections] = createSignal<ConnectionType[]>([
    {
      id: "connection-1",
      from: { id: "node-1", side: "right" },
      to: { id: "node-2", side: "left" },
    },
  ]);

  const [viewport, setViewport] = createSignal<ViewPort>({ x: 0, y: 0, zoom: 1 });

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <SolidKit
        nodes={nodes()}
        connections={connections()}
        viewport={viewport()}
        onNodesChange={setNodes}
        onConnectionsChange={setConnections}
        onViewportChange={setViewport}
      />
    </div>
  );
};

export default App;
```

- [Read the wiki](https://github.com/ryusufe/solid-kitx/wiki)
