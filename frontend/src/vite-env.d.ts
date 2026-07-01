// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VUTE_API_URL: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}