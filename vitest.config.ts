import react from "@vitejs/plugin-react";
import { configDefaults, defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "happy-dom",
    include: ["**/*.test.{ts,tsx}"],
    // git worktree（.claude/worktrees/*）には別ブランチの作業中コードが入る。
    // 除外しないと、無関係な worktree の失敗で本体の test ゲートが落ちる。
    exclude: [...configDefaults.exclude, "**/.claude/**", "**/ds-bundle/**", "**/.ds-sync/**"],
  },
});
