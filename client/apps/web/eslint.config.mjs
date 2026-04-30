import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createNextEslintConfig } from "@repo/eslint-config/next";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default createNextEslintConfig(__dirname);
