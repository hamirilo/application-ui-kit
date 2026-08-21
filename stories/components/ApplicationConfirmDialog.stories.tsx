import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";
import { ApplicationButton, ApplicationConfirmDialog } from "../../components/application";

/**
 * ApplicationConfirmDialog は「実行してよいか」を尋ねる確認ダイアログ。
 *
 * <important>
 * `confirm()` は使用禁止。確認が必要な操作は必ずこのコンポーネントを使う。
 * ローディングとエラー表示はコンポーネント内部で完結するため、
 * 呼び出し側は `onConfirm` に非同期関数を渡すだけでよい。
 * </important>
 */
const meta = {
  title: "Components/ApplicationConfirmDialog",
  component: ApplicationConfirmDialog,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
## 目的

「本当に実行しますか？」の確認を統一する。
**非同期処理の状態管理をコンポーネント側に閉じ込めている**のが最大の特徴で、
呼び出し側に \`loading\` / \`error\` の \`useState\` を書かせない。

\`onConfirm\` が Promise を返した場合の挙動:

| 結果 | 挙動 |
|---|---|
| 実行中 | 自動でローディング表示・ボタン無効化・**閉じる操作を全て無効化** |
| resolve | 自動でダイアログを閉じる |
| reject | **閉じずに**ダイアログ内へエラーメッセージを表示（\`Error.message\` をそのまま出す） |

## 使う場面

- 削除・アーカイブ・公開・一括処理など、取り消しにくい操作の直前
- 副作用が大きい操作（メール送信、外部連携の実行）

## 使わない場面

| 場面 | 代わりに使うもの |
|---|---|
| \`confirm()\` を使いたくなった場面 | **常にこちら。** \`confirm()\` は禁止（文言も見た目も制御できない） |
| 入力を伴う確認（理由を書かせる等） | \`ApplicationFormDialog\` |
| 元に戻せる操作（並び替え、下書き保存） | 確認しない。実行して \`ApplicationToast\` で伝える |
| 操作の結果を知らせるだけ | \`ApplicationToast\`。確認ダイアログは「問い」であり「報告」ではない |
| テンプレート（.html） |サーバーレンダリングの確認 partial か、各プロジェクトのモーダル。React コンポーネントを新設しない |
| 同じ操作を連続で行う画面（一覧の各行を次々消す） | 確認が邪魔になる。まとめて選択 → 1 回確認に設計を変える |

## Props

| Prop | 説明 |
|---|---|
| \`open\` / \`onOpenChange\` | 開閉状態（必ず制御する） |
| \`title\` | 見出し（例: 「削除確認」） |
| \`message\` | 問いの本文（例: 「このタスクを削除してもよろしいですか？」） |
| \`detail\` | 補足（例: 「削除すると元に戻せません。」） |
| \`type\` | \`info\`（既定） / \`warning\` / \`danger\` / \`success\`。アイコン・色・確定ボタンの variant が連動する |
| \`confirmText\` | 確定ボタン（既定 \`OK\`）。**動詞にする**（「削除」「公開」） |
| \`cancelText\` | キャンセルボタン（既定 \`キャンセル\`） |
| \`onConfirm\` | 確定時の処理。**Promise を返すと状態管理が自動になる** |
| \`onCancel\` | 省略時は単に閉じる |

\`type\` と見た目の対応:

| type | アイコン | 確定ボタン | 用途 |
|---|---|---|---|
| \`info\` | Info（青） | primary | 通常の確認 |
| \`warning\` | AlertTriangle（橙） | primary | アーカイブ、取り消しに手間がかかる操作 |
| \`danger\` | AlertTriangle（赤） | danger | 削除、元に戻せない操作 |
| \`success\` | CheckCircle（緑） | success | 公開、承認、確定 |

## 注意事項

- **\`confirmText\` を既定の「OK」のままにしない。**
  「削除」「公開」のように動詞を入れる。何が起きるかがボタンだけで分かる状態にする
- **\`onConfirm\` でエラーを握り潰さない。** \`throw\` すればダイアログ内に表示される。
  \`try/catch\` して \`console.error\` だけにすると、利用者には「押しても何も起きない」ように見える
- \`message\` は疑問文、\`detail\` は結果の説明に分ける。1 文に詰め込まない
- 処理中は \`Esc\`・背景クリック・× が全て無効になる（二重実行の防止）
- \`maxWidth\` は \`md\` に固定されている（確認文は短いのが前提）
- **このコンポーネントはダークモード未対応。**
  \`text-gray-900\` / \`bg-red-50\` などを直書きしているため、
  \`.dark\` では文字が読めなくなる。ダークモード対応は別タスク（[the theme guidance] 参照）
        `,
      },
    },
  },
  argTypes: {
    open: { table: { disable: true } },
    onOpenChange: { table: { disable: true } },
    onConfirm: { table: { disable: true } },
    onCancel: { table: { disable: true } },
    title: { control: "text" },
    message: { control: "text" },
    detail: { control: "text" },
    type: { control: "inline-radio", options: ["info", "warning", "danger", "success"] },
    confirmText: { control: "text" },
    cancelText: { control: "text" },
  },
  args: {
    open: false,
    onOpenChange: () => {},
    onConfirm: () => {},
    title: "削除確認",
    message: "この申請を削除してもよろしいですか？",
    detail: "削除すると元に戻せません。",
    type: "danger",
    confirmText: "削除",
  },
} satisfies Meta<typeof ApplicationConfirmDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

