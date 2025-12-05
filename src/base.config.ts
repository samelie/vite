import type { UserConfig } from "vite";
import process from "node:process";

import { NodeModulesPolyfillPlugin } from "@esbuild-plugins/node-modules-polyfill";
import { defineConfig } from "vite";

export function createBaseConfig() {
    return defineConfig(() => {
    // May want to disable source maps for testing local dev builds
        return {
            // A dependency might check for properties on process.env
            // If an env var is required for a dependency, add it here.
            define: {
                "process.env.NODE_DEBUG": process.env.NODE_DEBUG,
            },
            optimizeDeps: {
                esbuildOptions: {
                    plugins: [NodeModulesPolyfillPlugin()],
                },
            },
            build: {
                sourcemap: false,
            },

            worker: { format: "es" },
            server: {
                fs: {
                    // When needing to load a module for development outside of
                    // the root.
                    strict: false,
                },
            },
            css: {
                preprocessorOptions: {
                    scss: {
                        /**
                         * Dart v2 will introduce a breaking change on the maths
                         * This quiets the deprecation warnings for now. b/c blueprintjs of course :facepalm:
                         * See for more details:
                         * Docs - https://sass-lang.com/documentation/breaking-changes/slash-div
                         * GH -   https://github.com/sass/sass/issues/3065
                         */
                        quietDeps: true,
                    },
                },
            },
        } as UserConfig;
    });
}
