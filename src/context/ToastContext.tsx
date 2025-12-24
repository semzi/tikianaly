import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";

export type ToastVariant = "success" | "warning" | "error";

type ToastItem = {
  id: string;
  variant: ToastVariant;
  message: string;
  durationMs?: number;
};

type ShowToastArgs = {
  id?: string;
  variant: ToastVariant;
  message: string;
  durationMs?: number;
};

type ToastContextType = {
  show: (args: ShowToastArgs) => string;
  dismiss: (id: string) => void;
  clear: () => void;
};

const ToastContext = createContext<ToastContextType>({
  show: () => "",
  dismiss: () => {},
  clear: () => {},
});

const variantClasses: Record<ToastVariant, string> = {
  success: "bg-emerald-600 text-white",
  warning: "bg-amber-500 text-white",
  error: "bg-red-600 text-white",
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const timersRef = useRef<Map<string, number>>(new Map());

  const dismiss = useCallback((id: string) => {
    const t = timersRef.current.get(id);
    if (t) {
      window.clearTimeout(t);
      timersRef.current.delete(id);
    }
    setToasts((prev) => prev.filter((x) => x.id !== id));
  }, []);

  const clear = useCallback(() => {
    for (const t of timersRef.current.values()) {
      window.clearTimeout(t);
    }
    timersRef.current.clear();
    setToasts([]);
  }, []);

  const show = useCallback(
    ({ id, variant, message, durationMs }: ShowToastArgs) => {
      const toastId = id ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`;

      setToasts((prev) => {
        const next = prev.filter((x) => x.id !== toastId);
        next.push({ id: toastId, variant, message, durationMs });
        return next;
      });

      const existingTimer = timersRef.current.get(toastId);
      if (existingTimer) {
        window.clearTimeout(existingTimer);
        timersRef.current.delete(toastId);
      }

      if (durationMs && durationMs > 0) {
        const t = window.setTimeout(() => dismiss(toastId), durationMs);
        timersRef.current.set(toastId, t);
      }

      return toastId;
    },
    [dismiss]
  );

  const value = useMemo(() => ({ show, dismiss, clear }), [show, dismiss, clear]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed inset-x-0 bottom-6 z-50 flex justify-center px-3 pointer-events-none">
        <div className="w-full max-w-md space-y-3">
          {toasts.map((t) => (
            <div
              key={t.id}
              className={`pointer-events-auto w-full rounded-lg shadow-lg px-4 py-3 text-sm font-medium ${variantClasses[t.variant]}`}
            >
              {t.message}
            </div>
          ))}
        </div>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
