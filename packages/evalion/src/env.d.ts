/// <reference types="node" />

interface ImportMetaEnv {
  readonly DEV: boolean;
  readonly PROD: boolean;
  readonly MODE: string;
  readonly VITE_BETTER_AUTH_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
