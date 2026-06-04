import * as React from "react"

import { cn } from "../lib/utils"

function Badge({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="badge"
      className={cn(
        "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        className,
      )}
      {...props}
    />
  )
}

export { Badge }