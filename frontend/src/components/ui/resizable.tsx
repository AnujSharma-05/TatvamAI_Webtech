import * as React from "react"
import { Grip, PanelLeftClose, PanelRightClose } from "lucide-react"

import { cn } from "../../lib/utils"

interface ResizablePanelGroupProps
  extends React.HTMLAttributes<HTMLDivElement> {
  direction?: "horizontal" | "vertical"
}

const ResizablePanelGroup = React.forwardRef<
  HTMLDivElement,
  ResizablePanelGroupProps
>(({ className, direction = "horizontal", ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex h-full w-full data-[panel-group-direction=vertical]:flex-col",
      className
    )}
    data-panel-group-direction={direction}
    {...props}
  />
))
ResizablePanelGroup.displayName = "ResizablePanelGroup"

interface ResizablePanelProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultSize?: number
  minSize?: number
  maxSize?: number
  collapsible?: boolean
  collapsedSize?: number
  onCollapse?: (collapsed: boolean) => void
}

const ResizablePanel = React.forwardRef<HTMLDivElement, ResizablePanelProps>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn("flex w-full", className)} {...props}>
      {children}
    </div>
  )
)
ResizablePanel.displayName = "ResizablePanel"

interface ResizableHandleProps
  extends React.HTMLAttributes<HTMLDivElement> {
  withHandle?: boolean
}

const ResizableHandle = React.forwardRef<
  HTMLDivElement,
  ResizableHandleProps
>(({ className, withHandle, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "relative flex w-px items-center justify-center bg-border after:absolute after:inset-y-0 after:left-1/2 after:w-4 after:-translate-x-1/2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1 data-[panel-group-direction=vertical]:h-px data-[panel-group-direction=vertical]:w-full data-[panel-group-direction=vertical]:after:left-0 data-[panel-group-direction=vertical]:after:h-4 data-[panel-group-direction=vertical]:after:w-full data-[panel-group-direction=vertical]:after:-translate-y-1/2 data-[panel-group-direction=vertical]:after:translate-x-0 [&[data-panel-group-direction=vertical]>div]:rotate-90",
      className
    )}
    {...props}
  >
    {withHandle && (
      <div className="z-10 flex h-4 w-3 items-center justify-center rounded-sm border bg-border">
        <Grip className="h-2.5 w-2.5" />
      </div>
    )}
  </div>
))
ResizableHandle.displayName = "ResizableHandle"

export { ResizablePanelGroup, ResizablePanel, ResizableHandle }
