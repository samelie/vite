import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { defineConfig, mergeConfig } from "vite";
import type { InlineConfig } from "vitest";

import { createBaseConfig } from "./base.config";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

function getSetupFiles(): string[] {
  const result = [join(__dirname, "./setup-vitest.ts")];
  return result;
}

/**
 * Vitest config
 * Only relies on the base config
 */
export default defineConfig((configEnv) => {
  const baseConfig = createBaseConfig();
  return mergeConfig(baseConfig(configEnv), {
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
      // @ts-expect-error -- not documented
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
    } satisfies InlineConfig,
  });
});