/** ボタンから開く基本形。`type` を Controls で切り替えて見た目を比較できる。 */
export const Default: Story = {
  render: (args) => {
    const [open, setOpen] = React.useState(false);
    return (
      <>
        <ApplicationButton variant="danger" onClick={() => setOpen(true)}>
          削除
        </ApplicationButton>
        <ApplicationConfirmDialog
          {...args}
          open={open}
          onOpenChange={setOpen}
          onConfirm={() => setOpen(false)}
        />
      </>
    );
  },
};

/**
 * 削除確認（`type="danger"`）。
 *
 * 赤いアイコンと `variant="danger"` の確定ボタンになる。
 * `confirmText` は「OK」ではなく**動詞**にする。
 */
export const Danger: Story = {
  render: (args) => {
    const [open, setOpen] = React.useState(false);
    return (
      <>
        <ApplicationButton variant="danger" onClick={() => setOpen(true)}>
          この申請を削除
        </ApplicationButton>
        <ApplicationConfirmDialog
          {...args}
          open={open}
          onOpenChange={setOpen}
          type="danger"
          title="削除確認"
          message="申請「備品購入（モニター 2 台）」を削除しますか？"
          detail="削除すると元に戻せません。添付ファイルも一緒に削除されます。"
          confirmText="削除"
          onConfirm={() => setOpen(false)}
        />
      </>
    );
  },
};

/** アーカイブなど、取り消しに手間がかかる操作（`type="warning"`）。 */
export const Warning: Story = {
  render: (args) => {
    const [open, setOpen] = React.useState(false);
    return (
      <>
        <ApplicationButton variant="secondary" onClick={() => setOpen(true)}>
          アーカイブ
        </ApplicationButton>
        <ApplicationConfirmDialog
          {...args}
          open={open}
          onOpenChange={setOpen}
          type="warning"
          title="アーカイブ確認"
          message="この申請をアーカイブしますか？"
          detail="一覧には表示されなくなりますが、検索すれば見つかります。"
          confirmText="アーカイブ"
          onConfirm={() => setOpen(false)}
        />
      </>
    );
  },
};

/** 公開・承認など前向きな確定（`type="success"`）。 */
export const Success: Story = {
  render: (args) => {
    const [open, setOpen] = React.useState(false);
    return (
      <>
        <ApplicationButton variant="success" onClick={() => setOpen(true)}>
          承認
        </ApplicationButton>
        <ApplicationConfirmDialog
          {...args}
          open={open}
          onOpenChange={setOpen}
          type="success"
          title="承認確認"
          message="この申請を承認しますか？"
          detail="承認すると申請者に通知が送られます。"
          confirmText="承認"
          onConfirm={() => setOpen(false)}
        />
      </>
    );
  },
};

/** 通常の確認（`type="info"`・既定値）。 */
export const Info: Story = {
  render: (args) => {
    const [open, setOpen] = React.useState(false);
    return (
      <>
        <ApplicationButton variant="primary" onClick={() => setOpen(true)}>
          再送信
        </ApplicationButton>
        <ApplicationConfirmDialog
          {...args}
          open={open}
          onOpenChange={setOpen}
          type="info"
          title="通知の再送信"
          message="承認者へ通知を再送信しますか？"
          detail={undefined}
          confirmText="再送信"
          onConfirm={() => setOpen(false)}
        />
      </>
    );
  },
};

