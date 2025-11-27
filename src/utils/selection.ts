import { Accessor, createSignal, Setter } from "solid-js";
import { SelectedType, SelectionType } from "src/types";

export function Selection(): SelectionType {
        const [group, setGroup] = createSignal<SelectedType>({
                nodes: [],
                connections: [],
        });

        const getNodes = () => group().nodes;
        const getConnections = () => group().connections;
        const setNodes = (ids: string[]) =>
                setGroup({ ...group(), nodes: ids });
        const setConnections = (ids: string[]) =>
                setGroup({ ...group(), connections: ids });

        const addItem = (id: string, type: "node" | "connection") => {
                if (type === "node") {
                        setGroup((prev) => ({
                                ...prev,
                                nodes: [...prev.nodes, id],
                        }));
                } else
                        setGroup((prev) => ({
                                ...prev,
                                connections: [...prev.connections, id],
                        }));
        };
        const removeItem = (id: string, type: "node" | "connection") => {
                if (type === "node") {
                        setGroup((prev) => ({
                                ...prev,
                                nodes: prev.nodes.filter((n) => n !== id),
                        }));
                } else
                        setGroup((prev) => ({
                                ...prev,
                                connections: prev.connections.filter(
                                        (n) => n !== id,
                                ),
                        }));
        };
        const getMerged = () => [...group().nodes, ...group().connections];
        const length = () => group().nodes.length + group().connections.length;

        const clear = () => setGroup({ nodes: [], connections: [] });

        return {
                getConnections,
                getNodes,
                get: group,
                set: setGroup,
                getMerged,
                setConnections,
                setNodes,
                addItem,
                removeItem,
                length,
                clear,
        };
}
