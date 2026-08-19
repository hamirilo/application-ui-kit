import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// 配布物のビルド。
//
// 利用側 (Django + Vite の Islands 構成など) が TypeScript のビルド設定を
// 持たなくても import できるよう、JS と型定義を dist/ へ出す。
// 型定義は `tsc -p tsconfig.build.json` が別途出力する (package.json の build)。
//
// components/ はビルド後も配布物に含める。tokens/theme.css の
// `@source "../components"` が、利用側の Tailwind にクラス名を拾わせるために参照する。

const pkg = JSON.parse(readFileSync(new URL("./package.json", import.meta.url), "utf8"));

// dependencies と peerDependencies は利用側が解決する。バンドルへ取り込まない。
const externalPackages = [
  ...Object.keys(pkg.dependencies ?? {}),
  ...Object.keys(pkg.peerDependencies ?? {}),
];

const isExternal = (id: string) =>
  externalPackages.some((name) => id === name || id.startsWith(`${name}/`));

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: fileURLToPath(new URL("./components/application/index.ts", import.meta.url)),
      formats: ["es"],
      fileName: () => "index.js",
    },
    rollupOptions: {
      external: isExternal,
    },
    sourcemap: true,
    emptyOutDir: true,
  },
});
