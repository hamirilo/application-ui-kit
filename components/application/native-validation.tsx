/**
 * ネイティブのフォーム検証を「可視の部品」へ橋渡しする。
 *
 * Popover や ToggleGroup を土台にした部品は、それ自体がフォームコントロールでは
 * ないため、値を送るために視覚的に隠した input を併せて描画する。この input は
 * 支援技術から二重に読まれないよう `aria-hidden` になっている。
 *
 * <important>
 * そのままネイティブ検証に任せると、送信時にブラウザが
 * 「最初の invalid なコントロール」= この `aria-hidden` な input へ
 * フォーカスする。支援技術から見ると存在しない要素へフォーカスが移るため、
 * どの項目が無効なのかもエラー文言も伝わらない（送信はブロックされたまま
 * なので、原因に到達できずに詰まる）。
 *
 * そこで**そのフォーカスを受けて可視コントロールへ渡し直す**。
 * 上流（Base UI）が自前の隠し input に対して行っているのと同じ手当てで、
 * `SelectRoot.js` / `CheckboxRoot.js` / `RadioRoot.js` はいずれも
 * 隠し input の `onFocus` でトリガーへフォーカスを戻している。
 *
 * `invalid` イベント側では**何もしない**。理由は 2 つある。
 *
 *   1. `checkValidity()` も `invalid` を発火する。そこでフォーカスや
 *      エラー表示を行うと、「検証結果を黙って知りたいだけ」の呼び出しで
 *      画面が動いてしまう（`reportValidity()` と区別が付かない）。
 *   2. 送信時は invalid な control それぞれで発火するため、各自が自分を
 *      フォーカスすると**最後の項目**が勝つ。ブラウザは先頭の項目を
 *      フォーカスするので、挙動が食い違う。
 *
 * `focus` はブラウザが対話的検証を行ったときにしか来ず、しかも先頭の
 * invalid な control にしか来ないため、両方とも起きない。
 * </important>
 *
 * 上流（Base UI）は `Form` / `Field` がこの役目を持つ設計で、`Form` は
 * `noValidate` を付けて自前で可視コントロールへフォーカスする。このキットは
 * その層を使っていないため、部品側で肩代わりする。層ごと入れ替えるかは
 * decisions/adr-0004 で扱う。
 */

import * as React from "react";
import { cn } from "../../lib/utils";

export interface NativeValidationRelay {
  /** ネイティブ検証が弾いたときのブラウザの文言。弾かれていなければ null */
  message: string | null;

  /** 文言を出す要素の id */
  messageId: string;

  /**
   * 送信用 input に渡すハンドラ。
   * ブラウザが対話的検証でこの input をフォーカスしたときだけ動く。
   */
  onFocus: React.FocusEventHandler<HTMLInputElement>;

  /** 値が変わったときに呼ぶ。エラー表示を解除する */
  clear: () => void;
}

/**
 * @param getControl フォーカスを移す可視コントロールを返す。
 *   roving tabindex のように「その時点で妥当な要素」が変わる部品があるため、
 *   ref ではなく関数で受ける。毎レンダー渡し直してよい。
 */
export function useNativeValidationRelay(
  getControl: () => HTMLElement | null,
  /**
   * `validationMessage` が空のときに出す文言。
   * ブラウザやテスト環境によっては空文字が返るため、
   * 「赤いだけで何も書いていない」表示にならないよう必ず用意する。
   */
  fallbackMessage = "この項目を入力してください",
): NativeValidationRelay {
  const reactId = React.useId();
  const [message, setMessage] = React.useState<string | null>(null);

  // onInvalid の identity を保ちつつ、常に最新の getControl を使う
  const getControlRef = React.useRef(getControl);
  const fallbackMessageRef = React.useRef(fallbackMessage);
  React.useEffect(() => {
    getControlRef.current = getControl;
    fallbackMessageRef.current = fallbackMessage;
  });

  const onFocus = React.useCallback<React.FocusEventHandler<HTMLInputElement>>((event) => {
    const input = event.currentTarget;
    // 通常のフォーカス（あり得ないが、tabIndex=-1 でも script からは来る）では動かさない
    if (input.validity.valid) return;
    setMessage(input.validationMessage || fallbackMessageRef.current);
    getControlRef.current()?.focus();
  }, []);

  const clear = React.useCallback(() => setMessage(null), []);

  return { message, messageId: `${reactId}-native-error`, onFocus, clear };
}

/**
 * ネイティブ検証の文言。
 *
 * <important>
 * `role="alert"` は付けない。この文言はフォーカスを移したコントロールから
 * `aria-describedby` で参照されるため、フォーカス時に読まれる。
 * alert を併用すると同じ内容が二重に読まれる。
 * </important>
 */
export function NativeValidationMessage({
  id,
  children,
  className,
}: {
  id: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p id={id} className={cn("mt-1.5 text-xs text-danger", className)}>
      {children}
    </p>
  );
}

/** aria-describedby を空白区切りで束ねる（空なら undefined） */
export function joinDescribedBy(...ids: (string | undefined | false)[]): string | undefined {
  const list = ids.filter((id): id is string => Boolean(id));
  return list.length > 0 ? list.join(" ") : undefined;
}
