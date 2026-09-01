# ADR-0002: forkのbranch運用とupstreamへの反映経路

**ステータス**: 採用

## コンテキスト

このrepositoryは2つのremoteを持ちます。

| remote | repository | 役割 |
|---|---|---|
| `upstream` | 上流の `ui-platform` | 共有資産としての正本 |
| `origin` | 利用組織がforkした `ui-platform` | 組織のfork。`@<owner>/application-ui-kit` のpublish元 |

owner名はここへ固定しません（ADR-0005の2）。各checkoutの `git remote -v` を正とします。

fork運用の原則は [ai-dev-standards / ADR-0005](https://github.com/hamirilo/ai-dev-standards/blob/main/decisions/adr-0005-upstream-fork-operation.md)、branchとmainの扱いは [Governance Standard](https://github.com/hamirilo/ai-dev-standards/blob/main/standards/governance/README.md) 3章を正とします。ここではそれらをこのrepositoryへ適用した具体を決めます。原則自体は再掲しません。

`origin/main` と `upstream/main` が同一commitである状態を既定とし、それを維持する運用を決めます。

決める必要があるのは次の3点です。

1. どのbranchからどこへPRを出すか。
2. 組織内で先に検証したい変更をどう扱うか。
3. fork側でpublishするときのpackage versionをどう扱うか。

3はADR-0005の範囲外です。ADR-0005はpackage **scope** をsourceへ固定しないことを決めていますが、package **version** は `package.json` にある共有sourceの一部であり、forkが独自に進めると同じversion番号がupstreamとforkで別内容を指します。

## 決定

### 1. branchの役割

- `main` は `upstream/main` と常に同一に保つ。forkの `main` を独自に進めない。
- 同期は fast-forward のみとする。差分が入り込んでいれば失敗して気づけるようにする。

  ```bash
  git fetch upstream
  git switch main
  git merge --ff-only upstream/main
  git push origin main
  ```

- 作業branchはGovernance 3.1に従い `type/topic/short-description` とする。例: `feat/components/application-tag`、`fix/tokens/dark-border-contrast`。
- **作業branchは `upstream/main` から切る。** `origin/main` が同期遅れでも取り込み先とズレない。
- マージ後は削除する。fork側にだけ残し続けるbranchを作らない。

### 2. こちらで実装したComponentのupstreamへの反映

UI Platformが所有すべき汎用改善（Foundations / Components / Patterns / Templates / Catalog / design-system）は、すべてこの経路を通す。

1. `upstream/main` から作業branchを切る。
2. `just check` を通す。公開契約や依存へ影響する場合は `just verify-package` も通す。
3. `origin` へpushする。
4. **PRは `upstream/main` 宛に出す**（forkからのcross-repository PR）。
5. upstreamでsquash mergeする。
6. `origin/main` を上記のfast-forwardで同期する。
7. 作業branchを削除する。

ADR-0005の4に従い、組織名、内部URL、内部host、特定Application固有path、非公開運用を含む変更はこの経路へ載せない。業務domain固有UIはdomainを所有するprojectへ置く（[project-context](project-context.md)）。

### 3. 組織内で先に検証する場合

ADR-0005はforkの目的に「組織内で検証した汎用改善をupstreamへ返せる」ことを挙げており、fork先行は想定内である。ただし差分の滞留を恒常化させない。

- 同じ作業branchを `origin/main` へ先にsquash mergeしてよい。
- その場合、**upstream PRを同時に出す**。upstreamのmerge待ちとしてのみ差分を持つ。
- upstreamでmergeされたら `origin/main` をupstreamへ合わせ直す。先行mergeした内容はupstream側のsquash commitで置き換わる。

先行状態が長期化する場合は、ADR-0005の6に従い独立repositoryとして分岐すべきかを先に検討する。

### 4. package versionとrelease tag

- **package versionのbumpはupstreamで行う。** forkは追従してからpublishする。
- forkが `origin/main` 先行状態のままpublishしない。upstream未マージの内容をupstreamの正式version番号で配布すると、同じ `6.x.y` がownerによって別内容を指すことになる。
- upstream mergeを待てない事情がある場合に限り、prerelease版（例 `6.1.0-<owner>.1`）としてpublishし、無印の `6.1.0` をforkで消費しない。
- release tagはsource差分ではないため、fork側にも立ててよい。
  - `v<version>` — UI Platform repositoryのrelease。upstreamで打つ。package publishは行わない。
  - `application-ui-kit-v<package-version>` — package release。publishするownerが自分のrepositoryで打つ。

package scopeをpublish時にrepository ownerから導出する理由は `.github/workflows/publish.yml` の冒頭コメントを正とする。`package.json` のnameが現在のorigin ownerと異なっていても不整合ではない。

## 結果

- `origin/main` は `upstream/main` のmirrorとして保たれ、ADR-0005が求める「恒常差分なし」を既定で満たす。
- fast-forward限定の同期により、意図しないfork差分が混入した時点で検知できる。
- 汎用改善の反映経路が1本になり、upstreamへPRを出す前提で作業branchを切る癖がつく。
- fork先行検証は可能だが、upstream PRとの同時進行を条件とすることで滞留しにくい。
- package versionをupstream起点に固定することで、ownerごとに同じversion番号が別内容を指す事故を避けられる。
- 制約として、fork側だけで完結する迅速なリリースはできない。それが必要になった時点で独立repositoryへの分岐を検討する。

## 見直し

upstreamと恒常的に異なる要件を持つようになった場合、fork差分を積み上げず独立repositoryとして分岐する判断をこのrepositoryのADRへ残す。
