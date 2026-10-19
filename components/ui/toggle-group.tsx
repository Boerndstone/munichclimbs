"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

type ToggleGroupContextValue = {
  value: string[]
  onValueChange: (value: string[]) => void
}

const ToggleGroupContext = React.createContext<ToggleGroupContextValue | null>(null)

function ToggleGroup({
  className,
  value,
  onValueChange,
  ...props
}: React.ComponentProps<"div"> & ToggleGroupContextValue) {
  return (
    <ToggleGroupContext.Provider value={{ value, onValueChange }}>
      <div
        data-slot="toggle-group"
        role="group"
        className={cn("flex flex-wrap items-center gap-2", className)}
        {...props}
      />
    </ToggleGroupContext.Provider>
  )
}

function ToggleGroupItem({
  className,
  value,
  onClick,
  ...props
}: Omit<React.ComponentProps<"button">, "value"> & { value: string }) {
  const context = React.useContext(ToggleGroupContext)

  if (!context) {
    throw new Error("ToggleGroupItem must be used inside ToggleGroup")
  }

  const pressed = context.value.includes(value)

  return (
    <button
      type="button"
      data-slot="toggle-group-item"
      data-state={pressed ? "on" : "off"}
      aria-pressed={pressed}
      className={cn(
        "inline-flex h-9 cursor-pointer items-center justify-center gap-2 rounded-md border border-input bg-transparent px-2 text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 data-[state=on]:border-primary data-[state=on]:bg-primary data-[state=on]:text-primary-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
        className
      )}
      onClick={(event) => {
        const nextValue = pressed
          ? context.value.filter((item) => item !== value)
          : [...context.value, value]

        context.onValueChange(nextValue)
        onClick?.(event)
      }}
      {...props}
    />
  )
}

export { ToggleGroup, ToggleGroupItem }
