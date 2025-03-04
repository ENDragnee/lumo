import type * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-4 py-1 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-gray-100 text-gray-900 hover:bg-gray-200",
        outline: "border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300",
        secondary: "border-transparent bg-gray-100 text-gray-900 hover:bg-gray-200",
        selected: "border-transparent bg-primary text-primary-foreground hover:bg-primary/90 shadow-glow",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
)

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {
  isSelected?: boolean
}

function Badge({ className, variant, isSelected, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant: isSelected ? "selected" : variant }), className)} {...props} />
}

export { Badge, badgeVariants }

