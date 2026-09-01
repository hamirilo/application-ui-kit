/**
 * ApplicationScopeSearch - 種別（スコープ）タブ付きの横断検索オムニボックス
 *
 * 「人・部署・拠点」のように種類の違うものを 1 本の入力で横断検索し、
 * 種別タブで絞り込み、↓↑ + Enter で確定できる検索欄。ヘッダーの全域検索や
 * 一覧をまたぐジャンプに使う。
 *
 * 表示と操作だけを持ち、データは `data` で受け取る（このパッケージは
 * エンドポイントも取得ライブラリも焼き込まない）。サーバ側検索と組み合わせる
 * ための口が 4 つだけ余分にある（`onQueryChange` / `loading` /
 * `serverFiltered` / `inputRef`）。ローカルデータだけで使うなら渡さなくてよい。
 *
 * <important>
 * サーバ側検索と繋ぐときは `serverFiltered` を立てること。手元の文字列一致は
 * `label` と `key` しか見ないので、行に載っていない項目（かな・メールなど）で
 * サーバがヒットさせた行が、そのまま手元で落ちてしまう。
 * `onQueryChange` をそのままリクエストに使うと 1 打鍵ごとに飛ぶため、
 * `useDebouncedValue`（このパッケージが公開している）を挟むこと。
 * </important>
 */

import type * as React from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { cn } from "../../lib/utils";
import { ApplicationSearchInput } from "./ApplicationSearchInput";

/** 検索対象の 1 行。 */
export interface ApplicationScopeSearchItem {
  /** 種別。スコープタブと行末バッジがこれで決まる */
  kind: string;
  label: string;
  /** ラベルの右に薄く出す補助情報（コード・所属など） */
  sub?: string;
  /** かな・コードなど、ラベルに出さない検索用キー */
  key?: string;
}

/**
 * 一致判定は `label` と `key` に対する部分一致（大文字小文字を無視）。
 * `sub` を見ないのは意図的 —— 所属などを `sub` に置いている行が、
 * 別の語を打っただけで全部ヒットしてしまうため。かな検索は `key` が担う。
 */
export function matchesScopeQuery(item: ApplicationScopeSearchItem, query: string): boolean {
  const needle = query.trim().toLowerCase();
  if (!needle) return true;
  return [item.label, item.key ?? ""].some((haystack) => haystack.toLowerCase().includes(needle));
}

/** `kind` が null（=「すべて」タブ）なら種別で絞らない。 */
export function filterScopeItems<T extends ApplicationScopeSearchItem>(
  data: T[],
  query: string,
  kind: string | null,
): T[] {
  return data.filter(
    (item) => (kind === null || item.kind === kind) && matchesScopeQuery(item, query),
  );
}

/**
 * 「すべて」タブ用の種別グルーピング。並びは `kinds`（タブの並び）に従い、
 * `kinds` に無い種別は末尾へ回す（データ側が先に増えても行が消えない）。
 */
export function groupByKind<T extends ApplicationScopeSearchItem>(
  items: T[],
  kinds: string[],
): { kind: string; items: T[] }[] {
  const order = new Map(kinds.map((kind, index) => [kind, index]));
  const buckets = new Map<string, T[]>();
  for (const item of items) {
    const bucket = buckets.get(item.kind);
    if (bucket) bucket.push(item);
    else buckets.set(item.kind, [item]);
  }
  return [...buckets.entries()]
    .map(([kind, grouped]) => ({ kind, items: grouped }))
    .sort(
      (a, b) =>
        (order.get(a.kind) ?? Number.MAX_SAFE_INTEGER) -
        (order.get(b.kind) ?? Number.MAX_SAFE_INTEGER),
    );
}

