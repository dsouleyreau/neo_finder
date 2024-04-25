import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    // Expose to docker network (i.e. to nginx proxy)
    host: true,
  },
});
