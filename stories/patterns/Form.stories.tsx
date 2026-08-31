import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";
import type { DateRange } from "react-day-picker";
import {
  ApplicationButton,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  ApplicationCheckbox,
  ApplicationDatePicker,
  ApplicationFormField,
  ApplicationInput,
  ApplicationSelect,
  ApplicationToast,
} from "../../components/application";

/**
 * 入力フォーム画面の組み立て方。
 *
 * <important>
 * これは「部品の使い方」ではなく **画面の組み立て方** の見本。
 * 新しいフォーム画面を作るときは、まずこの構造をコピーしてから中身を差し替える。
 * </important>
 */
const meta = {
  title: "Patterns/Form",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
## 目的

フォーム画面ごとに変わりやすい以下を固定する。

| 決めごと | ルール |
|---|---|
| 縦の間隔 | 各項目に \`mb-*\` を付けず、**親に \`space-y-4\`** |
| セクション分け | \`Card\` の \`title\` で区切る。項目が 6 個を超えたら分ける |
| 必須表示 | \`ApplicationFormField required\`（\`*\` + \`（必須）\`）。「任意」は \`helpText\` に書く |
| ボタンの位置 | 最下部・右寄せ。**キャンセルが左、主アクションが右** |
| ボタンの区切り | \`border-t border-border pt-4\` |
| エラー | 全体は先頭のアラート、項目単位は \`ApplicationFormField error\` |
| 幅 | 1 カラムは \`max-w-2xl\` 程度。**画面幅いっぱいに伸ばさない**（1 行が長いと読み返せない） |
| 送信中 | ボタンを \`loading\`、フォーム全体を \`<fieldset disabled>\` |

## 使う場面

- 新規作成 / 編集の画面（React コンポーネントでフォーム全体を持つ場合）
- 設定画面

## 使わない場面

| 場面 | 代わりに使うもの |
|---|---|
| テンプレート（.html）のフォーム | \`{% include 'includes/molecules/form_field.html' %}\` + \`form-validation.js\`。Foundations を参照 |
| 項目が 3 個以下の入力 | \`ApplicationFormDialog\` でモーダルにする。画面遷移させるほどの内容ではない |
| 入力項目が 20 個を超える | ステップ分割（ウィザード）を検討する。1 画面に詰め込まない |
| 一覧の中のインライン編集 | セル内に \`ApplicationInput\` を直接置く。\`ApplicationFormField\` は使わない（ラベルが二重になる） |

## 注意事項

- **フォーム全体を \`<form>\` で包み \`type="submit"\` を使う。**
  \`onClick\` で送信すると Enter キーで送信できず、ブラウザの入力補完も効かない
- **エラーは送信後に消さない。** 直すべき箇所が分からなくなる。
  該当項目を再入力したときにその項目のエラーだけ消す
- **バリデーションエラーをトーストで出さない。** どの項目が悪いか伝わらない
  （Components/ApplicationToast の \`NotForValidation\` を参照）
- 送信中は \`<fieldset disabled>\` で囲む。ボタンを無効化するだけでは
  入力が編集され続けてしまう
- \`autoComplete\` を適切に設定する（\`name\` / \`email\` / \`tel\` 等）。
  補完が効かないフォームは入力ミスが増える
- **電話番号・郵便番号・社員番号に \`type="number"\` を使わない。**
  \`type="text"\` + \`inputMode="numeric"\` を使う（先頭 0 が消える／スピナーが出る）
        
詳しい判断軸と、他の選択肢との比較は \`patterns/form-layout.md\` を参照してください。
`,
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const PRIORITY_ITEMS = [
  { value: "high", label: "高" },
  { value: "mid", label: "中" },
  { value: "low", label: "低" },
];

const DEPARTMENT_ITEMS = [
  { value: "sales", label: "営業部", group: "本社" },
  { value: "admin", label: "総務部", group: "本社" },
  { value: "dev", label: "開発部", group: "本社" },
  { value: "qa", label: "品質管理課", group: "工場" },
  { value: "prod", label: "製造部", group: "工場" },
];

/**
 * 1 カラムの基本形。
 *
 * 最も多いパターン。`max-w-2xl` で幅を抑え、`space-y-4` で項目を並べ、
 * 最下部に区切り線付きのボタン列を置く。
 */
export const StandardForm: Story = {
  render: () => (
    <form className="max-w-2xl space-y-4">
      <ApplicationFormField label="件名" required helpText="50 文字以内で入力してください">
        <ApplicationInput name="title" placeholder="例: 備品購入の申請" autoComplete="off" required />
      </ApplicationFormField>

      <ApplicationFormField label="申請部署" required>
        <ApplicationSelect
          name="department"
          items={DEPARTMENT_ITEMS}
          placeholder="部署を選択"
          required
        />
      </ApplicationFormField>

      <ApplicationFormField label="優先度" required helpText="後から変更できます">
        <ApplicationSelect name="priority" items={PRIORITY_ITEMS} defaultValue="mid" />
      </ApplicationFormField>

      <ApplicationFormField label="金額" required helpText="税込で入力してください">
        <ApplicationInput name="amount" type="number" min={0} placeholder="0" required />
      </ApplicationFormField>

      <ApplicationFormField label="備考" helpText="任意">
        <textarea
          name="note"
          rows={4}
          placeholder="補足があれば記入してください"
          className="w-full rounded-lg border border-input bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </ApplicationFormField>

      <div className="flex items-center justify-end gap-2 border-t border-border pt-4">
        <ApplicationButton variant="secondary" type="button">
          キャンセル
        </ApplicationButton>
        <ApplicationButton variant="primary" type="submit">
          申請する
        </ApplicationButton>
      </div>
    </form>
  ),
};

/**
 * セクションに分ける形。
 *
 * 項目が 6 個を超えたら `Card` の `CardTitle` で区切る。
 * **カードを入れ子にしない**ため、セクションは並列に置く。
 */
export const WithSections: Story = {
  render: () => (
    <form className="max-w-3xl space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>基本情報</CardTitle>
        </CardHeader>
        <CardContent>
        <div className="space-y-4">
          <ApplicationFormField label="件名" required helpText="50 文字以内">
            <ApplicationInput name="title" placeholder="例: 備品購入の申請" required />
          </ApplicationFormField>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <ApplicationFormField label="申請部署" required>
              <ApplicationSelect name="department" items={DEPARTMENT_ITEMS} placeholder="部署を選択" />
            </ApplicationFormField>
            <ApplicationFormField label="優先度" required>
              <ApplicationSelect name="priority" items={PRIORITY_ITEMS} defaultValue="mid" />
            </ApplicationFormField>
          </div>
        </div>
      </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>金額と納期</CardTitle>
        </CardHeader>
        <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <ApplicationFormField label="金額" required helpText="税込">
              <ApplicationInput name="amount" type="number" min={0} placeholder="0" required />
            </ApplicationFormField>
            <ApplicationFormField label="希望納期">
              <ApplicationInput name="due" type="date" />
            </ApplicationFormField>
          </div>
          <ApplicationFormField label="発注先">
            <ApplicationInput name="vendor" placeholder="例: 〇〇商事" />
          </ApplicationFormField>
        </div>
      </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>通知</CardTitle>
        </CardHeader>
        <CardContent>
        <div className="space-y-3">
          <ApplicationCheckbox
            name="notify_approver"
            label="承認者へメールで通知する"
            defaultChecked
          />
          <ApplicationCheckbox
            name="notify_self"
            label="自分にも控えを送る"
            description="申請内容を記載したメールが登録アドレスに届きます。"
          />
        </div>
      </CardContent>
      </Card>

      <div className="flex items-center justify-between gap-2 border-t border-border pt-4">
        <ApplicationButton variant="ghost" type="button">
          下書き保存
        </ApplicationButton>
        <div className="flex gap-2">
          <ApplicationButton variant="secondary" type="button">
            キャンセル
          </ApplicationButton>
          <ApplicationButton variant="primary" type="submit">
            申請する
          </ApplicationButton>
        </div>
      </div>
    </form>
  ),
};

/**
 * 2 カラム（主内容 + 補助情報）。
 *
 * 入力は左、状態やヘルプは右。
 * モバイルでは 1 カラムに落ち、**補助情報が入力の下に来る**
 * （`order` を使わず、DOM 順を読み順に合わせている）。
 */
export const TwoColumn: Story = {
  render: () => (
    <form className="grid max-w-5xl grid-cols-1 gap-4 lg:grid-cols-3">
      <div className="space-y-4 lg:col-span-2">
        <Card>
        <CardHeader>
          <CardTitle>申請内容</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <ApplicationFormField label="件名" required>
              <ApplicationInput name="title" defaultValue="備品購入（モニター 2 台）" required />
            </ApplicationFormField>
            <ApplicationFormField label="金額" required helpText="税込">
              <ApplicationInput name="amount" type="number" defaultValue={78000} min={0} />
            </ApplicationFormField>
            <ApplicationFormField label="理由" required>
              <textarea
                name="reason"
                rows={5}
                className="w-full rounded-lg border border-input bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring"
                defaultValue="開発チームの増員に伴い、作業用モニターが不足しているため。"
              />
            </ApplicationFormField>
          </div>
        </CardContent>
      </Card>

        <div className="flex items-center justify-end gap-2 border-t border-border pt-4">
          <ApplicationButton variant="secondary" type="button">
            キャンセル
          </ApplicationButton>
          <ApplicationButton variant="primary" type="submit">
            申請する
          </ApplicationButton>
        </div>
      </div>

      <div className="space-y-4">
        <Card className="p-3">
        <CardHeader>
          <CardTitle>ステータス</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between gap-2">
              <dt className="text-muted-foreground">申請番号</dt>
              <dd className="font-mono text-xs text-foreground">SYS-2026-0001</dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-muted-foreground">状態</dt>
              <dd>
                <span className="badge bg-yellow-50 text-yellow-600">下書き</span>
              </dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-muted-foreground">最終更新</dt>
              <dd className="text-foreground">2026-07-30 14:22</dd>
            </div>
          </dl>
        </CardContent>
      </Card>

        <Card className="p-3">
        <CardHeader>
          <CardTitle>承認フロー</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="space-y-2 text-sm text-muted-foreground">
            <li>1. 課長承認</li>
            <li>2. 部長承認（10 万円以上）</li>
            <li>3. 経理確認</li>
          </ol>
        </CardContent>
      </Card>
      </div>
    </form>
  ),
};

/**
 * エラー表示のパターン。
 *
 * 全体エラーは先頭のアラート、項目エラーは `ApplicationFormField` の `error`。
 * **両方を出す。** 全体だけでは直す場所が分からず、
 * 項目だけでは画面外の項目に気付けない。
 */
export const ValidationError: Story = {
  render: () => (
    <form className="max-w-2xl space-y-4">
      <div role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
        <p className="font-medium">入力内容に 2 件のエラーがあります。</p>
        <ul className="mt-1 list-inside list-disc">
          <li>金額: 上限額を超えています</li>
          <li>申請部署: 選択してください</li>
        </ul>
      </div>

      <ApplicationFormField label="件名" required>
        <ApplicationInput name="title" defaultValue="研修参加費" required />
      </ApplicationFormField>

      <ApplicationFormField label="申請部署" required error="申請部署を選択してください">
        <ApplicationSelect name="department" items={DEPARTMENT_ITEMS} placeholder="部署を選択" />
      </ApplicationFormField>

      <ApplicationFormField
        label="金額"
        required
        error="上限額（100,000 円）を超えています"
        helpText="税込で入力してください"
      >
        <ApplicationInput name="amount" type="number" defaultValue={120000} min={0} />
      </ApplicationFormField>

      <div className="flex items-center justify-end gap-2 border-t border-border pt-4">
        <ApplicationButton variant="secondary" type="button">
          キャンセル
        </ApplicationButton>
        <ApplicationButton variant="primary" type="submit">
          申請する
        </ApplicationButton>
      </div>
    </form>
  ),
};

/**
 * 送信までの一連の流れ。
 *
 * 送信中は `<fieldset disabled>` で**入力そのものを無効化**し、
 * ボタンは `loading` にする。結果は `ApplicationToast` で伝える。
 * 送信すると 1.5 秒後にサーバーエラーが返る（項目エラーが表示される）。
 */
export const Submitting: Story = {
  render: () => {
    const [loading, setLoading] = React.useState(false);
    const [errors, setErrors] = React.useState<Record<string, string>>({});
    const [range, setRange] = React.useState<DateRange | undefined>(undefined);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      // クライアント側の検証（range は to が未確定になり得る）
      if (!range?.from || !range?.to) {
        setErrors({ period: "開始日と終了日の両方を選択してください" });
        return;
      }

      setLoading(true);
      setErrors({});
      try {
        await new Promise((resolve) => window.setTimeout(resolve, 1500));
        // サーバーからのバリデーションエラーを想定
        setErrors({ amount: "上限額（100,000 円）を超えています" });
        ApplicationToast.error("保存できませんでした", "入力内容を確認してください。");
      } finally {
        setLoading(false);
      }
    };

    return (
      <form className="max-w-2xl space-y-4" onSubmit={handleSubmit}>
        {/* 送信中は入力自体を無効化する（ボタンだけの無効化では不十分） */}
        <fieldset disabled={loading} className="space-y-4">
          <ApplicationFormField label="件名" required>
            <ApplicationInput name="title" defaultValue="研修参加費" required />
          </ApplicationFormField>

          <ApplicationFormField label="対象期間" required error={errors.period}>
            <ApplicationDatePicker
              mode="range"
              value={range}
              onChange={(v) => {
                setRange(v as DateRange | undefined);
                setErrors((prev) => ({ ...prev, period: "" }));
              }}
              placeholder="期間を選択"
              className="w-full"
            />
          </ApplicationFormField>

          <ApplicationFormField label="金額" required error={errors.amount} helpText="税込">
            <ApplicationInput name="amount" type="number" defaultValue={120000} min={0} />
          </ApplicationFormField>
        </fieldset>

        <div className="flex items-center justify-end gap-2 border-t border-border pt-4">
          <ApplicationButton variant="secondary" type="button" disabled={loading}>
            キャンセル
          </ApplicationButton>
          <ApplicationButton variant="primary" type="submit" loading={loading}>
            申請する
          </ApplicationButton>
        </div>
      </form>
    );
  },
};
