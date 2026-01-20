import type {
  ChangeEvent,
  ClipboardEvent,
  KeyboardEvent,
} from "react";
import { useEffect, useMemo, useRef, useState } from "react";

type VerifyOtpProps = {
  length?: number;
  onChange?: (code: string) => void;
  onComplete?: (code: string) => void;
  disabled?: boolean;
};

export default function VerifyOtp({
  length = 6,
  onChange,
  onComplete,
  disabled = false,
}: VerifyOtpProps) {
  const [digits, setDigits] = useState<string[]>(() => Array.from({ length }, () => ""));
  const refs = useRef<Array<HTMLInputElement | null>>([]);

  const code = useMemo(() => digits.join(""), [digits]);

  useEffect(() => {
    onChange?.(code);
    if (code.length === length && digits.every((d) => d !== "")) {
      onComplete?.(code);
    }
  }, [code, digits, length, onChange, onComplete]);

  useEffect(() => {
    refs.current[0]?.focus();
  }, []);

  const focusIndex = (index: number) => {
    const target = refs.current[index];
    if (target) target.focus();
  };

  const setDigitAt = (index: number, value: string) => {
    setDigits((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };

  const handleChange = (index: number) => (e: ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const onlyDigits = raw.replace(/\D/g, "");

    if (!onlyDigits) {
      setDigitAt(index, "");
      return;
    }

    if (onlyDigits.length === 1) {
      setDigitAt(index, onlyDigits);
      if (index < length - 1) focusIndex(index + 1);
      return;
    }

    const sliced = onlyDigits.slice(0, length - index).split("");
    setDigits((prev) => {
      const next = [...prev];
      for (let i = 0; i < sliced.length; i++) {
        next[index + i] = sliced[i];
      }
      return next;
    });

    const nextFocus = Math.min(index + sliced.length, length - 1);
    focusIndex(nextFocus);
  };

  const handleKeyDown = (index: number) => (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (digits[index]) {
        setDigitAt(index, "");
        return;
      }
      if (index > 0) {
        focusIndex(index - 1);
        setDigitAt(index - 1, "");
      }
    }

    if (e.key === "ArrowLeft" && index > 0) {
      focusIndex(index - 1);
    }

    if (e.key === "ArrowRight" && index < length - 1) {
      focusIndex(index + 1);
    }
  };

  const handlePaste = (index: number) => (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text");
    const onlyDigits = text.replace(/\D/g, "");
    if (!onlyDigits) return;

    const sliced = onlyDigits.slice(0, length - index).split("");
    setDigits((prev) => {
      const next = [...prev];
      for (let i = 0; i < sliced.length; i++) {
        next[index + i] = sliced[i];
      }
      return next;
    });

    const nextFocus = Math.min(index + sliced.length, length - 1);
    focusIndex(nextFocus);
  };

  return (
    <div className="flex gap-2">
      {Array.from({ length }).map((_, index) => (
        <input
          key={index}
          ref={(el) => {
            refs.current[index] = el;
          }}
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={1}
          className="w-12 h-12 rounded-lg border border-snow-200 text-center text-lg outline-none focus:border-brand-primary"
          value={digits[index]}
          onChange={handleChange(index)}
          onKeyDown={handleKeyDown(index)}
          onPaste={handlePaste(index)}
          disabled={disabled}
        />
      ))}
    </div>
  );
}
