import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Split only the library package (works for node_modules and linked workspace)
          const isNodeModulesVC = /[\\/]node_modules[\\/].*view-craft[\\/]/.test(id);
          const isWorkspaceVC = /[\\/]view-craft[\\/](src|dist)[\\/]/.test(id) && !/[\\/]examples[\\/]/.test(id);
          if (isNodeModulesVC || isWorkspaceVC) {
            return 'view-craft';
          }
        },
      },
    },
  },
});
