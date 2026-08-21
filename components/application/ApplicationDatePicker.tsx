/**
 * ApplicationDatePicker - 共有 UI ライブラリの日付選択コンポーネント
 *
 * shadcn/ui の Calendar（react-day-picker）+ Popover をラップし、
 * 単一日付選択（mode="single"）・日付範囲選択（mode="range"）・
 * 複数日選択（mode="multiple"）を提供します。
 * 画面側では ApplicationDatePicker のみを使用し、Calendar/Popover を直接使用しないでください。
 */

import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import * as React from "react";
import type { DateRange } from "react-day-picker";

import { cn } from "../../lib/utils";
import { Calendar } from "../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

const DISPLAY_FORMAT = "yyyy年M月d日";
const SHORT_FORMAT = "M/d";

/** multiple モードでトリガーに列挙する最大日数（超過分は「他N件」に畳む） */
const MULTIPLE_LABEL_LIMIT = 3;

export type ApplicationDatePickerMode = "single" | "range" | "multiple";
export type ApplicationDatePickerValue = Date | DateRange | Date[];

export interface ApplicationDatePickerProps {
  /**
   * 選択モード
   * - single: 単一日付選択
   * - range: 日付範囲選択（開始日〜終了日）
   * - multiple: 複数日選択（連続でない日付を任意の件数だけ選ぶ）
   */
  mode?: ApplicationDatePickerMode;

  /**
   * 選択中の値
   * - mode="single" のとき Date
   * - mode="range" のとき DateRange
   * - mode="multiple" のとき Date[]
   */
  value?: ApplicationDatePickerValue;

  /**
   * 値変更時のコールバック
   */
  onChange?: (value: ApplicationDatePickerValue | undefined) => void;

  /**
   * 未選択時のプレースホルダー
   */
  placeholder?: string;

  /**
   * 無効化
   */
  disabled?: boolean;

  /**
   * 選択可能な最小日付
   */
  minDate?: Date;

  /**
   * 選択可能な最大日付
   */
  maxDate?: Date;

  /**
   * トリガーボタンの追加クラス
   */
  className?: string;
}

function formatValue(
  mode: ApplicationDatePickerMode,
  value?: ApplicationDatePickerValue,
): string | null {
  if (!value) return null;

  if (mode === "multiple") {
    const dates = value as Date[];
    if (!dates.length) return null;
    const sorted = [...dates].sort((a, b) => a.getTime() - b.getTime());
    const shown = sorted
      .slice(0, MULTIPLE_LABEL_LIMIT)
      .map((d) => format(d, SHORT_FORMAT, { locale: ja }))
      .join(", ");
    const rest = sorted.length - MULTIPLE_LABEL_LIMIT;
    const detail = rest > 0 ? `${shown} 他${rest}件` : shown;
    return `${sorted.length}日選択（${detail}）`;
  }

  if (mode === "range") {
    const range = value as DateRange;
    if (!range.from) return null;
    const fromLabel = format(range.from, DISPLAY_FORMAT, { locale: ja });
    if (!range.to) return `${fromLabel} 〜`;
    return `${fromLabel} 〜 ${format(range.to, DISPLAY_FORMAT, { locale: ja })}`;
  }

  return format(value as Date, DISPLAY_FORMAT, { locale: ja });
}

/**
 * ApplicationDatePicker コンポーネント
 *
 * @example
 * ```tsx
 * // 単一日付選択
 * const [date, setDate] = useState<Date>()
 * <ApplicationDatePicker mode="single" value={date} onChange={(v) => setDate(v as Date)} />
 *
 * // 日付範囲選択
 * const [range, setRange] = useState<DateRange>()
 * <ApplicationDatePicker mode="range" value={range} onChange={(v) => setRange(v as DateRange)} />
 *
 * // 複数日選択（日程調整の候補日など）
 * const [dates, setDates] = useState<Date[]>([])
 * <ApplicationDatePicker mode="multiple" value={dates} onChange={(v) => setDates((v as Date[]) ?? [])} />
 * ```
 */
export function ApplicationDatePicker({
  mode = "single",
  value,
  onChange,
  placeholder = "日付を選択",
  disabled = false,
  minDate,
  maxDate,
  className,
}: ApplicationDatePickerProps) {
  const [open, setOpen] = React.useState(false);
  const label = formatValue(mode, value);

  const dateLimits = [
    ...(minDate ? [{ before: minDate }] : []),
    ...(maxDate ? [{ after: maxDate }] : []),
  ];
  const disabledMatcher = dateLimits.length > 0 ? dateLimits : undefined;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        disabled={disabled}
        data-empty={!label}
        className={cn(
          "input-field flatpickr-input inline-flex items-center gap-2 text-left",
          "data-[empty=true]:text-muted-foreground",
          className,
        )}
        render={<button type="button" />}
      >
        <CalendarIcon className="h-4 w-4 shrink-0 text-muted-foreground" />
        <span className="truncate">{label ?? placeholder}</span>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        {mode === "multiple" ? (
          // multiple は連続選択させるため、選択後も Popover を閉じない
          <Calendar
            mode="multiple"
            locale={ja}
            selected={value as Date[] | undefined}
            onSelect={(dates) => onChange?.(dates)}
            disabled={disabledMatcher}
            numberOfMonths={2}
            defaultMonth={(value as Date[] | undefined)?.[0]}
          />
        ) : mode === "range" ? (
          <Calendar
            mode="range"
            locale={ja}
            selected={value as DateRange | undefined}
            onSelect={(range) => onChange?.(range)}
            disabled={disabledMatcher}
            numberOfMonths={2}
            defaultMonth={(value as DateRange | undefined)?.from}
          />
        ) : (
          <Calendar
            mode="single"
            locale={ja}
            selected={value as Date | undefined}
            onSelect={(date) => {
              onChange?.(date);
              setOpen(false);
            }}
            disabled={disabledMatcher}
            defaultMonth={value as Date | undefined}
          />
        )}
      </PopoverContent>
    </Popover>
  );
}

ApplicationDatePicker.displayName = "ApplicationDatePicker";
