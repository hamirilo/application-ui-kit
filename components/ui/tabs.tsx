import * as React from "react"
import { Tabs as TabsPrimitive } from "@base-ui/react/tabs"

import { cn } from '../../lib/utils'

const Tabs = TabsPrimitive.Root

const TabsList = React.forwardRef<
  HTMLDivElement,
  TabsPrimitive.List.Props
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "inline-flex items-center gap-1 border-b border-border",
      className
    )}
    {...props}
  />
))
TabsList.displayName = "TabsList"

const TabsTab = React.forwardRef<HTMLElement, TabsPrimitive.Tab.Props>(
  ({ className, ...props }, ref) => (
    <TabsPrimitive.Tab
      ref={ref}
      className={cn(
        "-mb-px border-b-2 border-transparent px-3 py-2 text-sm font-medium text-muted-foreground transition-colors",
        "hover:text-foreground",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "data-active:border-primary data-active:text-primary",
        "data-disabled:cursor-not-allowed data-disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
)
TabsTab.displayName = "TabsTab"

const TabsPanel = React.forwardRef<HTMLDivElement, TabsPrimitive.Panel.Props>(
  ({ className, ...props }, ref) => (
    <TabsPrimitive.Panel
      ref={ref}
      className={cn(
        "pt-4 focus-visible:outline-none",
        className
      )}
      {...props}
    />
  )
)
TabsPanel.displayName = "TabsPanel"

export { Tabs, TabsList, TabsTab, TabsPanel }
