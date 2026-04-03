import { ChevronDown } from "lucide-react";
import { useState, useRef, useId } from "react";

import { useClickOutside } from "@/lib/use-click-outside";

interface CustomDropdownProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  options: { value: string; label: string }[];
}

/**
 * ARIA-compliant dropdown for filter/sort controls.
 * For form inputs (e.g. create/edit pages), prefer native <select> elements instead.
 */
export function CustomDropdown({
  label,
  value,
  onChange,
  placeholder,
  options,
}: CustomDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listboxId = useId();
  const selected = options.find((o) => o.value === value);

  useClickOutside(ref, () => setOpen(false), open);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setOpen(false);
      buttonRef.current?.focus();
    } else if (e.key === "ArrowDown" && !open) {
      e.preventDefault();
      setOpen(true);
    }
  };

  return (
    <div ref={ref} className="relative" onKeyDown={handleKeyDown}>
      {label && (
        <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-foreground">
          {label}
        </label>
      )}
      <button
        ref={buttonRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listboxId : undefined}
        onClick={(e) => {
          e.stopPropagation();
          setOpen(!open);
        }}
        className="flex w-full items-center justify-between rounded-lg border-[1.5px] border-border bg-card px-3 py-2 text-sm font-medium text-foreground outline-none transition-colors hover:border-primary/40 focus:border-primary focus:ring-3 focus:ring-primary/20"
      >
        <span className={!value ? "text-muted-foreground" : ""}>{selected?.label ?? placeholder}</span>
        <ChevronDown className="size-4 text-muted-foreground" />
      </button>
      {open && (
        <div
          id={listboxId}
          role="listbox"
          aria-label={label}
          className="absolute top-full left-0 z-20 mt-1 w-full rounded-lg border-[1.5px] border-border bg-card py-1 shadow-lg"
        >
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              role="option"
              aria-selected={opt.value === value}
              onClick={(e) => {
                e.stopPropagation();
                onChange(opt.value);
                setOpen(false);
              }}
              className={`w-full px-3 py-2 text-left text-sm transition-colors hover:bg-primary/5 ${
                opt.value === value ? "font-bold text-primary" : "text-foreground"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
