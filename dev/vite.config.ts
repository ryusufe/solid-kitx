import { defineConfig } from "vite";
import path from "node:path";
import solidPlugin from "vite-plugin-solid";

export default defineConfig({
        resolve: {
                alias: {
                        "solid-kitx": path.resolve(
                                __dirname,
                                "../src/index.tsx",
                        ),
                        src: path.resolve(__dirname, "../src"),
                },
                dedupe: ["solid-js", "solid-js/web", "solid-js/store"],
                conditions: ["development", "browser"],
                preserveSymlinks: false,
        },
        base: "/solid-kitx/",
        plugins: [
                solidPlugin(),
                {
                        name: "Reaplace env variables",
                        transform(code, id) {
                                if (id.includes("node_modules")) {
                                        return code;
                                }
                                return code
                                        .replace(/process\.env\.SSR/g, "false")
                                        .replace(/process\.env\.DEV/g, "true")
                                        .replace(/process\.env\.PROD/g, "false")
                                        .replace(
                                                /process\.env\.NODE_ENV/g,
                                                '"development"',
                                        )
                                        .replace(
                                                /import\.meta\.env\.SSR/g,
                                                "false",
                                        )
                                        .replace(
                                                /import\.meta\.env\.DEV/g,
                                                "true",
                                        )
                                        .replace(
                                                /import\.meta\.env\.PROD/g,
                                                "false",
                                        )
                                        .replace(
                                                /import\.meta\.env\.NODE_ENV/g,
                                                '"development"',
                                        );
                        },
                },
        ],
        server: {
                host: "0.0.0.0",
                port: 3000,
        },
        build: {
                target: "esnext",
        },
});
