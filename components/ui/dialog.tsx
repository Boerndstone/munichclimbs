"use client"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"
export const Dialog = DialogPrimitive.Root
export const DialogTrigger = DialogPrimitive.Trigger
export const DialogTitle = DialogPrimitive.Title
export const DialogDescription = DialogPrimitive.Description
export function DialogContent({ children, className, ...props }: React.ComponentProps<typeof DialogPrimitive.Content>) { return <DialogPrimitive.Portal><DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/50" /><DialogPrimitive.Content className={cn("fixed left-1/2 top-1/2 z-50 flex max-h-[min(92vh,52rem)] w-[calc(100%-2rem)] max-w-3xl -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-lg border bg-background shadow-xl", className)} {...props}>{children}</DialogPrimitive.Content></DialogPrimitive.Portal> }
export function DialogCloseButton() { return <DialogPrimitive.Close className="inline-flex size-9 items-center justify-center rounded-md hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" aria-label="Schließen"><X className="size-5" /></DialogPrimitive.Close> }
