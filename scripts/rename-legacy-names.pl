#!/usr/bin/env perl
#
# application-ui-kit v6.2.0: 旧名（Application* 接頭辞つき）を新名へ置換する。
#
#   find src -type f \( -name '*.ts' -o -name '*.tsx' \) -print0 \
#     | xargs -0 perl scripts/rename-legacy-names.pl
#
# 明示マップのみを語境界付きで置換するので、「Application側」「Application固有」
# のような散文や、package 名 application-ui-kit には当たらない。
#
# <important>
# `ApplicationToast` は 2 つの別物を指す。
#
#   1. package の export 名 → 新名は `toast`。置換する。
#   2. `window.ApplicationToast` のグローバル → **改名していない。** Django
#      テンプレート / 素の JS と共有する実行時契約で、型でもコンパイラでも
#      守られない。置換してはいけない。
#
# 判別は文面からしか行えないため、この script は次の 3 段構えにしている。
#
#   a. 2 と分かる書き方（文字列リテラル、window/globalThis/self 経由の
#      プロパティアクセスと分割代入）を退避して守る
#   b. どちらとも判別できない書き方（受け側の分からない `w.ApplicationToast`
#      など）を検出したら、**そのファイルを書き換えずにエラーで落とす**
#   c. 残った素の識別子だけを置換する
#
# b を黙って通すと、グローバル契約が存在しない `toast` プロパティへ書き換わり、
# `any` キャスト経由だと typecheck も通ってしまって実行時まで露見しない。
# 対応表と挙動は scripts/rename-legacy-names.test.ts で固定している。
# </important>
#
# 対応表: design-system/naming-migration.md
use strict;
use warnings;

my %map = (
    ApplicationToast => 'toast',

    # 接頭辞を外すだけだと `FieldSet` になるが、その名前は shadcn/ui の
    # primitive が公開APIとして持っている。同名にすると実体だけが入れ替わる。
    # decisions/adr-0006 の「改訂」を参照。
    ApplicationFieldSet      => 'FormFieldSet',
    ApplicationFieldSetProps => 'FormFieldSetProps',

    APPLICATION_COMBOBOX_CREATE_PREFIX => 'COMBOBOX_CREATE_PREFIX',
);

# 残りは接頭辞を除去するだけ
for my $old (
    qw(
    ApplicationActiveIndicator ApplicationActiveIndicatorProps
    ApplicationBadge ApplicationBadgeProps ApplicationBadgeTone
    ApplicationButton ApplicationButtonProps ApplicationButtonVariant
    ApplicationButtonGroup ApplicationButtonGroupItem ApplicationButtonGroupProps
    ApplicationCheckbox ApplicationCheckboxProps
    ApplicationCombobox ApplicationComboboxItem ApplicationComboboxProps
    ApplicationConfirmDialog ApplicationConfirmDialogProps
    ApplicationCopyButton ApplicationCopyButtonProps ApplicationCopyResult
    ApplicationDatePicker ApplicationDatePickerMode ApplicationDatePickerProps
    ApplicationDatePickerValue
    ApplicationDialog ApplicationDialogProps
    ApplicationDropdown ApplicationDropdownItem ApplicationDropdownProps
    ApplicationFormDialog ApplicationFormDialogProps
    ApplicationFormField ApplicationFormFieldProps
    ApplicationInput ApplicationInputProps
    ApplicationNavItem ApplicationNavItemColor ApplicationNavItemProps
    ApplicationPagination ApplicationPaginationProps
    ApplicationRadioGroup ApplicationRadioGroupItem ApplicationRadioGroupProps
    ApplicationRadioGroupVariant
    ApplicationRadioTable ApplicationRadioTableProps
    ApplicationScopeSearch ApplicationScopeSearchItem ApplicationScopeSearchProps
    ApplicationSearchInput ApplicationSearchInputProps
    ApplicationSelect ApplicationSelectItem ApplicationSelectProps
    ApplicationTabItem ApplicationTabs ApplicationTabsProps
    ApplicationTable ApplicationTableColumn ApplicationTableProps
    ApplicationThemeToggle ApplicationThemeToggleProps
    ApplicationToaster ApplicationToastOptions ApplicationToastType
    ApplicationTreeSelect ApplicationTreeSelectItem ApplicationTreeSelectProps
    )
  )
{
    ( my $new = $old ) =~ s/^Application//;
    $map{$old} = $new;
}

# 長い名前から当てる。語境界も付けるので二重の保険。
my @keys = sort { length($b) <=> length($a) } keys %map;

# グローバル契約の受け側として認識する名前。
my $GLOBAL_ROOT = qr/(?:window|globalThis|self)/;

