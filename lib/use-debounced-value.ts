import { useEffect, useState } from "react";

/**
 * `value` が `delay` ミリ秒変化しなくなってから追随する値を返す。
 *
 * 検索欄をそのまま queryKey やリクエストに使うと 1 打鍵ごとにリクエストが飛ぶ。
 * 「田中」と打つだけで 3 本、日本語入力なら変換途中の分だけさらに増える。
 * `ApplicationScopeSearch` の `onQueryChange` をサーバ検索へ繋ぐときは必ず挟むこと。
 *
 * @example
 * ```tsx
 * const [query, setQuery] = useState("");
 * const debounced = useDebouncedValue(query.trim(), 250);
 * // debounced をリクエスト（useQuery の queryKey 等）に使う
 * ```
 */
export function useDebouncedValue<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}
