import * as React from "react"
import { Checkbox as CheckboxPrimitive } from "@base-ui/react/checkbox"
import { Check, Minus } from "lucide-react"

import { cn } from '../../lib/utils'

/**
 * Base UI の Checkbox をラップした基底チェックボックス。
 *
 * `indeterminate` を渡すと「一部選択」状態（横棒）になる。
 * 全選択チェックボックスで使う。
 */
const Checkbox = React.forwardRef<
  HTMLButtonElement,
  CheckboxPrimitive.Root.Props
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      "peer h-4 w-4 shrink-0 rounded border border-input bg-background transition-colors",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      "data-checked:border-primary data-checked:bg-primary data-checked:text-primary-foreground",
      "data-indeterminate:border-primary data-indeterminate:bg-primary data-indeterminate:text-primary-foreground",
      "data-disabled:cursor-not-allowed data-disabled:opacity-50",
      className
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator className="flex items-center justify-center text-current">
      {props.indeterminate ? (
        <Minus className="h-3.5 w-3.5" strokeWidth={3} />
      ) : (
        <Check className="h-3.5 w-3.5" strokeWidth={3} />
      )}
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
))
Checkbox.displayName = "Checkbox"

export { Checkbox }
