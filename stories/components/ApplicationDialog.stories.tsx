import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";
import {
  ApplicationButton,
  ApplicationDialog,
  ApplicationFormField,
  ApplicationInput,
} from "../../components/application";

/**
 * ApplicationDialog は汎用のモーダルダイアログ。
 *
 * <important>
 * 用途が決まっている場合は専用コンポーネントを使う。
 * 確認 → `ApplicationConfirmDialog` / フォーム → `ApplicationFormDialog`。
 * ApplicationDialog を直接使うのは、それらに当てはまらない場合だけ。
 * </important>
 */
const meta = {
  title: "Components/ApplicationDialog",
  component: ApplicationDialog,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
## 目的

モーダルの枠（オーバーレイ・見出し・本文・フッター）と、
開閉・フォーカストラップ・\`Esc\` での閉じる動作を統一する。

## 使う場面

- 確認でもフォームでもない内容を、画面遷移せずに見せたい場合
- 詳細情報の表示、選択ウィザードなど

## 使わない場面

| 場面 | 代わりに使うもの |
|---|---|
| はい / いいえ の確認 | \`ApplicationConfirmDialog\`（アイコン・エラー表示・非同期処理が組み込み済み） |
| フォームの入力と送信 | \`ApplicationFormDialog\`（Enter 送信・送信中の入力無効化が組み込み済み） |
| 操作結果の通知 | \`ApplicationToast\`。完了を伝えるだけでダイアログを出さない |
| \`confirm()\` / \`alert()\` | **禁止。** 見た目が OS 依存で、文言も制御できない |
| markup（.html） | 各プロジェクトのモーダル partial か application rendering。React application を新設しない |
| 情報量が多い（1 画面ぶん以上） | 専用ページへ遷移する。モーダル内スクロールは読みにくい |

## Props

| Prop | 説明 |
|---|---|
| \`open\` / \`onOpenChange\` | 開閉状態（**必ず制御する**） |
| \`title\` | 見出し（必須） |
| \`description\` | 見出し下の説明 |
| \`children\` | 本文 |
| \`footer\` | フッターを自前で組む場合 |
| \`confirmText\` / \`cancelText\` | \`footer\` 未指定時にボタンを自動生成する |
| \`onConfirm\` / \`onCancel\` | 自動生成ボタンのハンドラ |
| \`confirmVariant\` | \`primary\` / \`danger\` / \`success\` |
| \`confirmLoading\` | 処理中。**閉じる操作を全て無効化**する（後述） |
| \`maxWidth\` | \`sm\` / \`md\` / \`lg\`（既定） / \`xl\` / \`2xl\` |

## 注意事項

- **\`confirmText\` / \`cancelText\` を渡さないとフッターが出ない。**
  閉じる手段が右上の × と \`Esc\` だけになるため、意図しているか確認する
- **\`confirmLoading\` 中は Esc・背景クリック・× の全てが無効になる。**
  二重送信と、処理中の離脱を防ぐため。処理が長い場合は本文に進捗を出す
- **キャンセルは左、主アクションは右。** 自動生成フッターはこの順で並ぶ
- 開いている間は背後のスクロールが止まり、フォーカスがダイアログ内に閉じ込められる
- **ダイアログを重ねない。** 確認の中に確認を出す構造は、Esc の対象が分からなくなる
- \`title\` は \`aria-labelledby\`、\`description\` は \`aria-describedby\` で紐づく。
  空文字を渡さないこと
        `,
      },
    },
  },
  argTypes: {
    open: { table: { disable: true } },
    onOpenChange: { table: { disable: true } },
    title: { control: "text" },
    description: { control: "text" },
    confirmText: { control: "text" },
    cancelText: { control: "text" },
    confirmVariant: { control: "select", options: ["primary", "danger", "success"] },
    confirmLoading: { control: "boolean" },
    maxWidth: { control: "select", options: ["sm", "md", "lg", "xl", "2xl"] },
    children: { table: { disable: true } },
    footer: { table: { disable: true } },
  },
  args: {
    title: "申請の詳細",
    description: "申請の内容を確認できます。",
    children: null,
    open: false,
    onOpenChange: () => {},
  },
} satisfies Meta<typeof ApplicationDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 開くボタンと組み合わせた基本形。
 *
 * Story では `useState` で開閉を持っているが、実際の画面でも同じ形になる
 * （`open` は必ず呼び出し側が制御する）。
 */
