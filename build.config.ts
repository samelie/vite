import { makeConfig } from "@rad/publish/build.config.ts";

export default makeConfig({
    entries: ["src/index", "src/setup-vitest"],
    declaration: true,
});
