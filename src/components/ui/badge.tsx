import type * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-4 py-1 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "rounded-full px-4 py-1 text-sm border-transparent border-zinc-300 bg-transparent bg-gray-100 dark:bg-transparent text-gray-900 dark:border-[#626e929f] hover:border-gray-400 dark:hover:border-[#b4bcda9f] dark:text-white mb-2 cursor-pointer transition-colors",
        outline: "border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300",
        secondary: "border-transparent bg-gray-100 text-gray-900 hover:bg-gray-200",
        selected: "border-transparent bg-zinc-600 text-primary-foreground hover:bg-primary/90 shadow-glow",
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

