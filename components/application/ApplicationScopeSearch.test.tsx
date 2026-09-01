import { fireEvent, render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import {
  ApplicationScopeSearch,
  type ApplicationScopeSearchItem,
  filterScopeItems,
  groupByKind,
  matchesScopeQuery,
} from "./ApplicationScopeSearch";

const KINDS = ["すべて", "人", "部署"];

const DATA: (ApplicationScopeSearchItem & { id: string })[] = [
  { id: "p1", kind: "人", label: "田中 太郎", sub: "営業部", key: "たなか たろう" },
  { id: "p2", kind: "人", label: "鈴木 花子", sub: "開発部", key: "すずき はなこ" },
  { id: "u1", kind: "部署", label: "営業部", sub: "SALES" },
  { id: "x1", kind: "拠点", label: "本社", sub: "" },
];

describe("matchesScopeQuery", () => {
  it("label と key の部分一致で当たる（大文字小文字を無視）", () => {
    const item = { kind: "人", label: "Tanaka Taro", key: "たなか" };
    expect(matchesScopeQuery(item, "tanaka")).toBe(true);
    expect(matchesScopeQuery(item, "たな")).toBe(true);
    expect(matchesScopeQuery(item, "suzuki")).toBe(false);
  });

  it("sub は一致対象にしない（所属名で人が全部ヒットするのを防ぐ）", () => {
    const item = { kind: "人", label: "田中 太郎", sub: "営業部" };
    expect(matchesScopeQuery(item, "営業部")).toBe(false);
  });

  it("空文字は全件一致", () => {
    expect(matchesScopeQuery({ kind: "人", label: "a" }, "  ")).toBe(true);
  });
});

describe("filterScopeItems / groupByKind", () => {
  it("kind=null は種別で絞らない", () => {
    expect(filterScopeItems(DATA, "営業部", null).map((i) => i.label)).toEqual(["営業部"]);
    expect(filterScopeItems(DATA, "", "人")).toHaveLength(2);
  });

  it("グループはタブの並び順、タブに無い種別は末尾", () => {
    const groups = groupByKind(DATA, KINDS);
    expect(groups.map((g) => g.kind)).toEqual(["人", "部署", "拠点"]);
  });
});

describe("ApplicationScopeSearch", () => {
  function setup(props: Partial<Parameters<typeof ApplicationScopeSearch>[0]> = {}) {
    const onSelect = vi.fn();
    const utils = render(
      <ApplicationScopeSearch data={DATA} kinds={KINDS} onSelect={onSelect} {...props} />,
    );
    const input = utils.getByRole("combobox") as HTMLInputElement;
    return { ...utils, onSelect, input };
  }

  it("フォーカスで開き、空欄では入力を促す", () => {
    const { input, getByText } = setup();
    fireEvent.focus(input);
    expect(getByText("検索したい語を入力してください")).toBeTruthy();
  });

  it("入力でローカル一致し、種別見出し付きで候補を出す", () => {
    const { input, getByRole, getAllByRole } = setup();
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: "営業部" } });
    // sub は一致対象にしないので、営業部所属の人はヒットしない
    const options = getAllByRole("option");
    expect(options).toHaveLength(1);
    expect(getByRole("listbox").textContent).toContain("営業部");
  });

  it("↓ + Enter でカーソル行を確定する", () => {
    const { input, onSelect } = setup();
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: "た" } });
    fireEvent.keyDown(input, { key: "ArrowDown" });
    fireEvent.keyDown(input, { key: "Enter" });
    expect(onSelect).toHaveBeenCalledTimes(1);
  });

  it("スコープタブで種別を絞り、0 件時は「すべてから探す」を出す", () => {
    const { input, getByRole, getByText, queryAllByRole } = setup();
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: "本社" } });
    fireEvent.click(getByRole("button", { name: "人" }));
    expect(queryAllByRole("option")).toHaveLength(0);
    fireEvent.click(getByText("すべてから探す"));
    expect(queryAllByRole("option")).toHaveLength(1);
  });

  it("serverFiltered ではローカルの文字列一致を止め、種別だけで絞る", () => {
    const { input, queryAllByRole } = setup({ serverFiltered: true });
    fireEvent.focus(input);
    // かな・メールなどサーバ側だけが知る項目でヒットした行を落とさない
    fireEvent.change(input, { target: { value: "行に載っていない検索語" } });
    expect(queryAllByRole("option")).toHaveLength(DATA.length);
  });

  it("loading 中は 0 件でも「該当なし」を出さない", () => {
    const { input, getByText, queryByText } = setup({ loading: true, data: [] });
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: "zzz" } });
    expect(getByText("検索中…")).toBeTruthy();
    expect(queryByText(/一致する項目はありません/)).toBeNull();
  });

  it("最近見た項目は data に居れば実体へ解決し、居なければ検索語になる", () => {
    const { input, getByRole, onSelect } = setup({
      recent: ["田中 太郎", "消えた項目"],
    });
    fireEvent.focus(input);
    fireEvent.click(getByRole("option", { name: /田中 太郎/ }));
    expect(onSelect).toHaveBeenCalledWith(expect.objectContaining({ id: "p1" }));

    // 確定でポップオーバーが閉じるので、フォーカスし直して開く
    fireEvent.focus(input);
    fireEvent.click(getByRole("option", { name: /消えた項目/ }));
    expect(input.value).toBe("消えた項目");
  });

  it("Escape で閉じる（フォーカスは入力に残る）", () => {
    const { input, queryByRole } = setup();
    // fireEvent.focus は実フォーカスを与えないため、Escape 処理の
    // triggerRef.focus() が「フォーカス移動 → onFocus → 再オープン」になってしまう。
    // 実ブラウザ同様に入力へ実フォーカスを与えてから押す。
    input.focus();
    fireEvent.focus(input);
    expect(queryByRole("listbox")).toBeTruthy();
    fireEvent.keyDown(input, { key: "Escape" });
    expect(queryByRole("listbox")).toBeNull();
    expect(document.activeElement).toBe(input);
  });
});
