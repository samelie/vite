import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig, mergeConfig } from "vitest/config";

import { createBaseConfig } from "./base.config.ts";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

function getSetupFiles(): string[] {
    const result = [join(__dirname, "./setup-vitest.mjs")];
    return result;
}

/**
 * Vitest config
 * Only relies on the base config
 */
export default defineConfig(configEnv => {
    const baseConfig = createBaseConfig();
    return mergeConfig({
        resolve: {
            // https://vitejs.dev/config/shared-options.html#resolve-conditions
            // This tells vitest to look for the entrypoint here. Allows pkg to publish the correct fields.
            conditions: ["vite"],
        },
        test: {
            alias: [],
            css: false,
            reporters: ["verbose"],
            watch: false,
            cache: false,
            coverage: { reportsDirectory: "public/coverage", reporter: ["html"] },
            clearMocks: true,
            restoreMocks: true,
            mockReset: true,
            passWithNoTests: true,
            forceRerunTriggers: ["apps/**/*", "packages/**/*"],
            isolate: true,
            outputTruncateLength: 600,
            outputDiffLines: 400,
            globals: true,
            setupFiles: getSetupFiles(),
            include: ["{apps,packages}/**/*.test.{js,ts,tsx}"],
            exclude: [
                "**/node_modules/**",
                "**/dist/**",
                "**/e2e/**",
                "**/cypress/**",
                "**/.{idea,git,output,temp}/**",
                "**/build/**",
                "**/public/**",
            ],
            environment: "jsdom",
        },
    }, baseConfig(configEnv));
});
