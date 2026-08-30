import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";
import {
  ApplicationButtonGroup,
  ApplicationCombobox,
  ApplicationRadioGroup,
  ApplicationSelect,
  Card,
  CardContent,
} from "../../components/application";

const CHOICES = [
  { value: "standard", label: "標準", description: "通常の申請・承認フローを利用します" },
  { value: "fast", label: "簡易", description: "少ない入力項目で素早く登録します" },
  { value: "advanced", label: "詳細", description: "追加設定を含めて登録します" },
];

const DEPARTMENTS = [
  { value: "sales", label: "営業部", badge: "本社" },
  { value: "admin", label: "総務部", badge: "本社" },
  { value: "dev", label: "開発部", badge: "本社" },
  { value: "quality", label: "品質管理課", badge: "工場" },
  { value: "production", label: "製造部", badge: "工場" },
];

const meta = {
  title: "Patterns/Single Choice",
  parameters: {
    layout: "padded",
    controls: { disable: true },
    docs: {
      description: {
        component: `
## Problem

複数候補から1つだけ選択させる場面では、選択肢数・比較の重要度・説明量・検索の必要性で適切なUIが変わります。

このStoryは「どのComponentが存在するか」ではなく、**同じUX課題をどう解くかを比較するCatalog**です。

詳しい判断軸は \`patterns/single-choice.md\` を参照してください。

### 目安

- **Radio**: 2〜5件程度で常に比較したい
- **Select**: やや多い候補を省スペースで選ぶ
- **Combobox**: 候補が多く検索が必要
- **Button Group**: 短いモード・表示切替
- **Card Choice**: 候補ごとの説明や違いを比較したい
        `,
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

function ExampleSection({
  title,
  guidance,
  children,
}: {
  title: string;
  guidance: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-3 rounded-lg border border-border p-5">
      <div>
        <h2 className="text-base font-semibold text-foreground">{title}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{guidance}</p>
      </div>
      <div className="max-w-xl">{children}</div>
    </section>
  );
}

function CardChoiceExample() {
  return (
    <fieldset>
      <legend className="sr-only">登録方法</legend>
      <div className="grid gap-3 sm:grid-cols-3">
        {CHOICES.map((choice, index) => (
          <label key={choice.value} className="block cursor-pointer">
            <input
              type="radio"
              name="card-choice-example"
              value={choice.value}
              defaultChecked={index === 0}
              className="peer sr-only"
            />
            <Card className="transition peer-checked:border-primary peer-checked:ring-1 peer-checked:ring-primary peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2">
              <CardContent className="space-y-1 p-4">
                <div className="font-medium text-foreground">{choice.label}</div>
                <p className="text-sm text-muted-foreground">{choice.description}</p>
              </CardContent>
            </Card>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

/** 主要な選択肢を同一画面で比較する。新しい単一選択UIを設計するときはまずここを見る。 */
export const Comparison: Story = {
  render: () => (
    <div className="mx-auto max-w-4xl space-y-5">
      <ExampleSection title="Radio" guidance="2〜5件程度。候補を常に見せ、比較しながら選ばせたい場合。">
        <ApplicationRadioGroup items={CHOICES} defaultValue="standard" name="radio-example" />
      </ExampleSection>

      <ExampleSection title="Select" guidance="候補がやや多く、常時表示する必要がない場合。">
        <ApplicationSelect
          items={CHOICES.map(({ value, label }) => ({ value, label }))}
          defaultValue="standard"
          placeholder="登録方法を選択"
          aria-label="登録方法"
        />
      </ExampleSection>

      <ExampleSection title="Combobox" guidance="部署・社員など候補が多く、入力して絞り込みたい場合。">
        <ApplicationCombobox
          items={DEPARTMENTS}
          placeholder="部署を検索"
          clearable
          aria-label="部署"
        />
      </ExampleSection>

      <ExampleSection title="Button Group" guidance="2〜4件程度の短いモード・表示切替。長い説明を伴うフォーム選択には使わない。">
        <ApplicationButtonGroup
          items={[
            { value: "day", label: "日" },
            { value: "week", label: "週" },
            { value: "month", label: "月" },
          ]}
          defaultValue="week"
          aria-label="表示期間"
        />
      </ExampleSection>

      <ExampleSection title="Card Choice" guidance="各候補の違いや説明を見比べて選ぶこと自体に価値がある場合。">
        <CardChoiceExample />
      </ExampleSection>
    </div>
  ),
};
