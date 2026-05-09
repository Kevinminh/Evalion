import { useId, useRef, useState } from "react";

import { useClickOutside } from "@/lib/use-click-outside";

interface CustomDropdownProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  options: { value: string; label: string }[];
}

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
    <div onKeyDown={handleKeyDown}>
      {label && <label className="filter-field-label">{label}</label>}
      <div ref={ref} className="filter-dropdown">
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
          className={`filter-dropdown-trigger${open ? " open" : ""}`}
        >
          {selected?.label ?? placeholder}
        </button>
        {open && (
          <div id={listboxId} role="listbox" aria-label={label} className="filter-dropdown-list space-y-1">
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
                className={`filter-dropdown-option${opt.value === value ? " selected" : ""}`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