export const Default: Story = {
  render: (args) => {
    const [open, setOpen] = React.useState(false);
    return (
      <>
        <ApplicationButton variant="primary" onClick={() => setOpen(true)}>
          ダイアログを開く
        </ApplicationButton>
        <ApplicationDialog {...args} open={open} onOpenChange={setOpen}>
          <p className="text-sm text-muted-foreground">申請番号 SYS-2026-0001 の内容です。</p>
        </ApplicationDialog>
      </>
    );
  },
};

/**
 * フッターなし。
 *
 * 閉じる手段が右上の × と `Esc` だけになる。
 * 「読むだけ」の内容には成立するが、閉じ方が分かりにくい場合は
 * `cancelText="閉じる"` を渡したほうがよい。
 */
export const WithoutFooter: Story = {
  render: (args) => {
    const [open, setOpen] = React.useState(false);
    return (
      <>
        <ApplicationButton variant="secondary" onClick={() => setOpen(true)}>
          フッターなしで開く
        </ApplicationButton>
        <ApplicationDialog
          {...args}
          open={open}
          onOpenChange={setOpen}
          title="お知らせ"
          description={undefined}
          confirmText={undefined}
          cancelText={undefined}
        >
          <p className="text-sm text-foreground">2026 年 8 月 1 日にメンテナンスを実施します。</p>
        </ApplicationDialog>
      </>
    );
  },
};

/** 確定・キャンセルボタン付き。キャンセルが左、主アクションが右に並ぶ。 */
export const WithButtons: Story = {
  render: (args) => {
    const [open, setOpen] = React.useState(false);
    return (
      <>
        <ApplicationButton variant="primary" onClick={() => setOpen(true)}>
          確認して進む
        </ApplicationButton>
        <ApplicationDialog
          {...args}
          open={open}
          onOpenChange={setOpen}
          title="この内容で申請しますか？"
          description="送信後は編集できません。"
          confirmText="申請する"
          cancelText="キャンセル"
          onConfirm={() => setOpen(false)}
        >
          <dl className="space-y-2 text-sm">
            <div className="flex gap-3">
              <dt className="w-20 shrink-0 text-muted-foreground">件名</dt>
              <dd className="text-foreground">備品購入（モニター 2 台）</dd>
            </div>
            <div className="flex gap-3">
              <dt className="w-20 shrink-0 text-muted-foreground">金額</dt>
              <dd className="text-foreground">78,000 円</dd>
            </div>
          </dl>
        </ApplicationDialog>
      </>
    );
  },
};

/**
 * 処理中（`confirmLoading`）。
 *
 * ボタンにスピナーが出るだけでなく、**`Esc`・背景クリック・× の全てが無効**になる。
 * 二重送信と、処理中に画面を離れることを防ぐため。
 * 開いてから 3 秒で解除される。
 */
export const Loading: Story = {
  render: (args) => {
    const [open, setOpen] = React.useState(false);
    const [loading, setLoading] = React.useState(false);

    const handleConfirm = () => {
      setLoading(true);
      window.setTimeout(() => {
        setLoading(false);
        setOpen(false);
      }, 3000);
    };

    return (
      <>
        <ApplicationButton variant="primary" onClick={() => setOpen(true)}>
          送信を試す
        </ApplicationButton>
        <ApplicationDialog
          {...args}
          open={open}
          onOpenChange={setOpen}
          title="申請を送信します"
          description="送信中はダイアログを閉じられません。"
          confirmText="送信"
          cancelText="キャンセル"
          onConfirm={handleConfirm}
          confirmLoading={loading}
        >
          <p className="text-sm text-muted-foreground">
            送信ボタンを押すと 3 秒間ローディング状態になります。
          </p>
        </ApplicationDialog>
      </>
    );
  },
};

