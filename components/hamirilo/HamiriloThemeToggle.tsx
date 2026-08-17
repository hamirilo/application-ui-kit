"use client";

import { Moon, Sun } from "lucide-react";
import * as React from "react";
import { cn } from "../../lib/utils";

export interface HamiriloThemeToggleProps {
  /** カスタムCSSクラス */
  className?: string;
  /** アイコンに適用するCSSクラス (デフォルト: "w-4 h-4") */
  iconClassName?: string;
  /** アクセシビリティ用ラベル (デフォルト: "テーマ切り替え") */
  ariaLabel?: string;
  /**
   * カスタムの切り替えハンドラー。
   * 指定しない場合、html要素の .dark クラスおよび localStorage('theme') を自動切り替えします。
   */
  onToggle?: (isDark: boolean) => void;
  /** 現在のテーマを指定（制御モード） */
  theme?: "light" | "dark";
}

export function HamiriloThemeToggle({
  className,
  iconClassName = "w-4 h-4",
  ariaLabel = "テーマ切り替え",
  onToggle,
  theme: controlledTheme,
}: HamiriloThemeToggleProps) {
  const [mounted, setMounted] = React.useState(false);
  const [internalDark, setInternalDark] = React.useState(false);

  // マウント後にDOMクラスおよびlocalStorageをチェック
  React.useEffect(() => {
    setMounted(true);
    if (typeof document !== "undefined") {
      const isDarkClass = document.documentElement.classList.contains("dark");
      setInternalDark(isDarkClass);
    }
  }, []);

  const isDark = controlledTheme ? controlledTheme === "dark" : internalDark;

  const handleToggle = () => {
    const nextDark = !isDark;

    if (!controlledTheme && typeof document !== "undefined") {
      if (nextDark) {
        document.documentElement.classList.add("dark");
        try {
          localStorage.setItem("theme", "dark");
        } catch (_) {}
      } else {
        document.documentElement.classList.remove("dark");
        try {
          localStorage.setItem("theme", "light");
        } catch (_) {}
      }
      setInternalDark(nextDark);
    }

    onToggle?.(nextDark);
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      className={cn(
        "p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-accent transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className,
      )}
      title={mounted ? (isDark ? "ライトモードに切り替え" : "ダークモードに切り替え") : ariaLabel}
      aria-label={ariaLabel}
    >
      {!mounted ? (
        <span className={cn("inline-block", iconClassName)} aria-hidden="true" />
      ) : isDark ? (
        <Sun className={cn(iconClassName, "text-amber-400")} />
      ) : (
        <Moon className={cn(iconClassName, "text-indigo-600 dark:text-indigo-400")} />
      )}
    </button>
  );
}
