import * as React from "react"
import { RadioGroup as RadioGroupPrimitive } from "@base-ui/react/radio-group"
import { Radio as RadioPrimitive } from "@base-ui/react/radio"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from '../../lib/utils'

const RadioGroup = RadioGroupPrimitive

/**
 * Base UI の Radio をラップした基底ラジオボタン（丸 + ドット表示）。
 * `HamiriloRadioGroup` のような縦/横に並ぶリスト表現で使う。
 */
const RadioItem = React.forwardRef<HTMLSpanElement, RadioPrimitive.Root.Props>(
  ({ className, ...props }, ref) => (
    <RadioPrimitive.Root
      ref={ref}
      className={cn(
        "flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-input bg-background transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "data-checked:border-primary",
        "data-disabled:cursor-not-allowed data-disabled:opacity-50",
        className
      )}
      {...props}
    >
      <RadioPrimitive.Indicator className="h-2 w-2 rounded-full bg-primary data-unchecked:hidden" />
    </RadioPrimitive.Root>
  )
)
RadioItem.displayName = "RadioItem"

const radioGroupItemVariants = cva(
  "inline-flex cursor-pointer items-center justify-center gap-1.5 border border-input bg-background text-sm font-medium text-foreground shadow-sm transition-colors -ml-px first:ml-0 first:rounded-l-md last:rounded-r-md hover:bg-accent hover:text-accent-foreground focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary:
          "data-checked:z-10 data-checked:border-primary data-checked:bg-primary data-checked:text-primary-foreground data-checked:hover:bg-primary/90",
        secondary:
          "data-checked:z-10 data-checked:border-foreground data-checked:bg-accent data-checked:text-accent-foreground",
      },
      size: {
        sm: "h-8 px-3 text-xs",
        md: "h-9 px-4",
        lg: "h-10 px-6",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
)

export interface RadioGroupItemProps
  extends Omit<RadioPrimitive.Root.Props, "className">,
    VariantProps<typeof radioGroupItemVariants> {
  className?: string
}

/**
 * Base UI の Radio を「隣接ボタンが1本の枠に見える」segmented control 用にラップしたもの。
 * ドットインジケーターは表示せず、子要素（ラベル・アイコン）をそのままボタンの中身として描画する。
 * `HamiriloButtonGroup` で使う。
 */
const RadioGroupItem = React.forwardRef<HTMLElement, RadioGroupItemProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <RadioPrimitive.Root
        ref={ref}
        className={cn(radioGroupItemVariants({ variant, size, className }))}
        {...props}
      />
    )
  }
)
RadioGroupItem.displayName = "RadioGroupItem"

export { RadioGroup, RadioItem, RadioGroupItem, radioGroupItemVariants }
