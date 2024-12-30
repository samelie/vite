import type { PluginOption, UserConfig, UserConfigExport } from "vite";
import { cpus } from "node:os";
import process from "node:process";
import vue from "@vitejs/plugin-vue";
import { defineConfig, mergeConfig } from "vite";
import svgr from "vite-plugin-svgr";

import { createBaseConfig } from "./base.config";

/**
 * Define vite.config to be used for "apps"
 */

export function defineAppConfig(
    configOverrides: UserConfig = {},
): UserConfigExport {
    const port = configOverrides.server?.port;
    // when invoked on root, there are no dependencies and thus need to ensure it exists

    return defineConfig(configEnv => {
        const baseConfig = createBaseConfig();
        const plugins = [svgr(), vue()] as PluginOption[];
        const appConfig = mergeConfig(baseConfig(configEnv), {
            plugins,
            logLevel: "info",
            server: {
                port,
                hmr: { overlay: false },
            },
            preview: {
                port,
            },
            build: {
                rollupOptions: {
                    cache: process.env.CI ? false : undefined,
                    // Based on https://github.com/vitejs/vite/issues/2433#issuecomment-1422127051
                    // helps reduce memory usage in CI which was OOM-ing (default value is 20)
                    maxParallelFileOps: Math.max(1, cpus().length - 1),
                    output: {
                        // https://rollupjs.org/guide/en/#outputmanualchunks
                        manualChunks: {},
                    },
                },
            },
        } satisfies UserConfig);
        const resolvedConfig = mergeConfig(appConfig, configOverrides);
        return resolvedConfig;
    });
}
