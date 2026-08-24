/**
 * アイコンの光学メトリクス（実測値）
 *
 * <important>
 * このファイルは生成物。手で編集しない。
 * アイコンを追加したら下の測定手順で再生成する。
 * </important>
 *
 * なぜ必要か:
 *   アイコンの CSS 上の箱と、実際に描画される字形の幅は一致しない。
 *   例えば lucide の `plus` は 24 の viewBox に 66.7% しか描かれておらず、
 *   16px で表示すると片側 2.67px の空白を箱の内側に持っている。
 *   一方 `download` は 83.3% で 1.33px しかない。
 *   そのため CSS の gap が同じでも、アイコンごとに見える間隔が変わる。
 *   この表を使って「箱の空き」を一定に正規化する。
 *   出典: LiftKit（https://github.com/Chainlift/liftkit）の光学補正の考え方を、
 *   アイコンの字形まで一段深く適用したもの。LiftKit 自身はここまで踏み込んでいない。
 *
 * 測定手順:
 *   1. 各アイコンの path/circle/line 等を viewBox="0 0 24 24" の svg に入れる
 *   2. 全要素の getBBox() を合成して外接矩形を得る
 *   3. stroke-width（lucide 2 / Heroicons 1.5）を足して 24 で割る → width / height
 *   4. empty = (1 - width) / 2
 *
 * 対応する CSS は tokens/icon-metrics.generated.css。
 */

/** 24 の viewBox に対する描画範囲の割合（stroke 込み） */
export interface IconMetric {
  /** 描画される幅の割合 */
  width: number;
  /** 描画される高さの割合 */
  height: number;
  /** 箱の内側の片側の空きの割合 = (1 - width) / 2 */
  empty: number;
}

/** lucide-react（React コンポーネントが使う）。キーは svg に付く `lucide-<key>` クラスと一致する */
export const LUCIDE_METRICS: Record<string, IconMetric> = {
  archive: { width: 0.9167, height: 0.8333, empty: 0.0417 },
  bell: { width: 0.8333, height: 0.9167, empty: 0.0833 },
  calendar: { width: 0.8333, height: 0.875, empty: 0.0833 },
  check: { width: 0.75, height: 0.5417, empty: 0.125 },
  "chevron-down": { width: 0.5833, height: 0.3333, empty: 0.2083 },
  "chevron-left": { width: 0.3333, height: 0.5833, empty: 0.3334 },
  "chevron-right": { width: 0.3333, height: 0.5833, empty: 0.3334 },
  "chevron-up": { width: 0.5833, height: 0.3333, empty: 0.2083 },
  "circle-alert": { width: 0.9167, height: 0.9167, empty: 0.0417 },
  "circle-check": { width: 0.9167, height: 0.9167, empty: 0.0417 },
  "circle-check-big": { width: 0.9167, height: 0.9167, empty: 0.0417 },
  "circle-x": { width: 0.9167, height: 0.9167, empty: 0.0417 },
  clock: { width: 0.9167, height: 0.9167, empty: 0.0417 },
  copy: { width: 0.9167, height: 0.9167, empty: 0.0417 },
  download: { width: 0.8333, height: 0.8333, empty: 0.0833 },
  ellipsis: { width: 0.75, height: 0.1667, empty: 0.125 },
  "ellipsis-vertical": { width: 0.1667, height: 0.75, empty: 0.4167 },
  heart: { width: 0.9167, height: 0.7923, empty: 0.0417 },
  inbox: { width: 0.9167, height: 0.75, empty: 0.0417 },
  info: { width: 0.9167, height: 0.9167, empty: 0.0417 },
  "layout-grid": { width: 0.8333, height: 0.8333, empty: 0.0833 },
  list: { width: 0.8333, height: 0.6667, empty: 0.0833 },
  "loader-circle": { width: 0.8333, height: 0.8333, empty: 0.0833 },
  moon: { width: 0.8328, height: 0.8328, empty: 0.0836 },
  "octagon-x": { width: 0.9167, height: 0.9167, empty: 0.0417 },
  "package-check": { width: 0.875, height: 0.9166, empty: 0.0625 },
  pencil: { width: 0.9167, height: 0.9166, empty: 0.0417 },
  pin: { width: 0.6667, height: 0.9167, empty: 0.1667 },
  plus: { width: 0.6667, height: 0.6667, empty: 0.1667 },
  "rows-3": { width: 0.8333, height: 0.8333, empty: 0.0833 },
  search: { width: 0.8333, height: 0.8333, empty: 0.0833 },
  settings: { width: 0.8297, height: 0.9152, empty: 0.0852 },
  store: { width: 0.9169, height: 0.875, empty: 0.0415 },
  sun: { width: 0.9167, height: 0.9167, empty: 0.0417 },
  trash: { width: 0.8333, height: 0.9167, empty: 0.0833 },
  "trash-2": { width: 0.8333, height: 0.9167, empty: 0.0833 },
  "triangle-alert": { width: 0.9173, height: 0.8339, empty: 0.0413 },
  truck: { width: 0.9167, height: 0.75, empty: 0.0417 },
  user: { width: 0.6667, height: 0.8333, empty: 0.1667 },
  x: { width: 0.5833, height: 0.5833, empty: 0.2083 },
};