# `window.ApplicationToast` として守る書き方。
#
# 文字列リテラルは中身が名前そのものなので、どこに現れても書き換えない
# （`window["ApplicationToast"]` もこれで守られる）。`ApplicationToastOptions`
# のような別の名前は閉じ引用符の位置が違うため、この pattern に当たらない。
my @KEEP = (
    qr/(['"`])ApplicationToast\1/,
    qr/\(?\s*$GLOBAL_ROOT\s*(?:as\s+[A-Za-z_\$][\w\$]*\s*)?\)?\s*(?:\?\.|\.)\s*ApplicationToast\b/,
    qr/\{[^{}]*\bApplicationToast\b[^{}]*\}\s*=\s*\(?\s*$GLOBAL_ROOT\b/,
);

# 退避しきれなかった `ApplicationToast` のうち、package の export 名なのか
# グローバル契約なのか判別できない書き方。見つけたら落とす。
my @AMBIGUOUS = (
    [
        qr/(?:\?\.|\.)\s*ApplicationToast\b/,
        '受け側の分からないプロパティアクセス。window を別名に入れてから使っていませんか',
    ],
    [
        qr/\{[^{}]*\bApplicationToast\b[^{}]*\}\s*=/,
        '受け側の分からない分割代入。window から取り出していませんか',
    ],
);

my ( $files, $hits, $failed ) = ( 0, 0, 0 );

FILE: for my $file (@ARGV) {
    open my $in, '<:encoding(UTF-8)', $file or do { warn "skip $file: $!\n"; next };
    my $text = do { local $/; <$in> };
    close $in;
    my $orig = $text;

    # a. グローバル契約を退避する
    # 退避対象をキャプチャで囲まないこと。`s{($keep)}{...}` にすると外側の
    # group 1 が増え、@KEEP の中の後方参照（引用符の対応）が壊れる。
    my ( $n, @kept ) = (0);
    for my $keep (@KEEP) {
        $text =~ s{$keep}{ push @kept, $&; "\0KEEP" . $n++ . "\0" }ge;
    }

    # b. 判別できない書き方が残っていたら、このファイルは触らない
    #
    # 行ごとに split して当てないこと。formatter が
    #
    #   const {
    #     ApplicationToast
    #   } = getGlobals();
    #
    # のように折ると、`{`〜`}` と `=` が同じ行に載らず検出をすり抜ける。
    # すり抜けると素の識別子として `toast` へ書き換わり、**黙って部分変換される**
    # という防ぎたかった壊れ方そのものになる。全文へ当てて、行番号は
    # match位置から数える。
    my @problems;
    for my $rule (@AMBIGUOUS) {
        my ( $pattern, $why ) = @$rule;
        while ( $text =~ /$pattern/g ) {
            my $line = 1 + ( substr( $text, 0, $-[0] ) =~ tr/\n// );

            # 複数行に跨る match はそのまま出すと読みにくいので 1 行へ畳む。
            ( my $shown = $& ) =~ s/\s+/ /g;
            $shown =~ s{\0KEEP(\d+)\0}{$kept[$1]}g;
            push @problems, sprintf( "%s:%d: %s\n      → %s", $file, $line, $shown, $why );
        }
    }
    if (@problems) {
        warn "!! $file は書き換えませんでした（ApplicationToast の判別ができません）\n";
        warn "   $_\n" for @problems;
        $failed++;
        next FILE;
    }

    # c. 残りを置換する
    my $count = 0;
    for my $old (@keys) {
        $count += ( $text =~ s/\b\Q$old\E\b/$map{$old}/g );
    }

    $text =~ s{\0KEEP(\d+)\0}{$kept[$1]}g;
    next if $text eq $orig;

    open my $out, '>:encoding(UTF-8)', $file or die "write $file: $!";
    print {$out} $text;
    close $out;
    $files++;
    $hits += $count;
    printf "  %-64s %d\n", $file, $count;
}

printf "\n%d files, %d replacements\n", $files, $hits;

if ($failed) {
    printf STDERR <<'MSG', $failed;

%d 個のファイルを書き換えませんでした。

`window.ApplicationToast` はグローバルの実行時契約なので改名していません。
上に挙げた箇所は、package の export 名（→ `toast`）なのかグローバル契約なのかを
script が判別できません。次のどちらかへ書き換えてから再実行してください。

  グローバルを指している場合   window.ApplicationToast … と直接書く
  package の export を指す場合  import { toast } from "application-ui-kit"

詳細: design-system/naming-migration.md
MSG
    exit 1;
}
