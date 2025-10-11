import { makeConfig } from "@rad/build-configs/unbuild";

export default makeUnbuildConfig({
    entries: ["src/index", "src/setup-vitest"],
    declaration: true,
});
