import * as React from "react"
import { Radio as RadioPrimitive } from "@base-ui/react/radio"

import { cn } from '../../lib/utils'

/**
 * Base UI の Radio をラップした基底ラジオボタン（ドット表示）。
 *
 * `components/ui/radio-group.tsx` の `RadioGroupItem`（隣接ボタン型）とは別の見た目。
 * フォームの縦並び選択肢（優先度・区分等）はこちらを使う。
 */
const Radio = React.forwardRef<HTMLSpanElement, RadioPrimitive.Root.Props>(
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
Radio.displayName = "Radio"

export { Radio }
