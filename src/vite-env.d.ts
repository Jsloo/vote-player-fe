/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BASE_URL: string;
  readonly VITE_PARENT_URL: string;
  readonly VITE_CAMPAIGN_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
