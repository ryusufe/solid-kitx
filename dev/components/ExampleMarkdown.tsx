import { Component } from "solid-js";

const ExampleMarkdown: Component = () => {
        return (
                <div
                        style={{
                                width: "100%",
                                height: "100%",
                                "padding-block": "10px",
                                "padding-inline": "41px",
                                display: "flex",
                                overflow: "hidden",
                                "flex-direction": "column",
                                "box-sizing": "border-box",
                                "font-family": "sans-serif",
                        }}
                >
                        <h1>Markdown Title</h1>
                        <p>
                                This is a simple HTML page that looks like{" "}
                                <strong>Markdown-rendered</strong> content.
                        </p>

                        <h2>Subheading</h2>
                        <p>
                                You can have <em>italic</em>,{" "}
                                <strong>bold</strong>, and{" "}
                                <code>inline code</code>.
                        </p>

                        <h3>Lists</h3>
                        <ul>
                                <li>First item</li>
                                <li>Second item</li>
                                <li>Third item</li>
                        </ul>
                        <ol>
                                <li>Numbered one</li>
                                <li>Numbered two</li>
                        </ol>

                        <h3>Blockquote</h3>
                        <blockquote>
                                This is a blockquote. It usually indicates a
                                quote or note.
                        </blockquote>

                        <p>End of the demo.</p>
                </div>
        );
};

export default ExampleMarkdown;