/**
 * ポップオーバーの開閉ロジック（このコンポーネント内専用）。
 *
 * 外側 `mousedown` で閉じる・`Escape` で閉じてフォーカスをトリガーへ戻す、の 2 点。
 * Escape はルート要素で受ける（document ではなく）。document で受けると
 * イベントは先に祖先の ApplicationDialog を通過してしまい、フィルタを
 * 閉じたつもりがダイアログごと閉じる。リスナーは open のときだけ張る。
 */
function usePopover<TTrigger extends HTMLElement>() {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<TTrigger>(null);

  const openPopover = useCallback(() => setOpen(true), []);
  const closePopover = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;

    function handleMouseDown(event: MouseEvent) {
      // マウスで外を触って閉じたときはフォーカスを動かさない。クリック先が
      // 別の入力欄なら、そちらがそのままフォーカスを取るのが自然。
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      event.stopPropagation();
      setOpen(false);
      triggerRef.current?.focus();
    }

    const root = containerRef.current;
    document.addEventListener("mousedown", handleMouseDown);
    root?.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
      root?.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return { open, containerRef, triggerRef, openPopover, closePopover };
}

export interface ApplicationScopeSearchProps<
  T extends ApplicationScopeSearchItem = ApplicationScopeSearchItem,
> {
  /**
   * プレースホルダー。`aria-label` にも使う
   * @default "検索"
   */
  placeholder?: string;

  /** 検索対象 */
  data: T[];

  /** スコープタブの並び。先頭は「すべて」相当 */
  kinds: string[];

  /** 空欄時に出す「最近見た項目」のラベル配列 */
  recent?: string[];

  onSelect: (item: T) => void;

  /** サーバ側検索と繋ぐとき、入力のたびに呼ばれる */
  onQueryChange?: (query: string) => void;

  /** サーバ側検索の待ち時間に「該当なし」を出さないための口 */
  loading?: boolean;

  /**
   * `data` がサーバ側で検索済みのとき true。手元での文字列一致を止める
   * （種別タブの絞り込みは残る）。サーバに任せた検索は二重に絞らない。
   */
  serverFiltered?: boolean;

  /** ⌘K などで外から入力欄へフォーカスを飛ばしたいとき */
  inputRef?: React.Ref<HTMLInputElement>;

  className?: string;

  /** 入力欄そのものの寸法上書き（ヘッダーの高密度配置など） */
  inputClassName?: string;
}

/** 既定値をレンダーごとに作り直すと useMemo の依存が毎回変わる。 */
const NO_RECENT: string[] = [];

const KIND_BADGE =
  "shrink-0 rounded-full bg-muted px-1.5 py-0.5 text-[11px] leading-none text-muted-foreground";

const GROUP_LABEL = "px-2.5 py-1 text-[11px] font-semibold tracking-[0.04em] text-muted-foreground";

/**
 * ApplicationScopeSearch コンポーネント
 *
 * @example
 * ```tsx
 * // ローカルデータの横断検索
 * <ApplicationScopeSearch
 *   placeholder="社員・部署・拠点を検索"
 *   kinds={["すべて", "人", "部署", "拠点"]}
 *   data={items}
 *   onSelect={(item) => navigate(item)}
 * />
 *
 * // サーバ側検索と繋ぐ（useDebouncedValue と組で使う）
 * <ApplicationScopeSearch
 *   data={serverRows}
 *   kinds={KINDS}
 *   serverFiltered
 *   loading={isFetching}
 *   onQueryChange={setQuery}
 *   onSelect={(item) => (window.location.href = item.href)}
 * />
 * ```
 */
export function ApplicationScopeSearch<
  T extends ApplicationScopeSearchItem = ApplicationScopeSearchItem,
