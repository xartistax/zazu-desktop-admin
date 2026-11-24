"use client"

import { useEffect, useState, useTransition } from "react"
import { CheckIcon, ChevronsUpDownIcon, XIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { searchOptions } from "@/lib/actions"
import type { Option } from "@/lib/resources"
import { cn } from "@/lib/utils"

// Durchsuchbares Auswahlfeld für verknüpfte Einträge (z. B. Kategorie eines Skills).
export function ReferenceSelect({
  id,
  name,
  resource,
  initial,
  required,
}: {
  id: string
  name: string
  resource: string
  initial: Option | null
  required?: boolean
}) {
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState<Option | null>(initial)
  const [query, setQuery] = useState("")
  const [options, setOptions] = useState<Option[]>([])
  const [pending, startTransition] = useTransition()

  useEffect(() => {
    if (!open) return
    const timeout = setTimeout(() => {
      startTransition(async () => {
        setOptions(await searchOptions(resource, query))
      })
    }, 250)
    return () => clearTimeout(timeout)
  }, [open, query, resource])

  return (
    <div className="flex gap-2">
      <input type="hidden" name={name} value={selected?.value ?? ""} />
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          render={
            <Button
              id={id}
              type="button"
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="flex-1 justify-between font-normal"
            />
          }
        >
          <span className={cn("truncate", !selected && "text-muted-foreground")}>
            {selected?.label ?? "Bitte auswählen …"}
          </span>
          <ChevronsUpDownIcon className="opacity-50" />
        </PopoverTrigger>
        <PopoverContent className="w-(--anchor-width) min-w-72 p-0" align="start">
          <Command shouldFilter={false}>
            <CommandInput
              placeholder="Suchen …"
              value={query}
              onValueChange={setQuery}
            />
            <CommandList>
              <CommandEmpty>
                {pending ? "Laden …" : "Keine Treffer."}
              </CommandEmpty>
              <CommandGroup>
                {options.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    onSelect={() => {
                      setSelected(option)
                      setOpen(false)
                    }}
                  >
                    <CheckIcon
                      className={cn(
                        "size-4",
                        selected?.value === option.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {option.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {!required && selected && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Auswahl entfernen"
          onClick={() => setSelected(null)}
        >
          <XIcon />
        </Button>
      )}
    </div>
  )
}
