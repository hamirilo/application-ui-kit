/**
 * v6.1 の公開surfaceがそのままcompileできることを固定するfixture。
 *
 * <important>
 * ここは「動くコード」ではなく **型の砦** で、実行されない。目的は 1 つだけ:
 * **名前は同じまま実体が入れ替わる semantic break を typecheck で落とすこと。**
 *
 * v6.2.0 で実際に起きた事故がこれだった。`FieldSet` はそれまで shadcn/ui の
 * primitive（素の `<fieldset>` propsを通す合成API）を指していたが、
 * props API 版のwrapperを同じ名前へ割り当ててしまった。import文は変わらず、
 * export名の一覧も変わらないため、
 *
 *   - `components/application/index.test.ts`（export名の存在を見る）
 *   - `scripts/fixtures/consumer`（実行時に export が引けるかを見る）
 *
 * のどちらも通ってしまい、CIで捕まらなかった。**存在の確認では足りない。**
 * 6.1 の利用側と同じ書き方をここでcompileさせるのが唯一の検出手段になる。
 * 経緯は decisions/adr-0006 の「改訂」を正とする。
 * </important>
 *
 * 追加・変更のしかた:
 *
 *   - **v6.1 に存在した名前をここから消してはいけない。** 消すと砦が無くなる。
 *     v7.0.0 で旧名を削除するときに、このfixtureごと入れ替える。
 *   - 新しく増えた名前はここへ足さない。ここは 6.1 の surface を写したもの。
 *   - primitive はJSXで組んで確認する（合成APIの形が壊れると落ちる）。
 *   - wrapper は props 型との対応で確認する（実体が差し替わると落ちる）。
 */

import type * as React from "react";

import {
  APPLICATION_COMBOBOX_CREATE_PREFIX,
  ApplicationActiveIndicator,
  ApplicationBadge,
  ApplicationButton,
  ApplicationButtonGroup,
  ApplicationCheckbox,
  ApplicationCombobox,
  ApplicationConfirmDialog,
  ApplicationCopyButton,
  ApplicationDatePicker,
  ApplicationDialog,
  ApplicationDropdown,
  ApplicationFieldSet,
  ApplicationFormDialog,
  ApplicationFormField,
  ApplicationInput,
  ApplicationNavItem,
  ApplicationPagination,
  ApplicationRadioGroup,
  ApplicationRadioTable,
  ApplicationScopeSearch,
  ApplicationSearchInput,
  ApplicationSelect,
  ApplicationTable,
  ApplicationTabs,
  ApplicationThemeToggle,
  ApplicationToast,
  ApplicationToaster,
  ApplicationTreeSelect,
  copyTextToClipboard,
  findTreePath,
  splitCreatedValues,
} from "../../../components/application";

import type {
  ApplicationActiveIndicatorProps,
  ApplicationBadgeProps,
  ApplicationBadgeTone,
  ApplicationButtonGroupItem,
  ApplicationButtonGroupProps,
  ApplicationButtonProps,
  ApplicationButtonVariant,
  ApplicationCheckboxProps,
  ApplicationComboboxItem,
  ApplicationComboboxProps,
  ApplicationConfirmDialogProps,
  ApplicationCopyButtonProps,
  ApplicationCopyResult,
  ApplicationDatePickerMode,
  ApplicationDatePickerProps,
  ApplicationDatePickerValue,
  ApplicationDialogProps,
  ApplicationDropdownItem,
  ApplicationDropdownProps,
  ApplicationFieldSetProps,
  ApplicationFormDialogProps,
  ApplicationFormFieldProps,
  ApplicationInputProps,
  ApplicationNavItemColor,
  ApplicationNavItemProps,
  ApplicationPaginationProps,
  ApplicationRadioGroupItem,
  ApplicationRadioGroupProps,
  ApplicationRadioGroupVariant,
  ApplicationRadioTableProps,
  ApplicationScopeSearchItem,
  ApplicationScopeSearchProps,
  ApplicationSearchInputProps,
  ApplicationSelectItem,
  ApplicationSelectProps,
  ApplicationTabItem,
  ApplicationTableColumn,
  ApplicationTableProps,
  ApplicationTabsProps,
  ApplicationThemeToggleProps,
  ApplicationToastOptions,
  ApplicationToastType,
  ApplicationTreeSelectItem,
  ApplicationTreeSelectProps,
} from "../../../components/application";

