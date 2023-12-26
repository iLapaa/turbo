import { Options, defineConfig } from "tsup";

import { config } from "@repo/tsup-config";

export default defineConfig((opts) => ({
  ...(config as Options),
  entry: ["./index.ts"],
  clean: !opts.watch,
}));
