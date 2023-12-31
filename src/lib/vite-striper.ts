import type { Plugin } from "vite";
import { transform } from "./transform.js";

export type ViteStriperOptions = {
  debug?: boolean;
};

/**
 * Add this vite plugin in your vite.config.ts as first one.
 * 
 * It should look like this:
 * ```ts
  import { sveltekit } from "@sveltejs/kit/vite";
  import { defineConfig } from "vite";
  import { striper } from "vite-striper";  // 👈
  
  export default defineConfig({
    plugins: [
      striper(),                           // 👈
      sveltekit()
    ],
  });
 * ```
 * 
 */
export function striper(options?: ViteStriperOptions): Plugin {
  return {
    name: "vite-striper",
    enforce: "pre",

    transform: async (code, filepath, option) => {
      // Don't transform server-side code
      if (option?.ssr) {
        return;
      }
      // files are only in ts
      if (!filepath.endsWith(".ts")) {
        return;
      }

      const { transformed, ...rest } = await transform(code);

      if (options?.debug && transformed) {
        console.log(`
----- after transform of ${filepath}
${rest.code}
----- 
`);
      }

      return rest;
    },
  };
}
