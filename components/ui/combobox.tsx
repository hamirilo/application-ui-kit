import * as React from "react"
import { Combobox as ComboboxPrimitive } from "@base-ui/react/combobox"
import { Check, ChevronDown, X } from "lucide-react"

import { cn } from '../../lib/utils'

const Combobox = ComboboxPrimitive.Root

const ComboboxCollection = ComboboxPrimitive.Collection

const ComboboxValue = ComboboxPrimitive.Value

const ComboboxGroup = ComboboxPrimitive.Group

const ComboboxGroupLabel = ComboboxPrimitive.GroupLabel

/**
 * 入力欄を包む枠。
 *
 * 見た目は SelectTrigger に揃えている（padding / border-radius / border 色 /
 * フォーカスリング）。理由も同じで、同じ画面に select と combobox が並んだときに
 * 段差を出さないため。フォーカスリングは内側の input ではなくこの枠に出す。
 */
const ComboboxFieldset = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<"div"> & { disabled?: boolean; invalid?: boolean }
>(({ className, disabled, invalid, ...props }, ref) => (
  <div
    ref={ref}
    data-disabled={disabled || undefined}
    data-invalid={invalid || undefined}
    className={cn(
      "flex w-full items-center gap-2 rounded-lg border border-input bg-background px-3.5 py-2.5 text-sm text-foreground transition-colors",
      "focus-within:border-ring focus-within:ring-2 focus-within:ring-ring",
      "data-disabled:cursor-not-allowed data-disabled:opacity-50 data-disabled:bg-muted",
      "data-invalid:border-danger data-invalid:focus-within:ring-danger",
      className
    )}
    {...props}
  />
))
ComboboxFieldset.displayName = "ComboboxFieldset"

/**
 * 入力欄そのもの。枠は ComboboxFieldset が描くため、ここには border を持たせない。
 */
const ComboboxInput = React.forwardRef<HTMLInputElement, ComboboxPrimitive.Input.Props>(
  ({ className, ...props }, ref) => (
    <ComboboxPrimitive.Input
      ref={ref}
      className={cn(
        "min-w-16 flex-1 bg-transparent text-sm text-foreground outline-none",
        "placeholder:text-muted-foreground",
        "disabled:cursor-not-allowed",
        className
      )}
      {...props}
    />
  )
)
ComboboxInput.displayName = "ComboboxInput"

/**
 * 複数選択のチップ列。入力欄と同じ枠の中に並べる。
 */
const ComboboxChips = React.forwardRef<HTMLDivElement, ComboboxPrimitive.Chips.Props>(
  ({ className, ...props }, ref) => (
    <ComboboxPrimitive.Chips
      ref={ref}
      className={cn("flex flex-1 flex-wrap items-center gap-1.5", className)}
      {...props}
    />
  )
)
ComboboxChips.displayName = "ComboboxChips"

const ComboboxChip = React.forwardRef<HTMLDivElement, ComboboxPrimitive.Chip.Props>(
  ({ className, children, ...props }, ref) => (
    <ComboboxPrimitive.Chip
      ref={ref}
      className={cn(
        "flex items-center gap-1 rounded-full bg-muted py-0.5 pl-2.5 pr-1 text-xs text-foreground",
        "data-highlighted:bg-accent data-highlighted:text-accent-foreground",
        className
      )}
      {...props}
    >
      {children}
    </ComboboxPrimitive.Chip>
  )
)
ComboboxChip.displayName = "ComboboxChip"

const ComboboxChipRemove = React.forwardRef<
  HTMLButtonElement,
  ComboboxPrimitive.ChipRemove.Props & { "aria-label": string }
>(({ className, ...props }, ref) => (
  <ComboboxPrimitive.ChipRemove
    ref={ref}
    className={cn(
      "inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors",
      "hover:bg-background hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
      className
    )}
    {...props}
  >
    <X className="h-3 w-3" />
  </ComboboxPrimitive.ChipRemove>
))
ComboboxChipRemove.displayName = "ComboboxChipRemove"

const ComboboxClear = React.forwardRef<
  HTMLButtonElement,
  ComboboxPrimitive.Clear.Props & { "aria-label": string }
