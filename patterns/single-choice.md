# Single Choice

## Problem

複数の候補から、ユーザーに1つだけ選択してもらう。

選択肢の数、比較の重要度、説明量、検索の必要性によって適切なUIが変わるため、1つのComponentに固定しません。

## Options

| Option | Choose when | Avoid when |
| --- | --- | --- |
| Radio | 2〜5件程度で、候補を常に見比べたい | 候補が多い、画面を圧迫する |
| Select | 候補がやや多く、省スペースにしたい | 候補同士の比較が重要 |
| Combobox | 候補が多く、名前などで検索したい | 候補が数件しかなく検索が不要 |
| Button Group | 2〜4件程度の短いラベルで、軽量なモード切替に近い | 長い説明が必要、フォーム入力として意味を明示したい |
| Card Choice | 各候補に説明や特徴を伴わせ、違いを比較して選ばせたい | 候補が多い、単純な値選択だけで十分 |

## Selection guide

```text
候補が多く検索が必要？
├─ Yes → Combobox
└─ No
   ↓
候補の違いを説明・比較する必要がある？
├─ Yes → Card Choice または Radio + description
└─ No
   ↓
2〜5件程度を常時見せたい？
├─ Yes → Radio
└─ No → Select

短いモード切替に近い場合のみ Button Group も候補
```

## Notes

- 選択肢が少ないのにSelectへ隠すと、選択可能な内容を確認するための操作が増えます。
- 候補が大量にある場合、巨大なRadio一覧にしません。
- 同姓同名の社員など、ラベルだけでは識別できない候補では補足情報を表示します。
- Card Choiceは見た目のためだけに採用せず、説明や比較そのものに価値がある場合に使います。
- Button GroupはフォームのRadioを単に装飾した代替ではなく、短いモード・表示切替など即時性の高い選択に向きます。

## Catalog

Storybookの `Patterns/Single Choice` で主要な候補を同一画面上で比較します。
