import * as React from "react"
import { Progress as ProgressPrimitive } from "@base-ui/react/progress"

import { cn } from '../../lib/utils'

const Progress = ProgressPrimitive.Root

const ProgressTrack = React.forwardRef<
  HTMLDivElement,
  ProgressPrimitive.Track.Props
>(({ className, ...props }, ref) => (
  <ProgressPrimitive.Track
    ref={ref}
    className={cn(
      "relative h-2 w-full overflow-hidden rounded-full bg-muted",
      className
    )}
    {...props}
  />
))
ProgressTrack.displayName = "ProgressTrack"

const ProgressIndicator = React.forwardRef<
  HTMLDivElement,
  ProgressPrimitive.Indicator.Props
>(({ className, ...props }, ref) => (
  <ProgressPrimitive.Indicator
    ref={ref}
    className={cn(
      "h-full rounded-full bg-primary transition-[width] duration-300",
      className
    )}
    {...props}
  />
))
ProgressIndicator.displayName = "ProgressIndicator"

export { Progress, ProgressTrack, ProgressIndicator }
