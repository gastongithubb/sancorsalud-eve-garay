/// <reference types="vite/client" />

declare namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_TURSO_DATABASE_URL: string;
      NEXT_PUBLIC_TURSO_AUTH_TOKEN: string;
      NEXT_PUBLIC_GOOGLE_CLIENT_ID: string;
      NEXT_PUBLIC_GOOGLE_CLIENT_SECRET: string;
      // añade otras variables de entorno aquí si es necesario
    }
  }
    
    interface ImportMeta {
      readonly env: ImportMetaEnv;
    }
    