/**
 * 非同期処理が成功する場合。
 *
 * `onConfirm` が Promise を返すと、**解決するまで自動でローディング**になり、
 * 解決したら自動で閉じる。呼び出し側に `loading` の state は不要。
 * 2 秒後に閉じる。
 */
export const AsyncSuccess: Story = {
  render: (args) => {
    const [open, setOpen] = React.useState(false);
    const [deleted, setDeleted] = React.useState(false);

    return (
      <div className="space-y-3">
        <ApplicationButton variant="danger" onClick={() => setOpen(true)} disabled={deleted}>
          {deleted ? "削除済み" : "削除（2 秒かかる）"}
        </ApplicationButton>
        {deleted && (
          <p className="text-sm text-muted-foreground">
            削除が完了し、ダイアログは自動で閉じました。
          </p>
        )}
        <ApplicationConfirmDialog
          {...args}
          open={open}
          onOpenChange={setOpen}
          onConfirm={async () => {
            await new Promise((resolve) => window.setTimeout(resolve, 2000));
            setDeleted(true);
          }}
        />
      </div>
    );
  },
};

/**
 * 非同期処理が失敗する場合。
 *
 * `onConfirm` が `throw` すると **ダイアログは閉じず**、
 * `Error.message` がダイアログ内に赤字で表示される。
 * 利用者はそのまま再試行できる。
 *
 * <important>
 * `onConfirm` の中でエラーを握り潰さないこと。`catch` して `console.error` だけにすると、
 * 「押しても何も起きない」画面になる。
 * </important>
 */
export const AsyncError: Story = {
  render: (args) => {
    const [open, setOpen] = React.useState(false);
    return (
      <>
        <ApplicationButton variant="danger" onClick={() => setOpen(true)}>
          削除（必ず失敗する）
        </ApplicationButton>
        <ApplicationConfirmDialog
          {...args}
          open={open}
          onOpenChange={setOpen}
          onConfirm={async () => {
            await new Promise((resolve) => window.setTimeout(resolve, 1200));
            throw new Error("削除に失敗しました。この申請は承認済みのため削除できません。");
          }}
        />
      </>
    );
  },
};

/**
 * `detail` なしの最小構成。
 *
 * 補足すべきことが無いなら書かない。
 * 「よろしいですか？」の下に意味のない一文を足さない。
 */
export const MessageOnly: Story = {
  render: (args) => {
    const [open, setOpen] = React.useState(false);
    return (
      <>
        <ApplicationButton variant="secondary" onClick={() => setOpen(true)}>
          下書きを破棄
        </ApplicationButton>
        <ApplicationConfirmDialog
          {...args}
          open={open}
          onOpenChange={setOpen}
          type="warning"
          title="下書きの破棄"
          message="入力中の内容を破棄しますか？"
          detail={undefined}
          confirmText="破棄"
          onConfirm={() => setOpen(false)}
        />
      </>
    );
  },
};

/** 4 つの `type` を並べて比較する。 */
export const AllTypes: Story = {
  render: (args) => {
    const TYPES = [
      { type: "info", label: "info", title: "確認", message: "実行しますか？", text: "実行" },
      {
        type: "warning",
        label: "warning",
        title: "アーカイブ確認",
        message: "アーカイブしますか？",
        text: "アーカイブ",
      },
      {
        type: "danger",
        label: "danger",
        title: "削除確認",
        message: "削除しますか？",
        text: "削除",
      },
      {
        type: "success",
        label: "success",
        title: "公開確認",
        message: "公開しますか？",
        text: "公開",
      },
    ] as const;

    const [openType, setOpenType] = React.useState<(typeof TYPES)[number] | null>(null);

    return (
      <>
        <div className="flex flex-wrap gap-2">
          {TYPES.map((t) => (
            <ApplicationButton
              key={t.type}
              variant="secondary"
              size="sm"
              onClick={() => setOpenType(t)}
            >
              type=&quot;{t.label}&quot;
            </ApplicationButton>
          ))}
        </div>
        {openType && (
          <ApplicationConfirmDialog
            {...args}
            open
            onOpenChange={(next) => !next && setOpenType(null)}
            type={openType.type}
            title={openType.title}
            message={openType.message}
            detail="type によってアイコン・色・確定ボタンの variant が連動します。"
            confirmText={openType.text}
            onConfirm={() => setOpenType(null)}
          />
        )}
      </>
    );
  },
};
