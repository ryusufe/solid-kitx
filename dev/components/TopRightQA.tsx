import { Component, createSignal, For, Show } from "solid-js";

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
        let isPhone = window.matchMedia("(max-width: 600px)").matches;
        const [isOpen, setIsOpen] = createSignal(!isPhone);
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
                        classList={{ open: isOpen() }}
                        onMouseDown={(e) => e.stopPropagation()}
                >
                        <div
                                style={{
                                        display: "flex",
                                        "align-items": "center",
                                        "justify-content": "space-between",
                                }}
                        >
                                <div
                                        style={{ display: "flex", flex: 1 }}
                                        ontouchstart={() =>
                                                setIsOpen(!isOpen())
                                        }
                                >
                                        <h4 class="instructions-title">
                                                Instructions
                                        </h4>
                                        <Show when={isPhone}>
                                                <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="24"
                                                        height="24"
                                                        viewBox="0 0 24 24"
                                                        style={{
                                                                transform: isOpen()
                                                                        ? "rotate(90deg)"
                                                                        : "none",
                                                        }}
                                                >
                                                        <path
                                                                stroke="none"
                                                                d="M0 0h24v24H0z"
                                                                fill="none"
                                                        />
                                                        <path d="M9 6c0 -.852 .986 -1.297 1.623 -.783l.084 .076l6 6a1 1 0 0 1 .083 1.32l-.083 .094l-6 6l-.094 .083l-.077 .054l-.096 .054l-.036 .017l-.067 .027l-.108 .032l-.053 .01l-.06 .01l-.057 .004l-.059 .002l-.059 -.002l-.058 -.005l-.06 -.009l-.052 -.01l-.108 -.032l-.067 -.027l-.132 -.07l-.09 -.065l-.081 -.073l-.083 -.094l-.054 -.077l-.054 -.096l-.017 -.036l-.027 -.067l-.032 -.108l-.01 -.053l-.01 -.06l-.004 -.057l-.002 -12.059z" />
                                                </svg>
                                        </Show>
                                </div>
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
                        <Show when={isOpen()}>
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
                                                                        {
                                                                                item.question
                                                                        }
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
                        </Show>
                </div>
        );
};

export default TopRightQA;
