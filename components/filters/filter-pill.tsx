"use client";

import * as Popover from "@radix-ui/react-popover";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FilterOption<T extends string = string> {
  value: T;
  label: string;
}

interface FilterPillProps<T extends string> {
  label: string;
  options: FilterOption<T>[];
  selected: T[];
  onChange: (next: T[]) => void;
}

/** Pílula branca com seta que abre a lista de opções (seleção múltipla). */
export function FilterPill<T extends string>({ label, options, selected, onChange }: FilterPillProps<T>) {
  const toggle = (value: T) =>
    onChange(selected.includes(value) ? selected.filter((v) => v !== value) : [...selected, value]);

  return (
    <Popover.Root>
      <Popover.Trigger
        className={cn(
          "inline-flex shrink-0 cursor-pointer items-center gap-2 rounded-full px-4 py-2 text-sm shadow-md transition-colors",
          selected.length ? "bg-zinc-950 text-white" : "bg-white text-zinc-900 hover:bg-zinc-50"
        )}
      >
        {label}
        {selected.length > 0 && (
          <span className="grid h-5 min-w-5 place-items-center rounded-full bg-white px-1 text-[11px] font-semibold text-zinc-950">
            {selected.length}
          </span>
        )}
        <ChevronDown className="h-4 w-4" />
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          align="start"
          sideOffset={8}
          className="z-50 w-60 rounded-2xl border border-zinc-200 bg-white p-1.5 shadow-xl"
        >
          <ul role="listbox" aria-multiselectable="true" aria-label={label} className="max-h-72 overflow-y-auto">
            {options.map((option) => {
              const isOn = selected.includes(option.value);
              return (
                <li key={option.value}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={isOn}
                    onClick={() => toggle(option.value)}
                    className="flex w-full cursor-pointer items-center justify-between gap-2 rounded-xl px-3 py-2 text-left text-sm text-zinc-800 hover:bg-zinc-100"
                  >
                    {option.label}
                    <span
                      className={cn(
                        "grid h-4 w-4 place-items-center rounded-full border",
                        isOn ? "border-zinc-950 bg-zinc-950 text-white" : "border-zinc-300"
                      )}
                    >
                      {isOn && <Check className="h-3 w-3" />}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
          {selected.length > 0 && (
            <button
              type="button"
              onClick={() => onChange([])}
              className="mt-1 w-full cursor-pointer rounded-xl px-3 py-2 text-left text-xs font-medium text-zinc-500 hover:bg-zinc-100"
            >
              Limpar seleção
            </button>
          )}
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
