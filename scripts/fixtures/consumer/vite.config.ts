import path from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// 実アプリの islands と同じく、単一エントリを bundle する。
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      input: path.resolve(import.meta.dirname, "islands/main.tsx"),
    },
  },
});
