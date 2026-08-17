import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";
import { HamiriloButton, HamiriloCard, HamiriloToast } from "../../components/hamirilo";

/**
 * HamiriloToast は操作結果を一時的に知らせる通知。
 *
 * <important>
 * コンポーネントではなく**関数として呼ぶ**。JSX に置くものではない。
 * `HamiriloToast.success('保存しました')` のように呼び出すだけでよい。
 * 表示先の `<HamiriloToaster />` は base.html に 1 つだけマウントされている。
 * </important>
 */
const meta = {
  title: "Components/HamiriloToast",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
## 目的

「保存しました」「削除に失敗しました」のような**操作結果の通知**を 1 箇所に集約する。
React / 素の JS / server-rendered application messages のどの経路から呼んでも、同じトーストに出る。

| 呼び出し元 | 書き方 |
|---|---|
| React application | \`import { HamiriloToast } from '../../components/hamirilo'\` → \`HamiriloToast.success('保存しました')\` |
| application JavaScript / server-rendering / 素の JS | \`window.HamiriloToast.success('保存しました')\` |
| 既存コード（後方互換） | \`window.showToast('保存しました', 'success')\` → 内部で HamiriloToast に転送される |
| server-rendered application View | \`messages.success(request, '保存しました')\` → 次のページ読み込み時に自動でトースト表示 |

## 使う場面

- 保存・削除・送信の**完了**を伝える
- 通信エラーなど、画面を止めずに伝えたい失敗
- 「クリップボードにコピーしました」のような軽い確認

## 使わない場面

| 場面 | 代わりに使うもの |
|---|---|
| \`alert()\` を使いたくなった場面 | **常にこちら。** \`alert()\` は使用禁止 |
| 操作の確認（実行前の問い） | \`HamiriloConfirmDialog\`。トーストは「報告」であり「問い」ではない |
| 入力項目のバリデーションエラー | \`HamiriloFormField\` の \`error\`。**該当の入力欄の近くに出す**。トーストは消えるので、直すべき場所が分からなくなる |
| 必ず読ませたい重要な情報 | ページ内のアラート領域か \`HamiriloDialog\`。トーストは数秒で消える |
| 常に表示しておきたい状態（下書き保存済み等） | 画面内のラベルやバッジ |
| 画面遷移を伴う保存 | server-rendered application の \`messages\` に載せる。遷移でトーストが消えてしまう |

## API

\`\`\`ts
HamiriloToast.success(title, description?, duration?)
HamiriloToast.error(title, description?, duration?)
HamiriloToast.warning(title, description?, duration?)
HamiriloToast.info(title, description?, duration?)
HamiriloToast.show({ title, description, type, duration })
\`\`\`

| 引数 | 説明 |
|---|---|
| \`title\` | 1 行目。**結果を一言で。**（例: 「保存しました」） |
| \`description\` | 2 行目。補足や原因（例: 「ネットワークに接続できませんでした」） |
| \`duration\` | 表示時間（ms）。既定 \`5000\` |

種類の使い分け:

| メソッド | 色 | 使う場面 |
|---|---|---|
| \`success\` | 緑 | 完了した |
| \`error\` | 赤 | 失敗した。**原因を \`description\` に書く** |
| \`warning\` | 橙 | 完了したが注意点がある（一部スキップした等） |
| \`info\` | 青 | 状態の通知（「バックグラウンドで処理中です」） |

## 注意事項

- **\`title\` は体言止めより「〜しました」。** 何が起きたのかが分かる文にする
- **エラーは \`description\` に原因を書く。** 「失敗しました」だけでは次の行動が決まらない
- **成功トーストを連発しない。** 一括処理は「3 件を削除しました」と 1 回にまとめる
- \`duration\` を短くしすぎない。読み終わる前に消える（既定の 5 秒を基準にする）
- **画面遷移を伴う操作では使えない。** 遷移でトーストごと消えるため、
  server-rendered application 側の \`messages\` に載せて遷移先で表示させる
- \`title\` / \`description\` はプレーンな文字列を渡す。アイコンは種類から自動で付く
- \`window.HamiriloToast\` を使うには \`registerGlobalDxToast()\` が実行済みである必要がある
  （テンプレート版のブートストラップで実行済み）
        `,
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 4 種類のトースト。
 *
 * ボタンを押すと右下に表示され、5 秒で消える。
 */
export const AllTypes: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <HamiriloButton variant="success" onClick={() => HamiriloToast.success("保存しました")}>
        success
      </HamiriloButton>
      <HamiriloButton
        variant="danger"
        onClick={() =>
          HamiriloToast.error("保存に失敗しました", "ネットワークに接続できませんでした。")
        }
      >
        error
      </HamiriloButton>
      <HamiriloButton
        variant="secondary"
        onClick={() =>
          HamiriloToast.warning(
            "一部を保存しました",
            "3 件のうち 1 件は権限がないためスキップしました。",
          )
        }
      >
        warning
      </HamiriloButton>
      <HamiriloButton variant="primary" onClick={() => HamiriloToast.info("処理を開始しました")}>
        info
      </HamiriloButton>
    </div>
  ),
};

