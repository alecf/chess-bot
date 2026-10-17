import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    // New in eslint-plugin-react-hooks 7 (Next 16). Existing effects still sync
    // state this way; keep it visible as a warning until they're refactored.
    rules: { "react-hooks/set-state-in-effect": "warn" },
  },
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
]);

export default eslintConfig;
