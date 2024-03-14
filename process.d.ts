declare namespace NodeJS {
  export interface ProcessEnv {
    API_SECRET: string;
    MONGO_DB: string;
    NODE_ENV: string;
    PORT: string;
    API_ID: string;
    API_HASH: string;
  }
}
