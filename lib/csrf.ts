/**
 * CSRF トークン取得ユーティリティ（Django 連携 Island 用）
 *
 * Django の CSRF cookie からトークンを読み取ります。
 * Cookie 名の既定値は Django の既定（`csrftoken`）です。プロジェクトが
 * `CSRF_COOKIE_NAME` を変更している場合は、Island の `csrfCookieName` prop
 * （テンプレートでは `data-csrf-cookie-name`）で渡してください。
 * エンドポイントや認証方式はこのパッケージに焼き込みません。
 */

export const DEFAULT_CSRF_COOKIE_NAME = "csrftoken";

/**
 * Cookie から CSRF トークンを取得する
 *
 * @param cookieName - Cookie 名（デフォルト: `csrftoken`）
 * @returns CSRF トークン文字列。見つからない場合は空文字列
 */
export function getCsrfToken(cookieName: string = DEFAULT_CSRF_COOKIE_NAME): string {
  const cookies = document.cookie.split(";");
  for (const cookie of cookies) {
    const trimmed = cookie.trim();
    if (trimmed.startsWith(`${cookieName}=`)) {
      return trimmed.substring(cookieName.length + 1);
    }
  }
  return "";
}

/**
 * fetch リクエスト用の CSRF ヘッダーを取得する
 *
 * @example
 * ```ts
 * const headers = {
 *   'Content-Type': 'application/json',
 *   ...getCsrfHeaders(),
 * }
 * ```
 */
export function getCsrfHeaders(cookieName?: string): Record<string, string> {
  const token = getCsrfToken(cookieName);
  return token ? { "X-CSRFToken": token } : {};
}
