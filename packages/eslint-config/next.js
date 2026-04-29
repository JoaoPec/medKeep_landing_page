import { FlatCompat } from "@eslint/eslintrc";

/**
 * @param {string} baseDirectory - Diretório do app Next (ex.: apps/web), para resolver eslint-config-next.
 */
export function createNextEslintConfig(baseDirectory) {
  const compat = new FlatCompat({ baseDirectory });
  return [...compat.extends("next/core-web-vitals", "next/typescript")];
}
