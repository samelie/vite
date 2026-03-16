import type { PluginOption, UserConfig, UserConfigExport } from "vite";
import { defineConfig, mergeConfig } from "vite";

import { createBaseConfig } from "./base.config";

/**
 * Define vite.config to be used for "apps"
 */

export function defineAppConfig(
    configOverrides: UserConfig = {},
): UserConfigExport {
    const port = configOverrides.server?.port;
    const host = configOverrides.server?.host;
    // when invoked on root, there are no dependencies and thus need to ensure it exists

    return defineConfig(configEnv => {
        const baseConfig = createBaseConfig();
        const plugins = [] as PluginOption[];
        const appConfig = mergeConfig(baseConfig(configEnv), {
            plugins,
            logLevel: "info",
            server: {
                ...(port !== undefined && { port }),
                host: host || "localhost",
                hmr: { overlay: false },
            },
            preview: {
                ...(port !== undefined && { port }),
            },
        } satisfies UserConfig);
        const resolvedConfig = mergeConfig(appConfig, configOverrides);

        console.dir(resolvedConfig, { depth: 9 });
        return resolvedConfig;
    });
}
