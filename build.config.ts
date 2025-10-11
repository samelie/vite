import { makeConfig } from "@rad/build-configs/build.config";

export default makeConfig({
    entries: ["src/index", "src/setup-vitest"],
    declaration: true,
});
