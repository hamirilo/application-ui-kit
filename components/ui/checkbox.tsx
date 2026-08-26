"use client"

import { Checkbox as CheckboxPrimitive } from "@base-ui/react/checkbox"

import { cn } from "../../lib/utils"
import { CheckIcon, MinusIcon } from "lucide-react"

function Checkbox({ className, ...props }: CheckboxPrimitive.Root.Props) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "cn-checkbox peer relative shrink-0 outline-none after:absolute after:-inset-x-3 after:-inset-y-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      {/* checked と indeterminate は別のアイコンを出す。どちらを見せるかは
        * tokens/components.css の cn-checkbox-indicator-icon-* が決める。 */}
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="cn-checkbox-indicator"
      >
        <CheckIcon className="cn-checkbox-indicator-icon-checked" />
        <MinusIcon className="cn-checkbox-indicator-icon-indeterminate" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }
