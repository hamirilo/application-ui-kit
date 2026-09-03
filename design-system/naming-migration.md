# 旧名 → 新名の移行（v6.2.0）

公開APIから `Application` 接頭辞を撤廃しました。判断の経緯は
[decisions/adr-0006](../decisions/adr-0006-drop-application-prefix.md) を正とします。

**v6.2.0は非破壊です。** 旧名は `@deprecated` エイリアスとして残っているので、
上げただけでは何も壊れません。移行は各Applicationの都合で進めてください。
**旧名はv7.0.0で削除します。**

## 移行手順

1. `package.json` の `application-ui-kit` を `^6.2.0` へ上げる
2. 下のスクリプトで一括置換する
3. typecheckを通す

## 一括置換スクリプト

`Application` は「アプリケーション」の意味でも書かれているため、
**単純な `s/Application//g` は使わないでください。** 下のスクリプトは
明示マップのみを語境界付きで置換します。

```bash
curl -fsSL https://raw.githubusercontent.com/hamirilo/ui-platform/main/scripts/rename-legacy-names.pl -o /tmp/rename.pl
find src -type f \( -name '*.ts' -o -name '*.tsx' \) -print0 | xargs -0 perl /tmp/rename.pl
```

repositoryをcheckoutしている場合は `scripts/rename-legacy-names.pl` を直接使えます。

## 注意

- **`window.ApplicationToast` は改名していません。** Djangoテンプレート / 素のJSから
  呼ぶ実行時契約で、型で守られないため据え置きです。package の export 名は `toast`
  ですが、グローバルは `window.ApplicationToast` のままです。

  スクリプトが保護するのは次の書き方です。

  ```ts
  window.ApplicationToast.success("ok");          // ドット記法
  window?.ApplicationToast?.success("ok");        // optional chaining
  globalThis.ApplicationToast.success("ok");      // globalThis / self
  (window as any)["ApplicationToast"].success();  // ブラケット記法
  const { ApplicationToast } = window as any;     // window からの分割代入
  const key = "ApplicationToast";                 // 文字列リテラルは常に据え置き
  ```

  **受け側が読み取れない書き方は、そのファイルを書き換えずにエラーで落とします。**

  ```ts
  const w = window as any;
  w.ApplicationToast.success("ok");   // ← これは判別できないので落ちる
  ```

  package の export 名なのかグローバル契約なのかスクリプトからは判別できず、
  誤って書き換えると存在しない `toast` プロパティを見に行きます。`any` キャスト
  経由だとtypecheckも通ってしまい、通知が出なくなるまで気づけません。
  落ちた箇所は `window.ApplicationToast` と直接書くか、
  `import { toast }` へ寄せてから再実行してください。
- `"application-form-success"`（HX-Triggerイベント名）、`.application-form-dialog-body`、
  `application-radio-*` のid接頭辞も契約なので変わりません。
- `ApplicationToast` → **`toast`（小文字）** です。Componentではなく命令型APIの
  オブジェクトなので、shadcn/ui・sonnerと同じ慣習に合わせました。
- **`FieldSet` はshadcn/uiのprimitiveのままです。** `ApplicationFieldSet`
  （`label` / `required` / `error` / `helpText` を取るprops API）の新名は
  `FieldSet` ではなく **`FormFieldSet`** です。同名にすると、既に `FieldSet` を
  primitiveとしてimportしている利用側で実体だけが入れ替わり、`disabled` などの
  propsが黙って落ちます。対になる `FormField` と綴りが揃う名前にしました。

## 対応表

