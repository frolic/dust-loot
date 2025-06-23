import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { mud } from "vite-plugin-mud";

export default defineConfig({
  plugins: [
    react(),
    mud({ worldsFile: "node_modules/@dust/world/worlds.json" }),
  ],
  build: {
    target: "es2022",
    minify: true,
    sourcemap: true,
  },
});
