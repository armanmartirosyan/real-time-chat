import fs from "node:fs";
import path from "node:path";
import colors from "./colors";

export const PRIVATE_KEY: string = fs.readFileSync(path.join(__dirname, "../certificates/private.pem"), 'utf-8');
export const PUBLIC_KEY: string = fs.readFileSync(path.join(__dirname, "../certificates/public.pem"), 'utf-8');
console.log(`${colors.cyan}Keys loaded successfully`);