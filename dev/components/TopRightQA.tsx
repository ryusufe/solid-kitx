import { Component, createSignal, For } from "solid-js";

const instructions = [
        {
                question: "How do I add nodes?",
                answer: "This library is minimal and highly customizable. By default, nodes are editable text, but you can define any type of node you want users to add. You could implement this via a custom context menu, a floating toolbar, or any UI that fits your app. For more details, check the 'Custom Nodes' section in the docs.",
        },
        {
                question: "How do I interact with the contents of a node?",
                answer: "Click the button with the cursor icon in the bottom-right corner of the node to interact with its contents.",
        },
        {
                question: "How customizable is it?",
                answer: "Completely customizable. from appearance to behavior. Read the docs or the source code.",
        },
];

const TopRightQA: Component = () => {
        const [openIndexes, setOpenIndexes] = createSignal(new Set());

        const toggleAnswer = (index: number) => {
                const newSet = new Set(openIndexes());
                if (newSet.has(index)) newSet.delete(index);
                else newSet.add(index);
                setOpenIndexes(newSet);
        };

        const toggleTheme = () => {
                document.documentElement.classList.toggle("dark");
        };

        return (
                <div
                        class="instructions-popup"
                        onMouseDown={(e) => e.stopPropagation()}
                >
                        <div
                                style={{
                                        display: "flex",
                                        "align-items": "center",
                                        "justify-content": "space-between",
                                        "margin-bottom": "10px",
                                }}
                        >
                                <h4 class="instructions-title">Instructions</h4>
                                <button onclick={toggleTheme}>
                                        <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="24"
                                                height="24"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                stroke-width="2"
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                        >
                                                <path
                                                        stroke="none"
                                                        d="M0 0h24v24H0z"
                                                        fill="none"
                                                />
                                                <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
                                                <path d="M13 12h5" />
                                                <path d="M13 15h4" />
                                                <path d="M13 18h1" />
                                                <path d="M13 9h4" />
                                                <path d="M13 6h1" />
                                        </svg>
                                </button>
                        </div>
                        <ul class="instructions-list">
                                <For each={instructions}>
                                        {(item, index) => (
                                                <li>
                                                        <div
                                                                class="instructions-question"
                                                                onClick={() =>
                                                                        toggleAnswer(
                                                                                index(),
                                                                        )
                                                                }
                                                        >
                                                                {item.question}
                                                        </div>
                                                        {openIndexes().has(
                                                                index(),
                                                        ) && (
                                                                <div class="instructions-answer">
                                                                        {
                                                                                item.answer
                                                                        }
                                                                </div>
                                                        )}
                                                </li>
                                        )}
                                </For>
                        </ul>
                </div>
        );
};

export default TopRightQA;