>({
  placeholder = "検索",
  data,
  kinds,
  recent = NO_RECENT,
  onSelect,
  onQueryChange,
  loading = false,
  serverFiltered = false,
  inputRef,
  className,
  inputClassName,
}: ApplicationScopeSearchProps<T>) {
  const { open, containerRef, triggerRef, openPopover, closePopover } =
    usePopover<HTMLInputElement>();
  const [query, setQuery] = useState("");
  // 「すべて」タブ（kinds[0]）を選んでいる間は種別で絞らない。
  const [scope, setScope] = useState<string | null>(null);
  const [cursor, setCursor] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);

  const showRecent = query.trim().length === 0;

  // serverFiltered のときは種別だけで絞る（空文字は全件一致）。
  const matches = useMemo(
    () => (showRecent ? [] : filterScopeItems(data, serverFiltered ? "" : query, scope)),
    [data, query, scope, showRecent, serverFiltered],
  );

  /** 「最近見た項目」はラベルだけなので、`data` に居れば実体へ解決する。 */
  const recentItems = useMemo(
    () =>
      recent.map((label) => ({
        label,
        item: data.find((candidate) => candidate.label === label),
      })),
    [recent, data],
  );

  /** ↓↑ と Enter が動く並び。「すべて」でも見出しをまたいで 1 本に潰す。 */
  const grouped = useMemo(
    () => (scope === null ? groupByKind(matches, kinds) : [{ kind: scope, items: matches }]),
    [matches, kinds, scope],
  );
  const flat = useMemo(() => grouped.flatMap((group) => group.items), [grouped]);
  const cursorMax = showRecent ? recentItems.length : flat.length;

  // 候補が入れ替わったらカーソルは先頭へ。前の位置に残すと、打鍵のたびに
  // 別の行が選ばれている状態で Enter を押すことになる。
  // biome-ignore lint/correctness/useExhaustiveDependencies: query / scope の変化だけで先頭へ戻す
  useEffect(() => {
    setCursor(0);
  }, [query, scope]);

  // カーソル行を可視範囲へ追従させる。
  // biome-ignore lint/correctness/useExhaustiveDependencies: cursor は「動いたら追従させる」ためのトリガー依存
  useEffect(() => {
    if (!open) return;
    listRef.current
      ?.querySelector<HTMLElement>('[data-cursor="true"]')
      ?.scrollIntoView({ block: "nearest" });
  }, [cursor, open]);

  function choose(item: T | undefined, fallbackLabel?: string) {
    if (item) {
      onSelect(item);
      closePopover();
      return;
    }
    // `data` に無い「最近見た項目」は検索語として使う（当時の行は
    // いまのデータに無いかもしれないので、確定はさせない）。
    if (fallbackLabel !== undefined) {
      setQuery(fallbackLabel);
      onQueryChange?.(fallbackLabel);
    }
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      if (cursorMax === 0) return;
      event.preventDefault();
      const step = event.key === "ArrowDown" ? 1 : -1;
      setCursor((prev) => (prev + step + cursorMax) % cursorMax);
      return;
    }
    if (event.key === "Enter") {
      event.preventDefault();
      if (showRecent) {
        const entry = recentItems[cursor];
        if (entry) choose(entry.item, entry.label);
      } else {
        choose(flat[cursor]);
      }
    }
    // Escape は usePopover が root の keydown で受ける。
  }

  const emptyHit = !showRecent && !loading && flat.length === 0;

  return (
    <div ref={containerRef} className={cn("relative w-full", className)}>
      <ApplicationSearchInput
        ref={(node: HTMLInputElement | null) => {
          triggerRef.current = node;
          if (typeof inputRef === "function") inputRef(node);
          else if (inputRef) (inputRef as { current: HTMLInputElement | null }).current = node;
        }}
        value={query}
        placeholder={placeholder}
        aria-label={placeholder}
        aria-expanded={open}
        aria-haspopup="listbox"
        role="combobox"
        className={inputClassName}
        onFocus={openPopover}
        onChange={(event) => {
          setQuery(event.target.value);
          onQueryChange?.(event.target.value);
          openPopover();
        }}
        onClear={() => {
          setQuery("");
          onQueryChange?.("");
        }}
        onKeyDown={onKeyDown}
      />

      {open && (
        <div className="absolute left-0 top-full z-50 mt-1 w-full rounded-lg border border-border bg-card shadow-lg">
          <div className="flex gap-1 border-b border-border p-1.5">
            {kinds.map((kind, index) => {
              // 先頭タブが「すべて」。scope=null がその状態。
              const kindScope = index === 0 ? null : kind;
              const active = scope === kindScope;
              return (
                <button
                  key={kind}
                  type="button"
                  aria-pressed={active}
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => setScope(kindScope)}
                  className={cn(
                    "cursor-pointer rounded-full px-2 py-0.5 text-[11px] transition-colors",
                    active
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted",
                  )}
                >
                  {kind}
                </button>
              );
            })}
          </div>

          {/* コンボボックス型：フォーカスは入力に置いたまま操作する。Tab では止めない */}
          <div
            ref={listRef}
            role="listbox"
            tabIndex={-1}
            className="max-h-[300px] overflow-y-auto py-1"
          >
            {showRecent && recentItems.length > 0 && (
              <>
                <p className={GROUP_LABEL}>最近見た項目</p>
                {recentItems.map((entry, index) => (
                  <button
                    key={entry.label}
                    type="button"
                    role="option"
                    aria-selected={cursor === index}
                    data-cursor={cursor === index}
                    onMouseDown={(event) => event.preventDefault()}
                    onMouseEnter={() => setCursor(index)}
                    onClick={() => choose(entry.item, entry.label)}
                    className={cn(
                      "flex w-full cursor-pointer items-center gap-2 px-2.5 py-1.5 text-left text-[13px]",
                      cursor === index && "bg-muted",
                    )}
                  >
                    <span className="flex-1 truncate">{entry.label}</span>
                    {entry.item && <span className={KIND_BADGE}>{entry.item.kind}</span>}
                  </button>
                ))}
              </>
            )}

            {showRecent && recentItems.length === 0 && (
              <p className="px-2.5 py-6 text-center text-[13px] text-muted-foreground">
                検索したい語を入力してください
              </p>
            )}

            {!showRecent && loading && flat.length === 0 && (
              <p className="px-2.5 py-6 text-center text-[13px] text-muted-foreground">検索中…</p>
            )}

            {emptyHit && (
              <div className="px-2.5 py-6 text-center">
                <p className="text-[13px] text-muted-foreground">
                  「{query}」に一致する項目はありません
                </p>
                {scope !== null && (
                  <button
                    type="button"
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => setScope(null)}
                    className="mt-1 cursor-pointer text-[12px] text-primary underline-offset-2 hover:underline"
                  >
                    {kinds[0]}から探す
                  </button>
                )}
              </div>
            )}

            {!showRecent &&
              grouped.map((group) => (
                <div key={group.kind}>
                  {/* 「すべて」のときだけ種別見出しを出す */}
                  {scope === null && group.items.length > 0 && (
                    <p className={GROUP_LABEL}>{group.kind}</p>
                  )}
                  {group.items.map((item) => {
                    const index = flat.indexOf(item);
                    return (
                      <button
                        key={`${item.kind}-${item.label}-${index}`}
                        type="button"
                        role="option"
                        aria-selected={cursor === index}
                        data-cursor={cursor === index}
                        onMouseDown={(event) => event.preventDefault()}
                        onMouseEnter={() => setCursor(index)}
                        onClick={() => choose(item)}
                        className={cn(
                          "flex w-full cursor-pointer items-center gap-2 px-2.5 py-1.5 text-left",
                          cursor === index && "bg-muted",
                        )}
                      >
                        <span className="truncate text-[13px] font-medium text-foreground">
                          {item.label}
                        </span>
                        <span className="flex-1 truncate text-[12px] text-muted-foreground">
                          {item.sub}
                        </span>
                        <span className={KIND_BADGE}>{item.kind}</span>
                      </button>
                    );
                  })}
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