/**
 * 危険な操作（`confirmVariant="danger"`）。
 *
 * ただし削除確認は `ApplicationConfirmDialog type="danger"` を使うほうがよい
 * （アイコンとエラー表示が付く）。
 */
export const DangerVariant: Story = {
  render: (args) => {
    const [open, setOpen] = React.useState(false);
    return (
      <>
        <ApplicationButton variant="danger" onClick={() => setOpen(true)}>
          削除
        </ApplicationButton>
        <ApplicationDialog
          {...args}
          open={open}
          onOpenChange={setOpen}
          title="申請を削除しますか？"
          description="削除すると元に戻せません。"
          confirmText="削除する"
          cancelText="キャンセル"
          confirmVariant="danger"
          onConfirm={() => setOpen(false)}
          maxWidth="md"
        >
          <p className="text-sm text-muted-foreground">SYS-2026-0001 備品購入</p>
        </ApplicationDialog>
      </>
    );
  },
};

/**
 * フッターを自前で組む例（`footer`）。
 *
 * 「下書き保存」のように 3 つ目の操作が必要な場合に使う。
 * ただしボタンが増えるほど判断が難しくなるため、2 つで済むか先に検討する。
 */
export const CustomFooter: Story = {
  render: (args) => {
    const [open, setOpen] = React.useState(false);
    return (
      <>
        <ApplicationButton variant="secondary" onClick={() => setOpen(true)}>
          カスタムフッター
        </ApplicationButton>
        <ApplicationDialog
          {...args}
          open={open}
          onOpenChange={setOpen}
          title="申請の作成"
          description={undefined}
          footer={
            <div className="flex w-full items-center justify-between gap-2">
              <ApplicationButton variant="ghost" onClick={() => setOpen(false)}>
                下書き保存
              </ApplicationButton>
              <div className="flex gap-2">
                <ApplicationButton variant="secondary" onClick={() => setOpen(false)}>
                  キャンセル
                </ApplicationButton>
                <ApplicationButton variant="primary" onClick={() => setOpen(false)}>
                  申請する
                </ApplicationButton>
              </div>
            </div>
          }
        >
          <ApplicationFormField label="件名" required>
            <ApplicationInput placeholder="例: 備品購入の申請" />
          </ApplicationFormField>
        </ApplicationDialog>
      </>
    );
  },
};

/** 最大幅の比較。内容量に合わせて選ぶ（既定は `lg`）。 */
export const MaxWidths: Story = {
  render: (args) => {
    const [width, setWidth] = React.useState<"sm" | "md" | "lg" | "xl" | "2xl" | null>(null);
    const WIDTHS = ["sm", "md", "lg", "xl", "2xl"] as const;

    return (
      <>
        <div className="flex flex-wrap gap-2">
          {WIDTHS.map((w) => (
            <ApplicationButton key={w} variant="secondary" size="sm" onClick={() => setWidth(w)}>
              maxWidth=&quot;{w}&quot;
            </ApplicationButton>
          ))}
        </div>
        <ApplicationDialog
          {...args}
          open={width !== null}
          onOpenChange={(next) => !next && setWidth(null)}
          title={`maxWidth="${width}"`}
          description="内容量に合わせて選びます。"
          cancelText="閉じる"
          maxWidth={width ?? "lg"}
        >
          <p className="text-sm text-muted-foreground">
            大きくすれば読みやすくなるわけではありません。1 行が長すぎると視線が戻れなくなります。
          </p>
        </ApplicationDialog>
      </>
    );
  },
};
