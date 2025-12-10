import { SetStoreFunction } from "solid-js/store";
import { untrack } from "solid-js/web";

export interface ItemType {
        id: string;
        [key: string]: any;
}

export function createTracker<T extends { id: string }>(props: {
        store: T[];
        setStore: SetStoreFunction<T[]>;
}): [Set<string>, SetStoreFunction<T[]>] {
        const changedIds = new Set<string>();

        function trackedSet(...args: Parameters<SetStoreFunction<T[]>>) {
                untrack(() => {
                        const path = args[0];
                        const prev = props.store;

                        if (typeof path === "number" || Array.isArray(path)) {
                                const rootIndex =
                                        typeof path === "number"
                                                ? path
                                                : path[0];
                                const id = prev[rootIndex]?.id;
                                if (id) changedIds.add(id);

                                props.setStore(...args);
                        }

                        // functional update
                        else if (typeof path === "function") {
                                const beforeIds = new Set(
                                        prev.map((n) => n.id),
                                );

                                props.setStore(...args);

                                const afterIds = new Set(
                                        props.store.map((n) => n.id),
                                );

                                // added nodes
                                for (const id of afterIds) {
                                        if (!beforeIds.has(id))
                                                changedIds.add(id);
                                }

                                // removed nodes
                                for (const id of beforeIds) {
                                        if (!afterIds.has(id))
                                                changedIds.add(id);
                                }
                        } else if (path === undefined) {
                                const newArr = args[0] as T[]; // first arg is the new array
                                const beforeIds = new Set(
                                        prev.map((n) => n.id),
                                );
                                const afterIds = new Set(
                                        newArr.map((n) => n.id),
                                );

                                // added
                                for (const id of afterIds) {
                                        if (!beforeIds.has(id))
                                                changedIds.add(id);
                                }

                                // removed nodes
                                for (const id of beforeIds) {
                                        if (!afterIds.has(id))
                                                changedIds.add(id);
                                }

                                props.setStore(...args);
                        }
                });
        }

        return [changedIds, trackedSet as SetStoreFunction<T[]>];
}
