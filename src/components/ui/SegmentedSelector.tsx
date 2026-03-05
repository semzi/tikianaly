import { useEffect, useLayoutEffect, useRef, useState } from "react";

type Option<T extends string> = {
  value: T;
  label: string;
  disabled?: boolean;
};

type SegmentedSelectorProps<T extends string> = {
  value: T;
  options: Array<Option<T>>;
  onChange: (value: T) => void;
  className?: string;
  size?: "sm" | "md" | "lg";
};

const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

export const SegmentedSelector = <T extends string>({
  value,
  options,
  onChange,
  className = "",
  size = "md",
}: SegmentedSelectorProps<T>) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

  const [pill, setPill] = useState<{ left: number; width: number }>({ left: 0, width: 0 });

  const recalc = () => {
    const btn = itemRefs.current.get(String(value));
    const root = containerRef.current;
    if (!btn || !root) return;

    const rootRect = root.getBoundingClientRect();
    const btnRect = btn.getBoundingClientRect();
    setPill({ left: btnRect.left - rootRect.left, width: btnRect.width });
  };

  useIsoLayoutEffect(() => {
    recalc();
  }, [value, options.length]);

  useIsoLayoutEffect(() => {
    const onResize = () => recalc();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const sizeCls =
    size === "sm"
      ? {
          root: "h-8 text-[11px]",
          btn: "px-3",
          pill: "h-6",
        }
      : size === "lg"
        ? {
            root: "h-9 text-xs sm:h-11 sm:text-sm",
            btn: "px-3 sm:px-5",
            pill: "h-9",
          }
        : {
          root: "h-10 text-xs",
          btn: "px-4",
          pill: "h-8",
        };

  return (
    <div
      ref={containerRef}
      className={`relative inline-flex w-full max-w-sm items-center rounded-full border border-snow-200/60 dark:border-snow-100/10 bg-snow-100/60 dark:bg-white/5 p-1 ${sizeCls.root} ${className}`}
      role="tablist"
    >
      <div
        className="absolute top-1 bottom-1 rounded-full bg-brand-secondary border border-brand-secondary shadow-sm transition-[left,width] duration-200 ease-out"
        style={{ left: pill.left, width: pill.width }}
        aria-hidden="true"
      />

      {options.map((opt) => {
        const selected = opt.value === value;
        const disabled = Boolean(opt.disabled);
        const base =
          "relative z-10 flex-1 whitespace-nowrap rounded-full font-semibold transition-colors";
        const stateCls = disabled
          ? "opacity-40 cursor-not-allowed"
          : selected
            ? "text-white"
            : "text-neutral-n5 dark:text-snow-200 hover:text-neutral-n4";

        return (
          <button
            key={opt.value}
            type="button"
            ref={(el) => {
              if (!el) {
                itemRefs.current.delete(String(opt.value));
                return;
              }
              itemRefs.current.set(String(opt.value), el);
            }}
            onClick={() => {
              if (disabled) return;
              onChange(opt.value);
            }}
            className={`${base} ${sizeCls.btn} ${stateCls}`}
            role="tab"
            aria-selected={selected}
            aria-disabled={disabled}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
};
