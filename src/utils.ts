import type { ExecSyncOptionsWithStringEncoding } from "node:child_process";
import type { Optional } from "ts-toolbelt/out/Object/Optional";

import { execSync as nodeExecSync } from "node:child_process";

export function execSync(
    cmd: string,
    opts?: Optional<ExecSyncOptionsWithStringEncoding, "encoding">,
) {
    return nodeExecSync(cmd, {
        shell: "/bin/bash",
        encoding: "utf-8",
        ...opts,
    })
        .toString()
        .trim();
}
