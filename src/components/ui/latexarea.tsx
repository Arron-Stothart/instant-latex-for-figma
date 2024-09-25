import * as React from "react"

import { cn } from "@/lib/utils"

export interface LaTeXAreaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const LaTeXArea = React.forwardRef<HTMLTextAreaElement, LaTeXAreaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          "font-mono",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
LaTeXArea.displayName = "LaTeXArea"

export { LaTeXArea }
