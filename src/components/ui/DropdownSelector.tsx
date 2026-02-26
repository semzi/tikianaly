import { useEffect, useMemo, useRef, useState } from "react";

type Option<T extends string> = {
  value: T;
  label: string;
  disabled?: boolean;
};

type DropdownSelectorProps<T extends string> = {
  value: T;
  options: Array<Option<T>>;
  onChange: (value: T) => void;
  className?: string;
  size?: "sm" | "md" | "lg";
  placeholder?: string;
};

export const DropdownSelector = <T extends string>({
  value,
  options,
  onChange,
  className = "",
  size = "md",
  placeholder,
}: DropdownSelectorProps<T>) => {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  const selectedLabel = useMemo(() => {
    const found = options.find((o) => o.value === value);
    return found?.label ?? "";
  }, [options, value]);

  const sizeCls =
    size === "sm"
      ? {
          btn: "h-9 text-xs px-4",
          item: "py-2 text-xs",
        }
      : size === "lg"
        ? {
            btn: "h-10 text-xs px-4 sm:h-11 sm:text-sm",
            item: "py-2.5 text-xs sm:text-sm",
          }
        : {
          btn: "h-10 text-sm px-4",
          item: "py-2.5 text-sm",
        };

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      const root = rootRef.current;
      if (!root) return;
      if (e.target && root.contains(e.target as Node)) return;
      setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("mousedown", onPointerDown);
    window.addEventListener("touchstart", onPointerDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("mousedown", onPointerDown);
      window.removeEventListener("touchstart", onPointerDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className={`relative w-full max-w-[220px] ${className}`}>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`w-full rounded-full border border-snow-200/60 dark:border-snow-100/10 bg-snow-100/60 dark:bg-white/5 pr-10 font-semibold text-neutral-n5 dark:text-snow-200 focus:outline-none focus:ring-2 focus:ring-brand-secondary/40 ${sizeCls.btn}`}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="block w-full truncate text-left">
          {selectedLabel || placeholder || "Select"}
        </span>
        <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={`transition-transform ${open ? "rotate-180" : "rotate-0"}`}
          >
            <path
              d="M7 10l5 5 5-5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-neutral-n4 dark:text-snow-200"
            />
          </svg>
        </span>
      </button>

      {open ? (
        <div
          className="absolute right-0 mt-2 w-full overflow-hidden rounded-2xl border border-snow-200/60 dark:border-snow-100/10 bg-white dark:bg-[#0B1220] shadow-lg"
          role="listbox"
          aria-label="Options"
        >
          <div className="max-h-72 overflow-auto p-1">
            {options.map((opt) => {
              const selected = opt.value === value;
              const disabled = Boolean(opt.disabled);
              return (
                <button
                  key={opt.value}
                  type="button"
                  role="option"
                  aria-selected={selected}
                  disabled={disabled}
                  onClick={() => {
                    if (disabled) return;
                    onChange(opt.value);
                    setOpen(false);
                  }}
                  className={`w-full rounded-xl px-3 ${sizeCls.item} text-left font-semibold transition-colors ${
                    disabled
                      ? "opacity-40 cursor-not-allowed"
                      : selected
                        ? "bg-brand-secondary text-white"
                        : "text-neutral-n5 dark:text-snow-200 hover:bg-snow-100 dark:hover:bg-white/5"
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
};
