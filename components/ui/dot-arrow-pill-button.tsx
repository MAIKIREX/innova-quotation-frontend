"use client"

import * as React from "react"
import { ArrowRight } from "lucide-react"

import { cn } from "@/lib/utils"

export type DotArrowPillButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  label?: string
}

export const DotArrowPillButton = React.forwardRef<HTMLButtonElement, DotArrowPillButtonProps>(
  ({ className, label = "Hover this link", type = "button", ...props }, ref) => {
    return (
      <button
        ref={ref}
        type={type}
        className={cn(
          "group flex cursor-pointer items-center gap-3 rounded-3xl bg-gray-300 px-4 py-3 text-black transition-all duration-200 ease-in-out hover:scale-x-105 hover:bg-black",
          className
        )}
        {...props}
      >
        <div className="size-2 rounded-full bg-black transition-all duration-200 ease-in-out group-hover:flex group-hover:size-7 group-hover:items-center group-hover:justify-center group-hover:bg-amber-50">
          <span className="hidden transition-all duration-200 ease-in-out group-hover:flex group-hover:text-xl">
            <ArrowRight className="transition-transform duration-200 group-active:-rotate-45" />
          </span>
        </div>

        <p className="transition-all duration-200 ease-in-out group-hover:font-semibold group-hover:text-white group-active:[text-shadow:0_0_2px_rgba(255,255,255,0.9),0_0_10px_rgba(255,255,255,0.75),0_0_18px_rgba(245,158,11,0.65)]">
          {label}
        </p>
      </button>
    )
  }
)

DotArrowPillButton.displayName = "DotArrowPillButton"
