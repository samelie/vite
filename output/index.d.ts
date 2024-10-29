import { UserConfig, UserConfigExport } from "vite";

/**
 * Define vite.config to be used for "apps"
 */
declare function defineAppConfig(
  configOverrides?: UserConfig,
): UserConfigExport;

export { defineAppConfig };