/**
 * 良い通知と悪い通知の比較。
 *
 * エラーは**原因を `description` に書く**。
 * 「失敗しました」だけでは、利用者は再試行すべきか問い合わせるべきか判断できない。
 */
export const GoodAndBad: Story = {
  render: () => (
    <div className="grid max-w-3xl grid-cols-1 gap-4 md:grid-cols-2">
      <HamiriloCard title="✓ 良い例">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">何が起きたか・なぜ失敗したかが分かる。</p>
          <div className="flex flex-col gap-2">
            <HamiriloButton
              variant="secondary"
              size="sm"
              onClick={() =>
                HamiriloToast.success("申請を送信しました", "承認者に通知が送られました。")
              }
            >
              申請を送信しました
            </HamiriloButton>
            <HamiriloButton
              variant="secondary"
              size="sm"
              onClick={() =>
                HamiriloToast.error(
                  "削除できませんでした",
                  "この申請は承認済みのため削除できません。取り消しを依頼してください。",
                )
              }
            >
              削除できませんでした（原因あり）
            </HamiriloButton>
          </div>
        </div>
      </HamiriloCard>

      <HamiriloCard title="✗ 悪い例">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            結果は分かるが、次に何をすればよいか分からない。
          </p>
          <div className="flex flex-col gap-2">
            <HamiriloButton
              variant="secondary"
              size="sm"
              onClick={() => HamiriloToast.success("OK")}
            >
              「OK」
            </HamiriloButton>
            <HamiriloButton
              variant="secondary"
              size="sm"
              onClick={() => HamiriloToast.error("エラー")}
            >
              「エラー」
            </HamiriloButton>
          </div>
        </div>
      </HamiriloCard>
    </div>
  ),
};

/**
 * 一括処理の通知。
 *
 * **1 件ごとに出さず、結果をまとめて 1 回**にする。
 * 4 件削除して 4 つトーストが積み上がると、画面が埋まって読めなくなる。
 */
export const BulkResult: Story = {
  render: () => {
    const NAMES = ["SYS-2026-0001", "SYS-2026-0002", "SYS-2026-0003", "SYS-2026-0004"];

    return (
      <div className="max-w-2xl space-y-4">
        <HamiriloCard title="✓ まとめて 1 回">
          <HamiriloButton
            variant="danger"
            size="sm"
            onClick={() => HamiriloToast.success(`${NAMES.length} 件を削除しました`)}
          >
            4 件を削除（トースト 1 つ）
          </HamiriloButton>
        </HamiriloCard>

        <HamiriloCard title="✗ 1 件ごとに通知">
          <HamiriloButton
            variant="secondary"
            size="sm"
            onClick={() => NAMES.forEach((n) => HamiriloToast.success(`${n} を削除しました`))}
          >
            4 件を削除（トースト 4 つ）
          </HamiriloButton>
        </HamiriloCard>

        <HamiriloCard title="△ 部分的に失敗した場合は warning">
          <HamiriloButton
            variant="secondary"
            size="sm"
            onClick={() =>
              HamiriloToast.warning(
                "3 件を削除しました",
                "1 件（SYS-2026-0004）は承認済みのためスキップしました。",
              )
            }
          >
            3 件成功 / 1 件スキップ
          </HamiriloButton>
        </HamiriloCard>
      </div>
    );
  },
};

/**
 * 非同期処理と組み合わせる典型例。
 *
 * 送信 → 成功なら `success`、失敗なら原因付きで `error`。
 * ボタン自身は `loading` にして二重送信を防ぐ。
 */
