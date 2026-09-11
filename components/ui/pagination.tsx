import * as React from "react"
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

function Pagination({ className, ...props }: React.ComponentProps<"nav">) {
  return (
    <nav
      role="navigation"
      aria-label="pagination"
      className={cn("mx-auto flex w-full justify-center", className)}
      {...props}
    />
  )
}

function PaginationContent({ className, ...props }: React.ComponentProps<"ul">) {
  return (
    <ul
      className={cn("flex flex-row items-center gap-1", className)}
      {...props}
    />
  )
}

function PaginationItem(props: React.ComponentProps<"li">) {
  return <li {...props} />
}

type PaginationLinkProps = React.ComponentProps<typeof Button> & {
  isActive?: boolean
}

function PaginationLink({
  className,
  isActive,
  variant,
  size = "icon-sm",
  ...props
}: PaginationLinkProps) {
  return (
    <Button
      aria-current={isActive ? "page" : undefined}
      variant={isActive ? "outline" : variant ?? "ghost"}
      size={size}
      className={cn(className)}
      {...props}
    />
  )
}

function PaginationPrevious({ className, children, ...props }: PaginationLinkProps) {
  return (
    <PaginationLink
      aria-label="Vorherige Seite"
      size="sm"
      className={cn("gap-1 px-2", className)}
      {...props}
    >
      <ChevronLeft className="size-3.5" />
      {children ?? <span>Zurück</span>}
    </PaginationLink>
  )
}

function PaginationNext({ className, children, ...props }: PaginationLinkProps) {
  return (
    <PaginationLink
      aria-label="Nächste Seite"
      size="sm"
      className={cn("gap-1 px-2", className)}
      {...props}
    >
      {children ?? <span>Weiter</span>}
      <ChevronRight className="size-3.5" />
    </PaginationLink>
  )
}

function PaginationEllipsis({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      aria-hidden="true"
      className={cn("flex size-8 items-center justify-center", className)}
      {...props}
    >
      <MoreHorizontal className="size-4" />
      <span className="sr-only">Weitere Seiten</span>
    </span>
  )
}

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
}
