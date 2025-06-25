import path from 'path';
import { config as dotenvConfig, DotenvConfigOutput } from 'dotenv';
const env: DotenvConfigOutput = dotenvConfig({
  path: path.join(__dirname, '../.env'),
});

if (env.error) {
  console.error('PLEASE CREATE .env');
  process.exit(1);
}

export const WS_PORT: number = Number(process.env.WS_PORT) || 8081;
export const WS_HOST: string = process.env.WS_HOST || '0.0.0.0';
export const ALLOWED_ORIGINS: string[] = process.env.ALLOWED_ORIGINS?.split(',') || ["*"];
