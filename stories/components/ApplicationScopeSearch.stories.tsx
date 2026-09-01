import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";
import {
  ApplicationScopeSearch,
  type ApplicationScopeSearchItem,
  useDebouncedValue,
} from "../../components/application";
import { Section, Showcase } from "../_showcase";

const KINDS = ["すべて", "人", "部署", "拠点"];

const DATA: (ApplicationScopeSearchItem & { href: string })[] = [
  { kind: "人", label: "田中 太郎", sub: "1001 · tanaka@example.com", key: "たなか たろう", href: "#" },
  { kind: "人", label: "鈴木 花子", sub: "1002 · suzuki@example.com", key: "すずき はなこ", href: "#" },
  { kind: "人", label: "佐藤 次郎", sub: "1003 · sato@example.com", key: "さとう じろう", href: "#" },
  { kind: "部署", label: "営業部", sub: "SALES", href: "#" },
  { kind: "部署", label: "開発部", sub: "DEV", href: "#" },
  { kind: "拠点", label: "本社", sub: "東京", href: "#" },
  { kind: "拠点", label: "大阪支社", sub: "大阪", href: "#" },
];

/**
 * ApplicationScopeSearch は種別（スコープ）タブ付きの横断検索オムニボックス。
 */
const meta = {
  title: "Components/ApplicationScopeSearch",
  component: ApplicationScopeSearch,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
## 目的

種類の違うもの（人・部署・拠点など）を 1 本の入力で横断検索し、種別タブで
絞り込み、↓↑ + Enter で確定する動きを毎回作らずに済むようにする。
ヘッダーの全域検索（⌘K で飛ぶやつ）や、一覧をまたぐジャンプに使う。

## 使う場面

- ヘッダーの全域検索（複数の種類を 1 本で引く）
- 「どの種類か分からないが名前は知っている」ものへのジャンプ

## 使わない場面

| 場面 | 代わりに使うもの |
|---|---|
| 1 種類だけの一覧絞り込み | \`ApplicationSearchInput\`（Patterns/Search） |
| フォームで候補から 1 つ選ぶ | \`ApplicationCombobox\` |

## 注意事項

- データは \`data\` で渡す。**このコンポーネントは API を叩かない**
  （エンドポイント・認証はアプリ側の責務）
- サーバ側検索と繋ぐときは \`serverFiltered\` を立てる。手元の文字列一致は
  \`label\` と \`key\` しか見ないため、かな・メールなど行に載らない項目で
  ヒットした行を手元で落としてしまう
- \`onQueryChange\` をそのままリクエストに使わない。\`useDebouncedValue\` を挟む
- 一致対象は \`label\` と \`key\`。\`sub\`（所属などの補助表示）は意図的に見ない
        `,
      },
    },
  },
  args: {
    data: DATA,
    kinds: KINDS,
    onSelect: () => {},
  },
} satisfies Meta<typeof ApplicationScopeSearch>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * ローカルデータの横断検索。
 *
 * 「た」で人がかな（`key`）でヒットする。種別タブ・↓↑ + Enter・Escape が使える。
 */
export const Overview: Story = {
  parameters: { controls: { disable: true } },
  render: () => {
    const [selected, setSelected] = React.useState<string | null>(null);

    return (
      <Showcase>
        <Section
          title="Local data"
          note="「た」と打つとかな（key）で当たる。sub（所属など）は意図的に一致対象にしない。"
        >
          <div className="max-w-md">
            <ApplicationScopeSearch
              placeholder="社員・部署・拠点を検索"
              kinds={KINDS}
              data={DATA}
              recent={["田中 太郎", "本社"]}
              onSelect={(item) => setSelected(item.label)}
            />
            <p className="mt-2 text-xs text-muted-foreground">
              {selected ? `選択: ${selected}` : "未選択（Enter か クリックで確定）"}
            </p>
          </div>
        </Section>
      </Showcase>
    );
  },
};

/**
 * サーバ側検索と繋ぐ形（ここでは setTimeout で擬似）。
 *
 * `useDebouncedValue` で打鍵を間引き、`serverFiltered` で手元の絞り直しを止め、
 * `loading` で「該当なし」の誤表示を防ぐ。実アプリではこの island / 呼び出し側が
 * API を叩き、結果を `data` に流し込む。
 */
export const ServerConnected: Story = {
  parameters: { controls: { disable: true } },
  render: () => {
    const [query, setQuery] = React.useState("");
    const debounced = useDebouncedValue(query.trim(), 250);
    const [rows, setRows] = React.useState<ApplicationScopeSearchItem[]>([]);
    const [fetching, setFetching] = React.useState(false);

    React.useEffect(() => {
      if (!debounced) {
        setRows([]);
        return;
      }
      setFetching(true);
      const timer = setTimeout(() => {
        // サーバは label に出ない項目（かな・メール）でも引ける、という想定
        setRows(
          DATA.filter((item) =>
            [item.label, item.key ?? "", item.sub ?? ""].some((v) => v.includes(debounced)),
          ),
        );
        setFetching(false);
      }, 400);
      return () => clearTimeout(timer);
    }, [debounced]);

    return (
      <div className="max-w-md">
        <ApplicationScopeSearch
          placeholder="サーバ検索（擬似）"
          kinds={KINDS}
          data={rows}
          serverFiltered
          loading={query.trim() !== debounced || fetching}
          onQueryChange={setQuery}
          onSelect={() => {}}
        />
      </div>
    );
  },
};
