import type { Meta, StoryObj } from "@storybook/react-vite";
import { PackageCheck, Store, Truck } from "lucide-react";
import * as React from "react";
import {
  HamiriloButtonGroup,
  type HamiriloButtonGroupItem,
  HamiriloCard,
  HamiriloFormField,
} from "../../components/hamirilo";

/**
 * Tailwind Plus の Radio groups パターンのうち「Button group」表現を
 * `HamiriloButtonGroup` で再現した実装例。
 *
 * <important>
 * これは Tailwind Plus のデザインをそのまま追従するものではない **スナップショット**。
 * 元のデザインが更新されても、このファイルは自動で追従しない。
 * </important>
 */
const meta = {
  title: "Patterns/ButtonGroupExample",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
## 出典

[Tailwind Plus - Radio groups (Button group)](https://tailwindcss.com/plus/ui-blocks/application-ui/forms/radio-groups)

## 目的

「隣接ボタンの並びで排他選択を表す」パターンを、\`HamiriloButtonGroup\` + \`HamiriloFormField\` の
組み合わせだけで再現できることを示す。新しい CSS やマークアップは持ち込まない。

## 使う場面

- 配送方法・プラン・表示形式など、少数の選択肢をボタン列として見せたい画面

## 注意事項

- Tailwind Plus の元デザインをピクセル単位で再現したものではない。
  **配色・余白は \`ai-dev-standards/*.md\` のトークンに従う**（Tailwind Plus のデフォルト配色は使わない）
- 選択肢ごとに料金・説明などの補足を出したい場合は、\`HamiriloButtonGroup\` の対象外
  （\`item.label\` は短いテキスト1行を想定）。カード型の選択 UI が必要なら別コンポーネントを検討する
        `,
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const SHIPPING_ITEMS: HamiriloButtonGroupItem[] = [
  { value: "standard", label: "通常配送", icon: <Truck /> },
  { value: "pickup", label: "店舗受取", icon: <Store /> },
  { value: "express", label: "速達", icon: <PackageCheck /> },
];

/**
 * 配送方法の選択。
 *
 * `HamiriloFormField` でラベルを付け、`HamiriloButtonGroup` にはアイコン付きの選択肢を渡す。
 */
export const ShippingMethod: Story = {
  render: () => {
    const [value, setValue] = React.useState("standard");

    return (
      <HamiriloCard title="配送方法">
        <div className="max-w-md space-y-3">
          <HamiriloFormField label="配送方法" required>
            <HamiriloButtonGroup
              items={SHIPPING_ITEMS}
              value={value}
              onValueChange={setValue}
              name="shipping_method"
            />
          </HamiriloFormField>

          <p className="text-sm text-muted-foreground">
            選択中: <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{value}</code>
          </p>
        </div>
      </HamiriloCard>
    );
  },
};

const SIZE_ITEMS: HamiriloButtonGroupItem[] = [
  { value: "s", label: "S" },
  { value: "m", label: "M" },
  { value: "l", label: "L" },
  { value: "xl", label: "XL", disabled: true },
];

/**
 * サイズ選択。secondary バリアント + sm サイズで、
 * フォーム内の補助的な選択項目として使う例。
 */
export const SizeSelector: Story = {
  render: () => {
    const [value, setValue] = React.useState("m");

    return (
      <HamiriloCard title="サイズを選択">
        <div className="max-w-md space-y-3">
          <HamiriloFormField label="サイズ" required helpText="XL は現在欠品中です">
            <HamiriloButtonGroup
              items={SIZE_ITEMS}
              value={value}
              onValueChange={setValue}
              variant="secondary"
              size="sm"
              name="size"
            />
          </HamiriloFormField>
        </div>
      </HamiriloCard>
    );
  },
};
