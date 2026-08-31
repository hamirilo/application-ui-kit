# UI Templates

Templateは、複数のPatternとComponentを組み合わせた **画面レベルの構成例** を扱います。

例:

- 一覧 + 検索 + フィルター + ページング
- CRUDの新規作成 / 編集画面
- 詳細画面
- 設定画面
- Dashboard

## Patternとの違い

- Pattern: 「単一選択をどう見せるか」「Empty stateをどう見せるか」など、1つの設計上の問題を扱う
- Template: 一覧画面や詳細画面など、複数のPatternを組み合わせた画面全体を扱う

Templateは完成した業務画面のコピー元ではなく、構成・余白・情報階層・主要操作の置き方を確認するための参照例です。

実案件固有の文言、API、権限、業務ルールは持ち込みません。

## 追加方針

実案件で同じ画面構成を複数回作り、「次回も骨格から考え直すコストが高い」と分かったものだけを追加します。

最初からCRUD、Dashboard、Settings等を網羅的に作ることはしません。

## 現在の状況

**Templateはまだ1件もありません。** このディレクトリにあるのはこのREADMEだけで、
`stories/templates/` も存在しません。Storybookのサイドバーには
`.storybook/preview.tsx` の `storySort` で `Templates` の枠だけ予約してありますが、
中身が入るまで表示されません。

上の追加方針どおり、実案件での繰り返しが確認できるまで先回りして作りません。
「宣言されているのに空」に見えますが、意図的な状態です。

Templateを最初に追加するときは:

1. `templates/<名前>.md` に構成・余白・情報階層・主要操作の置き方を書く
2. `stories/templates/<名前>.stories.tsx` を追加する（`title` は `Templates/<名前>`）
3. このREADMEの本節を一覧に置き換える

なお `stories/patterns/` のうち DataTable / Form / Search / EmptyState / ErrorState は
複数Componentを組み合わせた画面レシピの形をしており、上の「Patternとの違い」で言えば
Templateに近い側面があります。Storybook上の分類を動かすと既存の参照が切れるため
現時点では移していません。Templateを実際に追加するときに、まとめて整理を検討します。