| 旧名 | 新名 |
|---|---|
| `ApplicationActiveIndicatorProps` | `ActiveIndicatorProps` |
| `ApplicationActiveIndicator` | `ActiveIndicator` |
| `ApplicationBadgeProps` | `BadgeProps` |
| `ApplicationBadgeTone` | `BadgeTone` |
| `ApplicationBadge` | `Badge` |
| `ApplicationButtonGroupItem` | `ButtonGroupItem` |
| `ApplicationButtonGroupProps` | `ButtonGroupProps` |
| `ApplicationButtonGroup` | `ButtonGroup` |
| `ApplicationButtonProps` | `ButtonProps` |
| `ApplicationButtonVariant` | `ButtonVariant` |
| `ApplicationButton` | `Button` |
| `ApplicationCheckboxProps` | `CheckboxProps` |
| `ApplicationCheckbox` | `Checkbox` |
| `ApplicationComboboxItem` | `ComboboxItem` |
| `ApplicationComboboxProps` | `ComboboxProps` |
| `ApplicationCombobox` | `Combobox` |
| `ApplicationConfirmDialogProps` | `ConfirmDialogProps` |
| `ApplicationConfirmDialog` | `ConfirmDialog` |
| `ApplicationCopyButtonProps` | `CopyButtonProps` |
| `ApplicationCopyButton` | `CopyButton` |
| `ApplicationCopyResult` | `CopyResult` |
| `ApplicationDatePickerMode` | `DatePickerMode` |
| `ApplicationDatePickerProps` | `DatePickerProps` |
| `ApplicationDatePickerValue` | `DatePickerValue` |
| `ApplicationDatePicker` | `DatePicker` |
| `ApplicationDialogProps` | `DialogProps` |
| `ApplicationDialog` | `Dialog` |
| `ApplicationDropdownItem` | `DropdownItem` |
| `ApplicationDropdownProps` | `DropdownProps` |
| `ApplicationDropdown` | `Dropdown` |
| `ApplicationFieldSetProps` | `FormFieldSetProps` |
| `ApplicationFieldSet` | `FormFieldSet` |
| `ApplicationFormDialogProps` | `FormDialogProps` |
| `ApplicationFormDialog` | `FormDialog` |
| `ApplicationFormFieldProps` | `FormFieldProps` |
| `ApplicationFormField` | `FormField` |
| `ApplicationInputProps` | `InputProps` |
| `ApplicationInput` | `Input` |
| `ApplicationNavItemColor` | `NavItemColor` |
| `ApplicationNavItemProps` | `NavItemProps` |
| `ApplicationNavItem` | `NavItem` |
| `ApplicationPaginationProps` | `PaginationProps` |
| `ApplicationPagination` | `Pagination` |
| `ApplicationRadioGroupItem` | `RadioGroupItem` |
| `ApplicationRadioGroupProps` | `RadioGroupProps` |
| `ApplicationRadioGroupVariant` | `RadioGroupVariant` |
| `ApplicationRadioGroup` | `RadioGroup` |
| `ApplicationRadioTableProps` | `RadioTableProps` |
| `ApplicationRadioTable` | `RadioTable` |
| `ApplicationScopeSearchItem` | `ScopeSearchItem` |
| `ApplicationScopeSearchProps` | `ScopeSearchProps` |
| `ApplicationScopeSearch` | `ScopeSearch` |
| `ApplicationSearchInputProps` | `SearchInputProps` |
| `ApplicationSearchInput` | `SearchInput` |
| `ApplicationSelectItem` | `SelectItem` |
| `ApplicationSelectProps` | `SelectProps` |
| `ApplicationSelect` | `Select` |
| `ApplicationTabItem` | `TabItem` |
| `ApplicationTableColumn` | `TableColumn` |
| `ApplicationTableProps` | `TableProps` |
| `ApplicationTable` | `Table` |
| `ApplicationTabsProps` | `TabsProps` |
| `ApplicationTabs` | `Tabs` |
| `ApplicationThemeToggleProps` | `ThemeToggleProps` |
| `ApplicationThemeToggle` | `ThemeToggle` |
| `ApplicationToaster` | `Toaster` |
| `ApplicationToastOptions` | `ToastOptions` |
| `ApplicationToastType` | `ToastType` |
| `ApplicationToast` | `toast` |
| `ApplicationTreeSelectItem` | `TreeSelectItem` |
| `ApplicationTreeSelectProps` | `TreeSelectProps` |
| `ApplicationTreeSelect` | `TreeSelect` |
| `APPLICATION_COMBOBOX_CREATE_PREFIX` | `COMBOBOX_CREATE_PREFIX` |
