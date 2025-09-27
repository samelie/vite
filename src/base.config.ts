import type { UserConfig } from "vite";
import { readFileSync } from "node:fs";
import { join, parse, resolve } from "node:path";
import process from "node:process";

import { fileURLToPath } from "node:url";
import { NodeModulesPolyfillPlugin } from "@esbuild-plugins/node-modules-polyfill";
import { packageUpSync } from "package-up";
import { defineConfig } from "vite";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
export const pkgRootDir =
    process.env.PKG_DIR ??
    parse(packageUpSync({ cwd: join(__dirname, "../..") }) ?? "").dir;
export const isRunningFromSource = !pkgRootDir.includes("node_modules");
/** SSL key 🔑 */
export const sslKeyPath = resolve(pkgRootDir, "ssl/proxy.key");
// /** SSL cert 📜 */
export const sslCertPath = resolve(pkgRootDir, "ssl/proxy.cer");
export function createBaseConfig() {
    return defineConfig(() => {
    // May want to disable source maps for testing local dev builds
        return {
            // A dependency might check for properties on process.env
            // If an env var is required for a dependency, add it here.
            define: {
                "process.env.NODE_DEBUG": process.env.NODE_DEBUG,
            },
            resolve: {
                alias: {
                    "@": resolve(pkgRootDir, "packages/design-system", "./src"),
                },
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
                https: {
                    key: readFileSync(sslKeyPath, "utf-8"),
                    cert: readFileSync(sslCertPath, "utf-8"),
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
