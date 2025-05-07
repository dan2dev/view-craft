import { resolve } from "path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "src/main.ts"),
      name: "ViewCraft",
      formats: ["es", "cjs", "iife", "system", "umd"],
      fileName: "view-craft",
    },
  },
  plugins: [dts({ rollupTypes: true })],
});
