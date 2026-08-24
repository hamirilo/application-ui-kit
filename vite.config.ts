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
      // islands/auto-mount は import 時に自動マウントを実行する副作用エントリのため、
      // index から import させず独立したエントリにする（package.json の sideEffects も参照）。
      entry: [
        fileURLToPath(new URL("./components/application/index.ts", import.meta.url)),
        fileURLToPath(new URL("./components/islands/index.ts", import.meta.url)),
        fileURLToPath(new URL("./components/islands/auto-mount.tsx", import.meta.url)),
      ],
      formats: ["es"],
    },
    rollupOptions: {
      external: isExternal,
      output: {
        // コンポーネントごとにファイルを分ける。全部入りの 1 ファイルにすると、
        // 利用側が 2 つ import しただけで framer-motion や base-ui まで巻き込む
        // (React.forwardRef の呼び出しが副作用とみなされ、tree-shaking が効かない)。
        preserveModules: true,
        preserveModulesRoot: ".",
        entryFileNames: "[name].js",
      },
    },
    sourcemap: true,
    emptyOutDir: true,
  },
});