/* shadcn/ui をそのまま公開しているもの。
 * wrapper と名前空間を取り合うのはこちらなので、JSX で形まで確認する。 */
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldTitle,
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemGroup,
  ItemHeader,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
  Label,
  Progress,
  ProgressIndicator,
  ProgressLabel,
  ProgressTrack,
  ProgressValue,
  Separator,
  Spinner,
  Textarea,
} from "../../../components/application";

/* ==========================================================================
 * wrapper: props 型との対応を固定する
 *
 * `React.ComponentType<XProps>` へ代入できることだけを見る。実体が別物へ
 * 差し替わると props が合わなくなって落ちる。
 * ======================================================================== */

type Component<P> = React.ComponentType<P>;

/* Table / RadioTable はジェネリック。6.1 と同じく行の型を渡して使えることを見る。 */
type Row = { id: string; name: string };

const _activeIndicator: Component<ApplicationActiveIndicatorProps> = ApplicationActiveIndicator;
const _badge: Component<ApplicationBadgeProps> = ApplicationBadge;
const _button: Component<ApplicationButtonProps> = ApplicationButton;
const _buttonGroup: Component<ApplicationButtonGroupProps> = ApplicationButtonGroup;
const _checkbox: Component<ApplicationCheckboxProps> = ApplicationCheckbox;
const _combobox: Component<ApplicationComboboxProps> = ApplicationCombobox;
const _confirmDialog: Component<ApplicationConfirmDialogProps> = ApplicationConfirmDialog;
const _copyButton: Component<ApplicationCopyButtonProps> = ApplicationCopyButton;
const _datePicker: Component<ApplicationDatePickerProps> = ApplicationDatePicker;
const _dialog: Component<ApplicationDialogProps> = ApplicationDialog;
const _dropdown: Component<ApplicationDropdownProps> = ApplicationDropdown;
const _formDialog: Component<ApplicationFormDialogProps> = ApplicationFormDialog;
const _formField: Component<ApplicationFormFieldProps> = ApplicationFormField;
const _input: Component<ApplicationInputProps> = ApplicationInput;
const _navItem: Component<ApplicationNavItemProps> = ApplicationNavItem;
const _pagination: Component<ApplicationPaginationProps> = ApplicationPagination;
const _radioGroup: Component<ApplicationRadioGroupProps> = ApplicationRadioGroup;
const _radioTable: Component<ApplicationRadioTableProps<Row>> = ApplicationRadioTable;
const _scopeSearch: Component<ApplicationScopeSearchProps> = ApplicationScopeSearch;
const _searchInput: Component<ApplicationSearchInputProps> = ApplicationSearchInput;
const _select: Component<ApplicationSelectProps> = ApplicationSelect;
const _tabs: Component<ApplicationTabsProps> = ApplicationTabs;
const _themeToggle: Component<ApplicationThemeToggleProps> = ApplicationThemeToggle;
const _treeSelect: Component<ApplicationTreeSelectProps> = ApplicationTreeSelect;

/* `ApplicationFieldSet` は props API 版のwrapper。単一の子要素を取り、
 * `label` / `required` / `error` / `helpText` を受ける形が 6.1 の契約。
 * ここが primitive（`<fieldset>` の合成API）へ差し替わると落ちる。 */
const _fieldSet: Component<ApplicationFieldSetProps> = ApplicationFieldSet;

const _table: Component<ApplicationTableProps<Row>> = ApplicationTable;
const _tableColumn: ApplicationTableColumn<Row> = {
  key: "name",
  header: "名前",
  cell: (row) => row.name,
};

