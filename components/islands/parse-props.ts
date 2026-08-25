/**
 * data-* 属性から Island の props を組み立てる
 *
 * 優先順位: data-props（JSON オブジェクト） > 個別の data-* 属性
 * 個別属性は JSON として解釈できれば JSON（数値・真偽値・配列）、
 * できなければ文字列として渡します。
 */

export function parseProps(element: HTMLElement): Record<string, unknown> {
  const props: Record<string, unknown> = {};

  // 個別の data-* 属性（data-react / data-props / data-react-mounted は除外）
  for (const key of Object.keys(element.dataset)) {
    if (key === "react" || key === "props" || key === "reactMounted") continue;
    const value = element.dataset[key];
    try {
      props[key] = JSON.parse(value ?? "");
    } catch {
      props[key] = value;
    }
  }

  // data-props（JSON）をマージ。キーが重複した場合はこちらを優先する
  const propsJson = element.dataset.props;
  if (propsJson) {
    try {
      Object.assign(props, JSON.parse(propsJson));
    } catch (error) {
      console.error(
        `[React Islands] Failed to parse data-props for ${element.dataset.react}:`,
        error,
      );
    }
  }

  return props;
}
