import { resolve } from "path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import { viteStaticCopy } from "vite-plugin-static-copy";


export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "src/main.ts"),
      name: "ViewCraft",
      formats: ["es", "cjs", "iife", "system", "umd"],
      fileName: "view-craft",
    },
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
      "view-craft": resolve(__dirname, "src/main.ts"),
    },
  },
  plugins: [dts({ rollupTypes: true }),
  viteStaticCopy({
    targets: [
      {
        src: "types",
        dest: ".",
      },
    ],
  }),
  ],
});