/* Component ではない export。 */
const _toast: typeof ApplicationToast = ApplicationToast;
const _toaster: typeof ApplicationToaster = ApplicationToaster;
const _createPrefix: string = APPLICATION_COMBOBOX_CREATE_PREFIX;
const _splitCreatedValues: typeof splitCreatedValues = splitCreatedValues;
const _findTreePath: typeof findTreePath = findTreePath;
const _copyTextToClipboard: typeof copyTextToClipboard = copyTextToClipboard;

/* 型だけの export。名前が消えると import で落ちる。 */
type _Types = [
  ApplicationBadgeTone,
  ApplicationButtonGroupItem,
  ApplicationButtonVariant,
  ApplicationComboboxItem,
  ApplicationCopyResult,
  ApplicationDatePickerMode,
  ApplicationDatePickerValue,
  ApplicationDropdownItem,
  ApplicationNavItemColor,
  ApplicationRadioGroupItem,
  ApplicationRadioGroupVariant,
  ApplicationScopeSearchItem,
  ApplicationSelectItem,
  ApplicationTabItem,
  ApplicationToastOptions,
  ApplicationToastType,
  ApplicationTreeSelectItem,
];

/* ==========================================================================
 * primitive: 6.1 と同じ合成APIで組めることを固定する
 *
 * <important>
 * `FieldSet` がここにあることが要点。6.1 の利用側は素の `<fieldset>` として
 * 使えた（`disabled` を渡せる / 子要素を自由に並べられる）。この形が
 * compile できなくなったら、名前が別の実体へ移っている。
 * </important>
 * ======================================================================== */

export function Compat61Surface() {
  return (
    <>
      <FieldSet disabled>
        <FieldLegend>優先度</FieldLegend>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="compat-priority">高</FieldLabel>
            <FieldContent>
              <Textarea id="compat-priority" />
            </FieldContent>
            <FieldDescription>後から変更できます</FieldDescription>
            <FieldError />
          </Field>
          <FieldSeparator />
          <Field>
            <FieldTitle>低</FieldTitle>
          </Field>
        </FieldGroup>
      </FieldSet>

      <Card>
        <CardHeader>
          <CardTitle>タイトル</CardTitle>
          <CardDescription>説明</CardDescription>
          <CardAction>
            <Spinner />
          </CardAction>
        </CardHeader>
        <CardContent>本文</CardContent>
        <CardFooter>フッター</CardFooter>
      </Card>

      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon" />
          <EmptyTitle>データがありません</EmptyTitle>
          <EmptyDescription>条件を変えて検索してください</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>内容</EmptyContent>
      </Empty>

      <ItemGroup>
        <Item>
          <ItemHeader>見出し</ItemHeader>
          <ItemMedia />
          <ItemContent>
            <ItemTitle>件名</ItemTitle>
            <ItemDescription>補足</ItemDescription>
          </ItemContent>
          <ItemActions>操作</ItemActions>
          <ItemFooter>脚注</ItemFooter>
        </Item>
        <ItemSeparator />
      </ItemGroup>

      <Progress value={40}>
        <ProgressLabel>進捗</ProgressLabel>
        <ProgressValue />
        <ProgressTrack>
          <ProgressIndicator />
        </ProgressTrack>
      </Progress>

      <Label htmlFor="compat-priority">ラベル</Label>
      <Separator />
    </>
  );
}

/* 型の砦なので値は使わない。未使用で落とされないよう 1 箇所へまとめて逃がす。 */
export const __compat61 = [
  _activeIndicator,
  _badge,
  _button,
  _buttonGroup,
  _checkbox,
  _combobox,
  _confirmDialog,
  _copyButton,
  _datePicker,
  _dialog,
  _dropdown,
  _fieldSet,
  _formDialog,
  _formField,
  _input,
  _navItem,
  _pagination,
  _radioGroup,
  _radioTable,
  _scopeSearch,
  _searchInput,
  _select,
  _table,
  _tabs,
  _themeToggle,
  _treeSelect,
  _tableColumn,
  _toast,
  _toaster,
  _createPrefix,
  _splitCreatedValues,
  _findTreePath,
  _copyTextToClipboard,
] as const;
