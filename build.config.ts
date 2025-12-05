import { makeUnbuildConfig } from "@adddog/build-configs/unbuild";

export default makeUnbuildConfig({
    entries: ["src/index", "src/setup-vitest", "src/app.config", "src/test.config"],
    declaration: true,
});
