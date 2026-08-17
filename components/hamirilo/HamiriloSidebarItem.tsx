import * as React from "react";
import { cn } from "../../lib/utils";

export interface HamiriloSidebarItemProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  active?: boolean;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
  children?: React.ReactNode;
}

export const HamiriloSidebarItem = React.forwardRef<HTMLAnchorElement, HamiriloSidebarItemProps>(
  ({ active = false, icon, badge, children, className, ...props }, ref) => (
    <a
      ref={ref}
      className={cn(
        "group relative flex w-full items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors border border-transparent select-none outline-none focus-visible:ring-2 focus-visible:ring-ring",
        active
          ? "text-primary bg-accent"
          : "text-muted-foreground hover:text-foreground hover:bg-accent",
      )}
      {...props}
    >
      <span className="relative z-10 flex items-center gap-2.5">
        {icon}
        {children}
      </span>

      {badge !== undefined && badge !== null && (
        <span
          className={cn(
            "relative z-10 px-2 py-0.5 text-xs font-semibold rounded-full",
            active ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground",
          )}
        >
          {badge}
        </span>
      )}
    </a>
  ),
);

HamiriloSidebarItem.displayName = "HamiriloSidebarItem";
