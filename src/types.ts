export interface CesiumPluginParams {
  projectDir: string;
}

export interface PackageJson {
  homepage: string;
  dependencies: Record<string, string>;
  devDependencies: Record<string, string>;
  peerDependencies: Record<string, string>;
}
