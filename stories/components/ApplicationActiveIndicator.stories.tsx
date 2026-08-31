import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { ApplicationActiveIndicator } from "../../components/application";
import { Labeled, Section, Showcase, Stack } from "../_showcase";

/**
 * ApplicationActiveIndicator は「いま選ばれている項目」の背面に敷く枠。
 *
 * <important>
 * **単体では意味を持たない。** 親要素に `relative` が必要（`absolute inset-0` で敷く）。
 * 同じ `layoutId` を共有する要素の間でだけ framer-motion の shared layout が働き、
 * 枠がスライドして移る。`layoutId` が違えばフェードするだけで移動しない。
 * </important>
 */
const meta = {
  title: "Components/ApplicationActiveIndicator",
  component: ApplicationActiveIndicator,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
## 目的

選択中の項目を示す枠を、**項目から項目へスライドさせる**。
枠を各項目が個別に描くと、選択が移ったときに「消えて出る」だけになり、
どこからどこへ移ったかが読み取れない。

## 使う場面

- ナビゲーション・タブ・セグメントの選択位置
- \`ApplicationNavItem\` は内部でこれを使っている（\`active\` のときだけ描く）

## 使わない場面

| 場面 | 代わりに使うもの |
|---|---|
| ナビゲーション項目そのもの | \`ApplicationNavItem\`（枠・ラベル・バッジ・リンク/ボタンを含む） |
| タブ | \`ApplicationTabs\` |
| 押せる要素 | これは \`pointer-events-none\` / \`aria-hidden\` の装飾。操作は親が持つ |

## API

| props | 既定 | 説明 |
|---|---|---|
| \`layoutId\` | \`"active-nav-indicator"\` | 共有レイアウトのキー。**同じ値を持つ要素の間でだけ枠が移動する**。1 画面に独立したナビが 2 つあるなら別の値にする |
| \`className\` | — | 色。既定は \`bg-primary/10 border-primary/20\` |

variant は持たない。色は \`className\` で外から渡す。
\`ApplicationNavItem\` の 7 色は同コンポーネントの \`colorStyles\` が持っており、
ここへは解決済みの文字列が渡ってくる。

## 注意

\`aria-hidden="true"\` を付けている。選択状態は枠ではなく、
親側の \`aria-current\` などで伝えること。色だけに意味を持たせない。
`,
      },
    },
  },
} satisfies Meta<typeof ApplicationActiveIndicator>;

export default meta;
type Story = StoryObj<typeof meta>;

const COLORS = [
  { label: "既定（primary）", className: undefined },
  { label: "blue", className: "bg-blue-500/10 border-blue-500/20" },
  { label: "emerald", className: "bg-emerald-500/10 border-emerald-500/20" },
  { label: "rose", className: "bg-rose-500/10 border-rose-500/20" },
];

const ITEMS = ["ダッシュボード", "アイデア一覧", "プロジェクト", "設定"];

/** 親に `relative` を持つ枠の中で、この部品がどう敷かれるか */
function Slot({ label, className }: { label: string; className?: string }) {
  return (
    <div className="relative rounded-lg px-3 py-2 text-sm">
      <ApplicationActiveIndicator layoutId={`showcase-${label}`} className={className} />
      <span className="relative z-10">{label}</span>
    </div>
  );
}

/**
 * Overview — 何ができる部品かをこの 1 枚で把握する。
 */
export const Overview: Story = {
  render: () => (
    <Showcase>
      <Section
        title="単体"
        note="親に relative が要る。枠は absolute inset-0 で敷かれ、文字は z-10 で上に出す"
      >
        <Stack>
          {COLORS.map((c) => (
            <Labeled key={c.label} label={c.label}>
              <Slot label={c.label} className={c.className} />
            </Labeled>
          ))}
        </Stack>
      </Section>

      <Section
        title="親に relative が無いとどうなるか"
        note="inset-0 の基準が祖先まで遡るため、枠が意図しない範囲に広がる。必ず親へ relative を付ける"
      >
        <div className="relative">
          <div className="rounded-lg border border-dashed border-border px-3 py-2 text-sm text-muted-foreground">
            親に relative が無い項目（枠はこの外側の枠いっぱいに広がってしまう）
          </div>
        </div>
      </Section>

      <Section
        title="選択の移動"
        note="同じ layoutId を共有しているので、選択を変えると枠がスライドして移る"
      >
        <MovingExample />
      </Section>
    </Showcase>
  ),
};

function MovingExample() {
  const [active, setActive] = useState(0);
  return (
    <nav className="max-w-xs space-y-1" aria-label="サンプルナビゲーション">
      {ITEMS.map((item, i) => (
        <button
          key={item}
          type="button"
          onClick={() => setActive(i)}
          aria-current={active === i ? "page" : undefined}
          className="relative block w-full rounded-lg px-3 py-2 text-left text-sm"
        >
          {active === i && <ApplicationActiveIndicator layoutId="showcase-moving" />}
          <span className="relative z-10">{item}</span>
        </button>
      ))}
    </nav>
  );
}

/**
 * 選択が移動する様子だけを見る。`layoutId` を共有しているのがポイント。
 */
export const Moving: Story = {
  render: () => <MovingExample />,
};

/**
 * `layoutId` を分けると移動しない。独立したナビが同一画面に複数あるときはこちら。
 */
export const SeparateLayoutIds: Story = {
  render: () => {
    return (
      <Showcase>
        <Section
          title="layoutId を分けた場合"
          note="枠は移動せず、その場で現れる。片方の選択がもう片方へ飛ばないので、独立したナビには必ず別の値を渡す"
        >
          <div className="flex gap-8">
            <IsolatedNav id="nav-a" label="ナビ A" />
            <IsolatedNav id="nav-b" label="ナビ B" />
          </div>
        </Section>
      </Showcase>
    );
  },
};

function IsolatedNav({ id, label }: { id: string; label: string }) {
  const [active, setActive] = useState(0);
  return (
    <nav className="w-40 space-y-1" aria-label={label}>
      <p className="text-[11px] font-medium text-muted-foreground">{label}</p>
      {ITEMS.slice(0, 3).map((item, i) => (
        <button
          key={item}
          type="button"
          onClick={() => setActive(i)}
          aria-current={active === i ? "page" : undefined}
          className="relative block w-full rounded-lg px-3 py-2 text-left text-sm"
        >
          {active === i && <ApplicationActiveIndicator layoutId={id} />}
          <span className="relative z-10">{item}</span>
        </button>
      ))}
    </nav>
  );
}
