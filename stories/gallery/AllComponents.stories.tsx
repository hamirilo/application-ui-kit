import type { Meta, StoryObj } from "@storybook/react-vite";
import { Calendar, FileText, MoreVertical, Plus, Search } from "lucide-react";
import * as React from "react";
import {
  ApplicationBadge,
  ApplicationButton,
  ApplicationButtonGroup,
  ApplicationCheckbox,
  ApplicationCombobox,
  ApplicationConfirmDialog,
  ApplicationDatePicker,
  ApplicationDialog,
  ApplicationDropdown,
  ApplicationFormDialog,
  ApplicationFormField,
  ApplicationInput,
  ApplicationNavItem,
  ApplicationPagination,
  ApplicationRadioGroup,
  ApplicationSearchInput,
  ApplicationSelect,
  ApplicationTable,
  type ApplicationTableColumn,
  ApplicationTabs,
  ApplicationThemeToggle,
  ApplicationToast,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
  Label,
  Progress,
  ProgressIndicator,
  ProgressTrack,
  Separator,
  Spinner,
  Textarea,
} from "../../components/application";
import { Cluster, Grid, Labeled, Section, Showcase, Stack } from "../_showcase";

/**
 * UI Kit 全体を 1 画面で俯瞰するためのページ。
 *
 * <important>
 * ここは「何が使えるか」を探すための入口。**網羅はしない。**
 * 状態や Props の全パターンは各コンポーネントの Overview / 個別 Story にある。
 * 新しいコンポーネントを追加したら、代表的な見た目を 1 つだけここに足す。
 * </important>
 */