/** Heroicons v2 outline（テンプレート側が使う）。キーは tokens/icons.generated.ts の ICON_PATHS と一致する */
export const HEROICONS_METRICS: Record<string, IconMetric> = {
  "arrow-down": { width: 0.6875, height: 0.8125, empty: 0.1562 },
  "arrow-left": { width: 0.8125, height: 0.6875, empty: 0.0938 },
  "arrow-right": { width: 0.8125, height: 0.6875, empty: 0.0938 },
  "arrow-up": { width: 0.6875, height: 0.8125, empty: 0.1562 },
  "arrows-up-down": { width: 0.8125, height: 0.8125, empty: 0.0938 },
  "bars-3": { width: 0.75, height: 0.5, empty: 0.125 },
  beaker: { width: 0.8841, height: 0.8125, empty: 0.058 },
  bell: { width: 0.7551, height: 0.8124, empty: 0.1225 },
  "book-open": { width: 0.8125, height: 0.7518, empty: 0.0938 },
  bookmark: { width: 0.6875, height: 0.8126, empty: 0.1562 },
  "building-office": { width: 0.75, height: 0.8125, empty: 0.125 },
  calendar: { width: 0.8125, height: 0.8125, empty: 0.0938 },
  "chart-bar": { width: 0.8125, height: 0.8125, empty: 0.0938 },
  chat: { width: 0.875, height: 0.8125, empty: 0.0625 },
  check: { width: 0.6875, height: 0.625, empty: 0.1562 },
  "check-circle": { width: 0.8125, height: 0.8125, empty: 0.0938 },
  "chevron-down": { width: 0.6875, height: 0.375, empty: 0.1562 },
  "chevron-left": { width: 0.375, height: 0.6875, empty: 0.3125 },
  "chevron-right": { width: 0.375, height: 0.6875, empty: 0.3125 },
  "chevron-up": { width: 0.6875, height: 0.375, empty: 0.1562 },
  clipboard: { width: 0.6875, height: 0.875, empty: 0.1562 },
  clock: { width: 0.8125, height: 0.8125, empty: 0.0938 },
  cog: { width: 0.7786, height: 0.8125, empty: 0.1107 },
  document: { width: 0.6875, height: 0.875, empty: 0.1562 },
  download: { width: 0.8125, height: 0.8125, empty: 0.0938 },
  "ellipsis-horizontal": { width: 0.625, height: 0.125, empty: 0.1875 },
  "ellipsis-vertical": { width: 0.125, height: 0.625, empty: 0.4375 },
  "exclamation-triangle": { width: 0.8631, height: 0.7811, empty: 0.0685 },
  eye: { width: 0.8971, height: 0.6875, empty: 0.0514 },
  "eye-slash": { width: 0.9013, height: 0.8125, empty: 0.0494 },
  folder: { width: 0.875, height: 0.75, empty: 0.0625 },
  funnel: { width: 0.8125, height: 0.8125, empty: 0.0938 },
  heart: { width: 0.8125, height: 0.75, empty: 0.0938 },
  home: { width: 0.875, height: 0.8243, empty: 0.0625 },
  inbox: { width: 0.875, height: 0.75, empty: 0.0625 },
  "information-circle": { width: 0.8125, height: 0.8125, empty: 0.0938 },
  "light-bulb": { width: 0.6875, height: 0.9374, empty: 0.1562 },
  link: { width: 0.8749, height: 0.8749, empty: 0.0625 },
  "list-bullet": { width: 0.7656, height: 0.5313, empty: 0.1172 },
  "lock-closed": { width: 0.6875, height: 0.875, empty: 0.1562 },
  "lock-open": { width: 0.9375, height: 0.875, empty: 0.0312 },
  "magnifying-glass": { width: 0.8125, height: 0.8126, empty: 0.0938 },
  "map-pin": { width: 0.6875, height: 0.8438, empty: 0.1562 },
  "paper-clip": { width: 0.7866, height: 0.8749, empty: 0.1067 },
  pencil: { width: 0.7188, height: 0.7188, empty: 0.1406 },
  "pencil-square": { width: 0.875, height: 0.875, empty: 0.0625 },
  photo: { width: 0.875, height: 0.6875, empty: 0.0625 },
  plus: { width: 0.6875, height: 0.6875, empty: 0.1562 },
  printer: { width: 0.8125, height: 0.875, empty: 0.0938 },
  "question-mark-circle": { width: 0.8125, height: 0.8125, empty: 0.0938 },
  "rocket-launch": { width: 0.875, height: 0.875, empty: 0.0625 },
  search: { width: 0.8125, height: 0.8126, empty: 0.0938 },
  share: { width: 0.8133, height: 0.8735, empty: 0.0933 },
  sparkles: { width: 0.875, height: 0.875, empty: 0.0625 },
  "squares-2x2": { width: 0.75, height: 0.75, empty: 0.125 },
  star: { width: 0.8255, height: 0.7905, empty: 0.0872 },
  tag: { width: 0.8287, height: 0.8287, empty: 0.0857 },
  "thumb-up": { width: 0.875, height: 0.8125, empty: 0.0625 },
  trash: { width: 0.75, height: 0.875, empty: 0.125 },
  upload: { width: 0.8125, height: 0.8125, empty: 0.0938 },
  user: { width: 0.6874, height: 0.875, empty: 0.1563 },
  users: { width: 0.875, height: 0.8125, empty: 0.0625 },
  wrench: { width: 0.8752, height: 0.8752, empty: 0.0624 },
  x: { width: 0.5625, height: 0.5625, empty: 0.2188 },
  "x-circle": { width: 0.8125, height: 0.8125, empty: 0.0938 },
  "x-mark": { width: 0.5625, height: 0.5625, empty: 0.2188 },
};

/**
 * lucide の別名 → 実体名
 *
 * `AlertCircle` のような旧名は `circle-alert` を再エクスポートしているだけで、
 * svg に付くクラスは実体名の `lucide-circle-alert` になる。
 * LUCIDE_METRICS は実体名のみを持つ。
 */
export const LUCIDE_ALIASES: Record<string, string> = {
  "alert-circle": "circle-alert",
  "alert-triangle": "triangle-alert",
  "check-circle": "circle-check-big",
  "loader-2": "loader-circle",
  "more-horizontal": "ellipsis",
  "more-vertical": "ellipsis-vertical",
  "x-circle": "circle-x",
};
