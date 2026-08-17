/**
 * スペーシングトークン
 *
 * Tailwind のデフォルトスペーシングスケール（0.25rem 刻み）をそのまま使う。
 * 独自スケールは定義しない。
 *
 * <important>
 * 任意値（`p-[13px]` / `w-[300px]`）は禁止。必ずスケール上の値を使う。
 * 出典: design-system/spacing-and-layout.md
 * </important>
 */

/** よく使うスペーシング値と用途 */
export const SPACING_SCALE = [
  { token: "0.5", rem: "0.125rem", px: "2px", usage: "アイコンの微調整" },
  { token: "1", rem: "0.25rem", px: "4px", usage: "密なリストの行間" },
  { token: "1.5", rem: "0.375rem", px: "6px", usage: "ラベルと入力の間（標準）" },
  { token: "2", rem: "0.5rem", px: "8px", usage: "バッジの内側余白" },
  { token: "3", rem: "0.75rem", px: "12px", usage: "card-sm の内側余白" },
  { token: "4", rem: "1rem", px: "16px", usage: "card の内側余白（標準）" },
  { token: "5", rem: "1.25rem", px: "20px", usage: "ボタンの左右余白" },
  { token: "6", rem: "1.5rem", px: "24px", usage: "card-lg の内側余白・セクション間" },
  { token: "8", rem: "2rem", px: "32px", usage: "ページ内の大きな区切り" },
  { token: "12", rem: "3rem", px: "48px", usage: "空状態の上下余白" },
] as const;

/**
 * 標準化されたスペーシングの決まり
 *
 * 混在を防ぐため、以下は値を1つに固定する。
 * 出典: design-system/components.md
 */
export const SPACING_RULES = [
  { context: "ラベルと入力欄の間", value: "mb-1.5", note: "mb-1 / mb-2 との混在を禁止" },
  { context: "エラーメッセージの上", value: "mt-1.5", note: "" },
  { context: "ヘルプテキストの上", value: "mt-1", note: "" },
  { context: "アイコンとラベルの間", value: "gap-1.5", note: "ボタン内の標準" },
  { context: "フォーム項目の縦間隔", value: "space-y-4", note: "" },
  { context: "カード内の要素間", value: "gap-3", note: "" },
] as const;
