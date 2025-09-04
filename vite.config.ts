import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import mdx from "@mdx-js/rollup";
import path from "path";

export default defineConfig(() => ({
  server: {
    port: 5173,
    strictPort: true,
    host: "127.0.0.1",
    open: true,
  },
  preview: {
    port: 8080,
    strictPort: true,
    host: "127.0.0.1",
  },
  plugins: [mdx(), react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