const meta = {
  title: "Gallery/All Components",
  parameters: {
    layout: "padded",
    // 一覧のため Props を 1 つ変えても全体に効かない。Controls は出さない。
    controls: { disable: true },
    docs: {
      description: {
        component: `
## 目的

**使える UI を短時間で探せる**ようにする。コードを読まずに、
どのコンポーネントがあるかを 1 画面で把握するためのページ。

## 見方

1. ここで使えそうなコンポーネントを見つける
2. サイドバーの \`Components/<名前>\` の **Overview** でバリエーションと状態を比較する
3. 個別 Story で操作・キーボード・エラー時の見た目を確かめる

各見本の上に付いている名前が、そのまま公開 API の名前です。

\`\`\`tsx
import { ApplicationButton } from 'application-ui-kit'
\`\`\`

## ここに載せないもの

- 状態や Props の全パターン（各 Overview にある）
- 複数コンポーネントを組み合わせた画面（\`Patterns\` にある）
- 色・文字・余白のトークン（\`Foundations\` にある）
        `,
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

type Request = { id: number; code: string; title: string; status: "new" | "active" | "done" };

const STATUS_LABEL: Record<Request["status"], string> = {
  new: "未対応",
  active: "対応中",
  done: "完了",
};

const ROWS: Request[] = [
  { id: 1, code: "SYS-2026-0001", title: "備品購入（モニター 2 台）", status: "new" },
  { id: 2, code: "SYS-2026-0002", title: "出張費精算（大阪）", status: "active" },
  { id: 3, code: "SYS-2026-0003", title: "書籍購入", status: "done" },
];

const COLUMNS: ApplicationTableColumn<Request>[] = [
  { key: "code", header: "申請番号", className: "w-36", cell: (r) => r.code },
  { key: "title", header: "件名", cell: (r) => r.title },
  {
    key: "status",
    header: "ステータス",
    className: "w-24",
    cell: (r) => <ApplicationBadge tone={r.status}>{STATUS_LABEL[r.status]}</ApplicationBadge>,
  },
];

const PRIORITIES = [
  { value: "high", label: "高" },
  { value: "mid", label: "中" },
  { value: "low", label: "低" },
];

const SHOPS = [
  { value: "1001", label: "本店", badge: "1001" },
  { value: "1002", label: "北営業所", badge: "1002" },
  { value: "1003", label: "南営業所", badge: "1003" },
];

/**
 * UI Kit の全体像。
 *
 * 役割ごとにまとめてある。各見本のラベルが公開 API の名前。
 */
export const AllComponents: Story = {
  render: () => {
    const [dialog, setDialog] = React.useState<"dialog" | "confirm" | "form" | null>(null);
    const [page, setPage] = React.useState(2);

    return (
      <Showcase className="max-w-none">
        <Section
          title="Actions"
          note="操作の意味は色で表す。削除は danger、キャンセルは secondary。primary は 1 画面に 1 つ。"
        >
          <Grid className="sm:grid-cols-3">
            <Labeled label="ApplicationButton">
              <Cluster>
                <ApplicationButton>保存</ApplicationButton>
                <ApplicationButton variant="secondary">キャンセル</ApplicationButton>
                <ApplicationButton variant="danger">削除</ApplicationButton>
              </Cluster>
            </Labeled>
            <Labeled label="ApplicationButtonGroup">
              <ApplicationButtonGroup
                items={[
                  { value: "day", label: "日" },
                  { value: "week", label: "週" },
                  { value: "month", label: "月" },
                ]}
                defaultValue="week"
                size="sm"
                aria-label="期間"
              />
            </Labeled>
            <Labeled label="ApplicationDropdown">
              <ApplicationDropdown
                trigger={
                  <ApplicationButton variant="secondary" size="icon" aria-label="操作メニュー">
                    <MoreVertical className="w-4 h-4" />
                  </ApplicationButton>
                }
                items={[
                  { key: "edit", label: "編集" },
                  { key: "duplicate", label: "複製" },
                  { key: "delete", label: "削除", danger: true, separatorBefore: true },
                ]}
              />
            </Labeled>
            <Labeled label="ApplicationThemeToggle">
              <ApplicationThemeToggle />
            </Labeled>
          </Grid>
        </Section>

        <Section
          title="Inputs"
          note="ラベル・必須・エラーは ApplicationFormField が持つ。入力部品に直接書かない。"
        >
          <Grid className="sm:grid-cols-2 lg:grid-cols-3">
            <Labeled label="ApplicationInput">
              <ApplicationInput placeholder="例: 備品購入の申請" aria-label="件名" />
            </Labeled>
            <Labeled label="ApplicationSearchInput">
              <ApplicationSearchInput placeholder="件名で検索" aria-label="検索" />
            </Labeled>
            <Labeled label="ApplicationSelect">
              <ApplicationSelect items={PRIORITIES} placeholder="優先度を選択" aria-label="優先度" />
            </Labeled>
            <Labeled label="ApplicationCombobox">
              <ApplicationCombobox items={SHOPS} placeholder="店舗を選択" aria-label="店舗" />
            </Labeled>
            <Labeled label="ApplicationDatePicker">
              <ApplicationDatePicker mode="single" placeholder="日付を選択" />
            </Labeled>
            <Labeled label="Textarea（shadcn/ui）">
              <Textarea placeholder="申請の内容" aria-label="内容" rows={2} />
            </Labeled>
            <Labeled label="ApplicationCheckbox">
              <Stack className="space-y-2">
                <ApplicationCheckbox label="メール通知を受け取る" defaultChecked />
                <ApplicationCheckbox label="社内にも共有する" />
              </Stack>
            </Labeled>
            <Labeled label="ApplicationRadioGroup">
              <ApplicationRadioGroup items={PRIORITIES} defaultValue="mid" orientation="horizontal" />
            </Labeled>
            <Labeled label="ApplicationFormField">
              <ApplicationFormField label="件名" required error="件名は必須です">
                <ApplicationInput error defaultValue="" />
              </ApplicationFormField>
            </Labeled>
          </Grid>
        </Section>

        <Section title="Feedback" note="結果はトースト、確認はダイアログ、進行中はスピナー。使い分けを固定する。">
          <Grid className="sm:grid-cols-2 lg:grid-cols-3">
            <Labeled label="ApplicationToast">
              <Cluster>
                <ApplicationButton
                  variant="secondary"
                  size="sm"
                  onClick={() => ApplicationToast.success("保存しました")}
                >
                  成功
                </ApplicationButton>
                <ApplicationButton
                  variant="secondary"
                  size="sm"
                  onClick={() => ApplicationToast.error("保存に失敗しました", "再試行してください")}
                >
                  失敗
                </ApplicationButton>
              </Cluster>
            </Labeled>
            <Labeled label="ApplicationDialog / ConfirmDialog / FormDialog">
              <Cluster>
                <ApplicationButton variant="secondary" size="sm" onClick={() => setDialog("dialog")}>
                  詳細
                </ApplicationButton>
                <ApplicationButton variant="secondary" size="sm" onClick={() => setDialog("confirm")}>
                  確認
                </ApplicationButton>
                <ApplicationButton variant="secondary" size="sm" onClick={() => setDialog("form")}>
                  入力
                </ApplicationButton>
              </Cluster>
            </Labeled>
            <Labeled label="Spinner / Progress（shadcn/ui）">
              <div className="space-y-3">
                <span className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Spinner />
                  読み込み中...
                </span>
                <Progress value={64}>
                  <ProgressTrack>
                    <ProgressIndicator />
                  </ProgressTrack>
                </Progress>
              </div>
            </Labeled>
          </Grid>
        </Section>

        <Section title="Data Display" note="一覧は 0 件のときの表示まで含めて 1 つの部品として考える。">
          <div className="space-y-4">
            <Labeled label="ApplicationTable">
              <ApplicationTable<Request>
                columns={COLUMNS}
                rows={ROWS}
                rowKey={(r) => r.id}
                caption="申請の一覧"
              />
            </Labeled>
            <Grid className="sm:grid-cols-3">
              <Labeled label="ApplicationBadge">
                <Cluster>
                  <ApplicationBadge tone="new">未対応</ApplicationBadge>
                  <ApplicationBadge tone="active">対応中</ApplicationBadge>
                  <ApplicationBadge tone="done">完了</ApplicationBadge>
                  <ApplicationBadge tone="danger">却下</ApplicationBadge>
                </Cluster>
              </Labeled>
              <Labeled label="ApplicationPagination">
                <ApplicationPagination page={page} totalPages={10} onPageChange={setPage} />
              </Labeled>
              <Labeled label="Card（shadcn/ui）">
                <Card>
                  <CardHeader>
                    <CardTitle>承認待ち</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-semibold text-foreground">12</p>
                    <p className="text-xs text-muted-foreground">件</p>
                  </CardContent>
                </Card>
              </Labeled>
              <Labeled label="Item（shadcn/ui）">
                <Item>
                  <ItemMedia variant="icon">
                    <FileText />
                  </ItemMedia>
                  <ItemContent>
                    <ItemTitle>備品購入（モニター 2 台）</ItemTitle>
                    <ItemDescription>山田 太郎 / 2026-04-20</ItemDescription>
                  </ItemContent>
                </Item>
              </Labeled>
              <Labeled label="Label / Separator（shadcn/ui）">
                <div className="space-y-2">
                  <Label>申請区分</Label>
                  <Separator />
                  <p className="text-sm text-muted-foreground">備品購入</p>
                </div>
              </Labeled>
            </Grid>
          </div>
        </Section>

        <Section title="Navigation" note="同一画面の切り替えはタブ、画面遷移はナビゲーション。混ぜない。">
          <Grid>
            <Labeled label="ApplicationTabs">
              <ApplicationTabs
                items={[
                  {
                    value: "overview",
                    label: "概要",
                    content: <p className="text-sm text-foreground">概要の内容。</p>,
                  },
                  {
                    value: "history",
                    label: "履歴",
                    content: <p className="text-sm text-foreground">変更履歴。</p>,
                  },
                ]}
              />
            </Labeled>
            <Labeled label="ApplicationNavItem">
              <div className="w-56 space-y-1 rounded-xl border border-border bg-card p-2">
                <ApplicationNavItem
                  href="#"
                  active
                  icon={<FileText className="w-4 h-4" />}
                  label="申請一覧"
                  badge={12}
                />
                <ApplicationNavItem href="#" icon={<Calendar className="w-4 h-4" />} label="予定" />
                <ApplicationNavItem href="#" icon={<Search className="w-4 h-4" />} label="検索" />
              </div>
            </Labeled>
          </Grid>
        </Section>

        <Section title="Empty State" note="0 件は必ず文章で伝え、次にできる操作を添える。">
          <Grid>
            <Labeled label="Empty（shadcn/ui）">
              <Card>
                <CardContent>
                  <Empty>
                    <EmptyHeader>
                      <EmptyMedia variant="icon">
                        <FileText />
                      </EmptyMedia>
                      <EmptyTitle>まだ申請がありません</EmptyTitle>
                      <EmptyDescription>
                        最初の申請を作成すると、ここに一覧が表示されます。
                      </EmptyDescription>
                    </EmptyHeader>
                    <EmptyContent>
                      <ApplicationButton leftIcon={<Plus className="w-4 h-4" />}>
                        新規申請
                      </ApplicationButton>
                    </EmptyContent>
                  </Empty>
                </CardContent>
              </Card>
            </Labeled>
            <Labeled label="ApplicationTable（0 件）">
              <ApplicationTable<Request>
                columns={COLUMNS}
                rows={[]}
                emptyMessage="申請がありません"
                emptySubMessage="「新規申請」から作成してください"
                caption="申請の一覧（0 件）"
              />
            </Labeled>
          </Grid>
        </Section>

        <ApplicationDialog
          open={dialog === "dialog"}
          onOpenChange={(next) => !next && setDialog(null)}
          title="申請の詳細"
          description="内容を確認してください"
          onConfirm={() => setDialog(null)}
          onCancel={() => setDialog(null)}
        >
          <p className="text-sm text-muted-foreground">申請番号 SYS-2026-0001 の内容です。</p>
        </ApplicationDialog>

        <ApplicationConfirmDialog
          open={dialog === "confirm"}
          onOpenChange={(next) => !next && setDialog(null)}
          type="danger"
          title="申請の削除"
          message="この申請を削除します。削除すると元に戻せません。"
          confirmText="削除する"
          onConfirm={() => setDialog(null)}
        />

        <ApplicationFormDialog
          open={dialog === "form"}
          onOpenChange={(next) => !next && setDialog(null)}
          title="新規申請の作成"
          onSubmit={(event) => {
            event.preventDefault();
            setDialog(null);
          }}
          onCancel={() => setDialog(null)}
        >
          <ApplicationFormField label="件名" required>
            <ApplicationInput name="title" placeholder="例: 備品購入の申請" />
          </ApplicationFormField>
          <ApplicationFormField label="優先度" required>
            <ApplicationSelect name="priority" items={PRIORITIES} placeholder="優先度を選択" />
          </ApplicationFormField>
        </ApplicationFormDialog>
      </Showcase>
    );
  },
};