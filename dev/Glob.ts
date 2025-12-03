import { createSignal, Signal } from "solid-js";

type GlobType = {
        backgroundType: Signal<string>;
};
export const Glob: GlobType = {
        backgroundType: createSignal(localStorage.backgroundType),
};
