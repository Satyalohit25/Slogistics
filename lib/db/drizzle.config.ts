import { defineConfig } from "drizzle-kit";
import path from "path";
import process from "node:process";
import fs from "node:fs";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load environment variables from the workspace root .env file
const envPath = path.resolve(__dirname, "../../.env");

if (fs.existsSync(envPath)) {
  process.loadEnvFile(envPath);
}

if (!process.env.DATABASE_URL) {
  throw new Error(
    `DATABASE_URL is missing.\n- Path: ${envPath}\n- File Exists: ${fs.existsSync(envPath)}\n\n` +
    `If 'File Exists' is true, your .env might have the wrong encoding. Ensure it is UTF-8 (not UTF-16/UCS-2).`
  );
}

export default defineConfig({
  schema: "./src/schema/index.ts",
  dialect: "sqlite",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
});
