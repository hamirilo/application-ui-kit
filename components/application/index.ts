/**
 * Application UI Kit Library - 共有 UI コンポーネントライブラリ
 *
 * shadcn/ui（Base UI ベース / gen3）を土台にした共有 UI コンポーネント群です。
 *
 * 公開 API は 2 種類あります。
 *
 *   1. Application* — このリポジトリが API を設計したもの。
 *      items 配列や columns/rows のような props API、非同期ダイアログ、
 *      日本語の既定ラベルなど、shadcn/ui にない value を持つものだけを置きます。
 *
 *   2. shadcn/ui の名前のまま re-export しているもの（Card / Spinner / Textarea 等）。
 *      ラップする理由がないため、素の shadcn/ui をそのまま公開しています。
 *      使い方は https://ui.shadcn.com/docs/components を参照してください。
 *
 * 各コンポーネントの仕様・使用例・使わない場面は Storybook を参照してください。
 *   bun run storybook
 *
 * <important>
 * このファイルが配布物のエントリです。ここに export を追加したら、
 * その .tsx と下請け（components/ui/*）が同じコミットに含まれていることを
 * 確認してください。`bun run build` が通らない export は publish できません。
 * </important>
 */

/* ==========================================================================
 * Application* — このリポジトリが API を設計したもの
 * ========================================================================== */

export { ApplicationButton } from "./ApplicationButton";
export type { ApplicationButtonProps, ApplicationButtonVariant } from "./ApplicationButton";

export { ApplicationDialog } from "./ApplicationDialog";
export type { ApplicationDialogProps } from "./ApplicationDialog";

export { ApplicationConfirmDialog } from "./ApplicationConfirmDialog";
export type { ApplicationConfirmDialogProps } from "./ApplicationConfirmDialog";

export { ApplicationFormDialog } from "./ApplicationFormDialog";
export type { ApplicationFormDialogProps } from "./ApplicationFormDialog";

export { ApplicationToast, ApplicationToaster } from "./ApplicationToast";
export type { ApplicationToastOptions, ApplicationToastType } from "./ApplicationToast";

export { ApplicationDropdown } from "./ApplicationDropdown";
export type { ApplicationDropdownProps, ApplicationDropdownItem } from "./ApplicationDropdown";

export { ApplicationDatePicker } from "./ApplicationDatePicker";
export type {
  ApplicationDatePickerProps,
  ApplicationDatePickerMode,
  ApplicationDatePickerValue,
} from "./ApplicationDatePicker";

export { ApplicationInput } from "./ApplicationInput";
export type { ApplicationInputProps } from "./ApplicationInput";

export { ApplicationSelect } from "./ApplicationSelect";
export type { ApplicationSelectProps, ApplicationSelectItem } from "./ApplicationSelect";

export {
  ApplicationCombobox,
  APPLICATION_COMBOBOX_CREATE_PREFIX,
  splitCreatedValues,
} from "./ApplicationCombobox";
export type { ApplicationComboboxProps, ApplicationComboboxItem } from "./ApplicationCombobox";

export { ApplicationTreeSelect, findTreePath } from "./ApplicationTreeSelect";
export type {
  ApplicationTreeSelectProps,
  ApplicationTreeSelectItem,
} from "./ApplicationTreeSelect";

export { ApplicationCheckbox } from "./ApplicationCheckbox";
export type { ApplicationCheckboxProps } from "./ApplicationCheckbox";

export { ApplicationButtonGroup } from "./ApplicationButtonGroup";
export type {
  ApplicationButtonGroupProps,
  ApplicationButtonGroupItem,
} from "./ApplicationButtonGroup";

export { ApplicationTable } from "./ApplicationTable";
export type { ApplicationTableProps, ApplicationTableColumn } from "./ApplicationTable";

export { ApplicationFormField } from "./ApplicationFormField";
export type { ApplicationFormFieldProps } from "./ApplicationFormField";

export { ApplicationTabs } from "./ApplicationTabs";
export type { ApplicationTabsProps, ApplicationTabItem } from "./ApplicationTabs";

export { ApplicationPagination } from "./ApplicationPagination";
export type { ApplicationPaginationProps } from "./ApplicationPagination";

export { ApplicationBadge } from "./ApplicationBadge";
export type { ApplicationBadgeProps, ApplicationBadgeTone } from "./ApplicationBadge";

export { ApplicationRadioGroup } from "./ApplicationRadioGroup";
export type {
  ApplicationRadioGroupProps,
  ApplicationRadioGroupItem,
  ApplicationRadioGroupVariant,
} from "./ApplicationRadioGroup";

export { ApplicationRadioTable } from "./ApplicationRadioTable";
export type { ApplicationRadioTableProps } from "./ApplicationRadioTable";

export { ApplicationSearchInput } from "./ApplicationSearchInput";
export type { ApplicationSearchInputProps } from "./ApplicationSearchInput";

export { ApplicationScopeSearch } from "./ApplicationScopeSearch";
export type {
  ApplicationScopeSearchProps,
  ApplicationScopeSearchItem,
} from "./ApplicationScopeSearch";

export { ApplicationNavItem } from "./ApplicationNavItem";
export type { ApplicationNavItemProps, ApplicationNavItemColor } from "./ApplicationNavItem";

export { ApplicationActiveIndicator } from "./ApplicationActiveIndicator";
export type { ApplicationActiveIndicatorProps } from "./ApplicationActiveIndicator";

export { ApplicationThemeToggle } from "./ApplicationThemeToggle";
export type { ApplicationThemeToggleProps } from "./ApplicationThemeToggle";

/* ==========================================================================
 * shadcn/ui をそのまま公開しているもの
 *
 * ラップしても足せる value がないため、素の shadcn/ui を re-export します。
 * ここに並ぶものは https://ui.shadcn.com/docs/components と同じ API です。
 * 独自の振る舞いが必要になった時点で Application* に昇格させてください。
 * ========================================================================== */

export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardContent,
  CardFooter,
} from "../ui/card";
export { Spinner } from "../ui/spinner";
export { Textarea } from "../ui/textarea";
export {
  Progress,
  ProgressTrack,
  ProgressIndicator,
  ProgressLabel,
  ProgressValue,
} from "../ui/progress";
export {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
  EmptyMedia,
} from "../ui/empty";
export {
  Item,
  ItemGroup,
  ItemMedia,
  ItemContent,
  ItemTitle,
  ItemDescription,
  ItemActions,
  ItemHeader,
  ItemFooter,
  ItemSeparator,
} from "../ui/item";
export {
  Field,
  FieldSet,
  FieldLegend,
  FieldGroup,
  FieldLabel,
  FieldTitle,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldSeparator,
} from "../ui/field";
export { Label } from "../ui/label";
export { Separator } from "../ui/separator";
