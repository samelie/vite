import { makeConfig } from "@rad/publish/build.config";

export default makeConfig({
    entries: ["src/index", "src/setup-vitest"],
    declaration: true,
});
