import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import path from "node:path";

export default defineConfig({
  plugins: [react(), svgr()],
  server: {
    // Expose to docker network (i.e. to nginx proxy)
    host: true,
  },
  esbuild: {
    // Remove console.log and debugger statements from build
    drop: ["console", "debugger"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
