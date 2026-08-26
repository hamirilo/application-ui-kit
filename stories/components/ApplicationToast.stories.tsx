import type { Meta, StoryObj } from "@storybook/react-vite";
import { ApplicationButton, ApplicationToast, ApplicationToaster } from "../../components/application";
import { Cluster, Section, Showcase } from "../_showcase";

/**
 * ApplicationToast は「操作の結果」を短く伝える通知。
 *
 * <important>
 * `ApplicationToaster` はアプリのルートに **1 つだけ** マウントする。
 * 2 つマウントすると同じトーストが 2 回描画される（表示器は同じマネージャを購読する）。
 * この Storybook では `.storybook/preview.tsx` の decorator が 1 つマウントしているため、
 * 各 Story では置かない。
 * </important>
 */
const meta = {
  title: "Overlays/ApplicationToast",
  component: ApplicationToaster,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
## 目的

保存・削除・送信の結果を、画面遷移させずに短く伝える。
命令型 API に一本化することで、通知の見た目と表示位置を画面ごとにばらつかせない。

\`\`\`tsx
ApplicationToast.success('保存しました')
ApplicationToast.error('保存に失敗しました', 'ネットワークエラーです')
\`\`\`

## 使う場面

- 保存・削除・送信が成功した / 失敗した
- 非同期処理の完了通知（ユーザーの操作を止めなくてよいもの）

## 使わない場面

| 場面 | 代わりに使うもの |
|---|---|
| 入力内容の検証エラー | \`ApplicationFormField\` の \`error\`。どの項目が悪いか伝わらないため |
| 操作の確認（本当に削除しますか） | \`ApplicationConfirmDialog\` |
| 常に見えている必要がある情報 | 画面内のアラート領域。トーストは自動で消える |
| 長文・複数行の説明 | ダイアログか画面内の表示。トーストは 2 行程度が限界 |

## 注意事項

- **\`ApplicationToaster\` はルートに 1 つだけ**。複数置くと二重に描画される
- title は結果を短く書く（「保存しました」）。原因や次の操作は description に置く
- **エラーは自動で消して終わりにしない**。再試行が必要な場合は画面内にも状態を残す
- \`title\` / \`description\` にはプレーンな文字列を渡す（要素を渡すと読み上げが崩れる）
        `,
      },
    },
  },
} satisfies Meta<typeof ApplicationToaster>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 4 種類の type を 1 画面で比較する。
 *
 * アイコンと色は type から自動で決まる。呼び出し側で見た目を指定しない。
 */
export const Overview: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Showcase>
      <Section title="Types" note="ボタンを押すとトーストが出る。色とアイコンは type から決まる。">
        <Cluster>
          <ApplicationButton
            variant="secondary"
            onClick={() => ApplicationToast.success("保存しました")}
          >
            success
          </ApplicationButton>
          <ApplicationButton
            variant="secondary"
            onClick={() => ApplicationToast.error("保存に失敗しました")}
          >
            error
          </ApplicationButton>
          <ApplicationButton
            variant="secondary"
            onClick={() => ApplicationToast.warning("下書きのまま保存しました")}
          >
            warning
          </ApplicationButton>
          <ApplicationButton
            variant="secondary"
            onClick={() => ApplicationToast.info("新しい申請が 1 件あります")}
          >
            info
          </ApplicationButton>
        </Cluster>
      </Section>

      <Section title="With Description" note="原因や次の操作は description に置く。title は結果だけ。">
        <Cluster>
          <ApplicationButton
            variant="secondary"
            onClick={() =>
              ApplicationToast.error("保存に失敗しました", "ネットワークエラーです。再試行してください")
            }
          >
            title + description
          </ApplicationButton>
        </Cluster>
      </Section>

      <Section title="Duration" note="既定は 5 秒。読み切れない長さの通知はトーストに向かない。">
        <Cluster>
          <ApplicationButton
            variant="secondary"
            onClick={() => ApplicationToast.info("2 秒で消えます", undefined, 2000)}
          >
            duration=2000
          </ApplicationButton>
          <ApplicationButton
            variant="secondary"
            onClick={() => ApplicationToast.info("10 秒で消えます", undefined, 10000)}
          >
            duration=10000
          </ApplicationButton>
        </Cluster>
      </Section>
    </Showcase>
  ),
};

/** 保存・送信の成功。最もよく使う。 */
export const Success: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <ApplicationButton onClick={() => ApplicationToast.success("保存しました")}>
      保存
    </ApplicationButton>
  ),
};

/** 失敗。原因と次の操作を description に書く。 */
export const Error: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <ApplicationButton
      onClick={() =>
        ApplicationToast.error("保存に失敗しました", "ネットワークエラーです。再試行してください")
      }
    >
      保存（失敗する）
    </ApplicationButton>
  ),
};

/** 処理は通ったが注意が必要な場合。 */
export const Warning: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <ApplicationButton
      onClick={() =>
        ApplicationToast.warning("下書きのまま保存しました", "提出するには「申請」を押してください")
      }
    >
      下書き保存
    </ApplicationButton>
  ),
};

/** 操作の結果ではないお知らせ。多用しない。 */
export const Info: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <ApplicationButton onClick={() => ApplicationToast.info("新しい申請が 1 件あります")}>
      更新
    </ApplicationButton>
  ),
};

/**
 * 複数のトーストを重ねた場合。
 *
 * 同じ操作で 2 件以上出すと、利用者はどれが結果なのか判断できない。
 * 1 操作 1 トーストに収める。
 */
export const Stacked: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <ApplicationButton
      variant="secondary"
      onClick={() => {
        ApplicationToast.success("1 件目を保存しました");
        ApplicationToast.success("2 件目を保存しました");
        ApplicationToast.error("3 件目は失敗しました");
      }}
    >
      3 件まとめて出す
    </ApplicationButton>
  ),
};

/**
 * **やってはいけない例**: 入力検証のエラーをトーストで出す。
 *
 * どの項目が悪いのか伝わらず、トーストが消えると情報が残らない。
 * 検証エラーは `ApplicationFormField` の `error` で該当項目に出す
 * （Patterns/Form の `ValidationError` を参照）。
 */
export const NotForValidation: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="space-y-3">
      <p className="text-sm text-danger">
        ✗ これは悪い例。検証エラーは該当項目の下に出す。
      </p>
      <ApplicationButton
        variant="secondary"
        onClick={() => ApplicationToast.error("入力内容を確認してください")}
      >
        検証エラーをトーストで出す（悪い例）
      </ApplicationButton>
    </div>
  ),
};