>(({ className, ...props }, ref) => (
  <ComboboxPrimitive.Clear
    ref={ref}
    className={cn(
      "inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors",
      "hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
      className
    )}
    {...props}
  >
    <X className="h-3.5 w-3.5" />
  </ComboboxPrimitive.Clear>
))
ComboboxClear.displayName = "ComboboxClear"

const ComboboxTrigger = React.forwardRef<
  HTMLButtonElement,
  ComboboxPrimitive.Trigger.Props & { "aria-label": string }
>(({ className, ...props }, ref) => (
  <ComboboxPrimitive.Trigger
    ref={ref}
    className={cn(
      "inline-flex h-5 w-5 shrink-0 items-center justify-center rounded text-muted-foreground transition-colors",
      "hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
      className
    )}
    {...props}
  >
    <ChevronDown className="h-4 w-4" />
  </ComboboxPrimitive.Trigger>
))
ComboboxTrigger.displayName = "ComboboxTrigger"

/**
 * ドロップダウン本体。Portal + Positioner + Popup をまとめている。
 * SelectContent と同じ構成にしてある。
 */
const ComboboxContent = React.forwardRef<
  HTMLDivElement,
  ComboboxPrimitive.Popup.Props &
    Pick<ComboboxPrimitive.Positioner.Props, "align" | "side" | "sideOffset">
>(({ className, align = "start", side, sideOffset = 4, ...props }, ref) => (
  <ComboboxPrimitive.Portal>
    <ComboboxPrimitive.Positioner
      align={align}
      side={side}
      sideOffset={sideOffset}
      className="z-50 outline-none"
    >
      <ComboboxPrimitive.Popup
        ref={ref}
        className={cn(
          "max-h-[min(24rem,var(--available-height))] w-[var(--anchor-width)] overflow-y-auto rounded-lg border border-border bg-popover p-1 text-popover-foreground shadow-lg",
          "data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95",
          "data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
          className
        )}
        {...props}
      />
    </ComboboxPrimitive.Positioner>
  </ComboboxPrimitive.Portal>
))
ComboboxContent.displayName = "ComboboxContent"

const ComboboxList = React.forwardRef<HTMLDivElement, ComboboxPrimitive.List.Props>(
  ({ className, ...props }, ref) => (
    <ComboboxPrimitive.List ref={ref} className={cn("outline-none", className)} {...props} />
  )
)
ComboboxList.displayName = "ComboboxList"

const ComboboxItem = React.forwardRef<HTMLDivElement, ComboboxPrimitive.Item.Props>(
  ({ className, children, ...props }, ref) => (
    <ComboboxPrimitive.Item
      ref={ref}
      className={cn(
        "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors",
        "data-highlighted:bg-accent data-highlighted:text-accent-foreground",
        "data-disabled:pointer-events-none data-disabled:opacity-50",
        className
      )}
      {...props}
    >
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        <ComboboxPrimitive.ItemIndicator>
          <Check className="h-4 w-4" />
        </ComboboxPrimitive.ItemIndicator>
      </span>
      {children}
    </ComboboxPrimitive.Item>
  )
)
ComboboxItem.displayName = "ComboboxItem"

/**
 * 該当が無いときに出す文言。
 *
 * Base UI の仕様上、この要素自体は常にマウントしたままにする
 * （読み上げの変更通知が安定しなくなるため）。中身だけを出し分ける。
 */
const ComboboxEmpty = React.forwardRef<HTMLDivElement, ComboboxPrimitive.Empty.Props>(
  ({ className, ...props }, ref) => (
    <ComboboxPrimitive.Empty
      ref={ref}
      className={cn(
        "px-2 py-1.5 text-sm text-muted-foreground empty:m-0 empty:p-0",
        className
      )}
      {...props}
    />
  )
)
ComboboxEmpty.displayName = "ComboboxEmpty"

export {
  Combobox,
  ComboboxChip,
  ComboboxChipRemove,
  ComboboxChips,
  ComboboxClear,
  ComboboxCollection,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxFieldset,
  ComboboxGroup,
  ComboboxGroupLabel,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxTrigger,
  ComboboxValue,
}