export const WithAsyncAction: Story = {
  render: () => {
    const [loading, setLoading] = React.useState(false);

    const save = async (shouldFail: boolean) => {
      setLoading(true);
      try {
        await new Promise((resolve) => window.setTimeout(resolve, 1200));
        if (shouldFail) throw new Error("サーバーが応答しませんでした。");
        HamiriloToast.success("保存しました");
      } catch (error) {
        HamiriloToast.error(
          "保存に失敗しました",
          error instanceof Error ? error.message : "原因が不明です。",
        );
      } finally {
        setLoading(false);
      }
    };

    return (
      <div className="flex flex-wrap gap-2">
        <HamiriloButton variant="primary" loading={loading} onClick={() => save(false)}>
          保存する（成功）
        </HamiriloButton>
        <HamiriloButton variant="secondary" loading={loading} onClick={() => save(true)}>
          保存する（失敗）
        </HamiriloButton>
      </div>
    );
  },
};

/**
 * 表示時間の調整（`duration`）。
 *
 * 既定は 5000ms。**短くしすぎると読み終わる前に消える。**
 * 説明文が長い通知はむしろ長めにする。
 */
export const Duration: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <HamiriloButton
        variant="secondary"
        size="sm"
        onClick={() => HamiriloToast.info("1 秒で消えます（短すぎる例）", undefined, 1000)}
      >
        duration=1000
      </HamiriloButton>
      <HamiriloButton
        variant="secondary"
        size="sm"
        onClick={() => HamiriloToast.info("5 秒で消えます（既定）")}
      >
        duration=5000（既定）
      </HamiriloButton>
      <HamiriloButton
        variant="secondary"
        size="sm"
        onClick={() =>
          HamiriloToast.warning(
            "説明が長い通知",
            "一括処理のうち 2 件が権限不足でスキップされました。対象は管理者に確認してください。",
            10000,
          )
        }
      >
        duration=10000
      </HamiriloButton>
    </div>
  ),
};

/**
 * `HamiriloToast.show()` によるカスタム呼び出し。
 *
 * `type` を変数で切り替えたい場合に使う
 * （API のレスポンスに応じて種類を決める等）。
 */
export const ShowApi: Story = {
  render: () => {
    const TYPES = ["success", "error", "warning", "info"] as const;
    const [type, setType] = React.useState<(typeof TYPES)[number]>("info");

    return (
      <div className="max-w-md space-y-3">
        <div className="flex flex-wrap gap-2">
          {TYPES.map((t) => (
            <HamiriloButton
              key={t}
              variant={type === t ? "primary" : "secondary"}
              size="sm"
              onClick={() => setType(t)}
            >
              {t}
            </HamiriloButton>
          ))}
        </div>
        <HamiriloButton
          variant="primary"
          onClick={() =>
            HamiriloToast.show({
              type,
              title: `type="${type}" のトースト`,
              description: "HamiriloToast.show() で種類を動的に指定した例です。",
            })
          }
        >
          show() で表示
        </HamiriloButton>
      </div>
    );
  },
};

/**
 * バリデーションエラーにトーストを使わない理由。
 *
 * トーストは数秒で消え、**どの項目が悪いのかを指し示せない**。
 * 入力エラーは必ず `HamiriloFormField` の `error` で該当欄の下に出す。
 */
export const NotForValidation: Story = {
  render: () => (
    <div className="max-w-2xl space-y-4">
      <HamiriloCard title="✗ トーストでバリデーションエラーを伝える">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            消えた後、どの項目を直せばよいか分からない。
          </p>
          <HamiriloButton
            variant="secondary"
            size="sm"
            onClick={() => HamiriloToast.error("入力内容にエラーがあります")}
          >
            この使い方はしない
          </HamiriloButton>
        </div>
      </HamiriloCard>

      <HamiriloCard title="✓ 入力欄の下に出す">
        <p className="text-sm text-muted-foreground">
          <code className="text-xs">
            &lt;HamiriloFormField error=&quot;金額を入力してください&quot;&gt;
          </code>
          <br />
          Components/HamiriloFormField の <strong>WithError</strong> を参照。
        </p>
      </HamiriloCard>
    </div>
  ),
};
