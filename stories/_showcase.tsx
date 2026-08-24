/**
 * Overview Story と Gallery から使う表示部品。
 *
 * ここは「一覧の描画」専用。アプリから import してはいけない
 * （アプリ用の共通部品は components/application/ に置く）。
 * `_` 始まりのファイル名は Story として収集されない。
 *
 * <important>
 * 見本を囲む外枠には必ず `sb-unstyled` を付ける（Showcase が付ける）。
 * addon-docs は MDX / Docs タブの地の文を読みやすくするため
 * `:where(span:not(.sb-unstyled …)) { font-size: 16px }` のような
 * **レイヤー無し**のリセットを当てている。レイヤー無しの宣言は
 * `@layer components` の中にある `.badge` などより常に強いため、
 * `sb-unstyled` を付けないと Docs タブの見本だけ実アプリと違うサイズで描画される。
 * 詳細は stories/foundations/_parts.tsx と同じ理由。
 * </important>
 *
 * <important>
 * 見出しは `h2` だけを使う。h1 を飛ばして h3 から始めると
 * addon-a11y の heading-order が警告する。Story は 1 画面 1 階層で足りる。
 * </important>
 */

import type * as React from "react";
import { cn } from "../lib/utils";

/**
 * Overview / Gallery の最外枠。
 *
 * セクションを縦に積む。`className` で幅を変えられるが、
 * 既定の `max-w-5xl` より広げるのは Gallery のような一覧のときだけにする。
 */
export function Showcase({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn("sb-unstyled max-w-5xl space-y-8", className)}>{children}</div>;
}

/**
 * 見本のグループ。「Variants」「States」のような区切りを作る。
 *
 * `note` には、その並びから何を読み取ればよいかを 1 行で書く。
 * 見本を並べただけでは「どれを使うべきか」が伝わらない。
 */
export function Section({
  title,
  note,
  children,
  className,
}: {
  title: React.ReactNode;
  note?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("space-y-3", className)}>
      <div className="border-b border-border pb-1.5">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {title}
        </h2>
        {note && <p className="mt-1 text-xs text-muted-foreground">{note}</p>}
      </div>
      {children}
    </section>
  );
}

/** 横並び。入り切らない分は折り返す。ボタン・バッジのような小さい見本に使う */
export function Cluster({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn("flex flex-wrap items-center gap-3", className)}>{children}</div>;
}

/** 縦並び。入力欄のような横幅を使う見本に使う */
export function Stack({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn("max-w-sm space-y-3", className)}>{children}</div>;
}

/** ラベル付きの見本。状態名と見た目の対応を読めるようにする */
export function Labeled({
  label,
  children,
  className,
}: {
  label: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <p className="text-[11px] font-medium text-muted-foreground">{label}</p>
      {children}
    </div>
  );
}

/** ラベル付き見本を並べるグリッド */
export function Grid({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn("grid gap-4 sm:grid-cols-2", className)}>{children}</div>;
}

/** 画面の一部を切り出した見本を囲む枠。カード・パネル相当の見た目にする */
export function Frame({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("rounded-xl border border-border bg-card p-4", className)}>{children}</div>
  );
}
