import { createContext, useContext } from "solid-js";
import { Kit } from "../types";

export const KitContext = createContext<Kit>();

export function useKitContext() {
    return useContext(KitContext)!;
}
