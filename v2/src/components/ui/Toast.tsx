"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { AlertCircle, CheckCircle, Info, X } from "lucide-react";

type ToastType = "success" | "error" | "info";

interface ToastItemData {
  id: string;
  type: ToastType;
  message: string;
  duration: number;
}

interface ShowOptions {
  type?: ToastType;
  duration?: number;
}

interface VariantOptions {
  duration?: number;
}

interface ToastContextValue {
  show: (message: string, options?: ShowOptions) => string;
  success: (message: string, options?: VariantOptions) => string;
  error: (message: string, options?: VariantOptions) => string;
  info: (message: string, options?: VariantOptions) => string;
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

const ICONS = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
} as const;

const STYLES: Record<ToastType, { container: string; icon: string }> = {
  success: {
    container: "border-l-green-600 bg-green-50",
    icon: "text-green-600",
  },
  error: {
    container: "border-l-red-600 bg-red-50",
    icon: "text-red-600",
  },
  info: {
    container: "border-l-mp-ocean bg-mp-sand",
    icon: "text-mp-ocean",
  },
};

const DEFAULT_DURATION = 4000;

function usePrefersReducedMotion(): boolean {
  const [prefers, setPrefers] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefers(mq.matches);
    const handler = (e: MediaQueryListEvent) => setPrefers(e.matches);
    if (mq.addEventListener) {
      mq.addEventListener("change", handler);
      return () => mq.removeEventListener("change", handler);
    }
    // Safari < 14 fallback
    mq.addListener(handler);
    return () => mq.removeListener(handler);
  }, []);

  return prefers;
}

function ToastCard({
  toast,
  onDismiss,
  reducedMotion,
}: {
  toast: ToastItemData;
  onDismiss: (id: string) => void;
  reducedMotion: boolean;
}) {
  const Icon = ICONS[toast.type];
  const styles = STYLES[toast.type];
  const role = toast.type === "error" ? "alert" : "status";

  useEffect(() => {
    if (toast.duration <= 0) return;
    const timer = setTimeout(() => onDismiss(toast.id), toast.duration);
    return () => clearTimeout(timer);
  }, [toast.id, toast.duration, onDismiss]);

  const animationStyle: React.CSSProperties = reducedMotion
    ? {}
    : { animation: "toast-slide-in 300ms ease-out" };

  return (
    <div
      role={role}
      style={animationStyle}
      className={`mp-card p-4 pr-12 shadow-lg border-l-4 relative min-w-[280px] max-w-[420px] ${styles.container}`}
    >
      <div className="flex items-start gap-3">
        <Icon
          className={`w-5 h-5 shrink-0 mt-0.5 ${styles.icon}`}
          aria-hidden="true"
        />
        <p className="font-body text-sm text-mp-text leading-snug">
          {toast.message}
        </p>
      </div>
      <button
        type="button"
        onClick={() => onDismiss(toast.id)}
        className="absolute top-2 right-2 p-1.5 rounded-lg text-mp-text-light hover:text-mp-charcoal hover:bg-black/5 transition-colors focus:outline-none focus-visible:outline-2 focus-visible:outline-mp-ocean focus-visible:outline-offset-2"
        aria-label="Fermer"
      >
        <X className="w-4 h-4" aria-hidden="true" />
      </button>
    </div>
  );
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItemData[]>([]);
  const counterRef = useRef(0);
  const reducedMotion = usePrefersReducedMotion();

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const show = useCallback(
    (message: string, options?: ShowOptions): string => {
      const id = `toast-${++counterRef.current}-${Date.now()}`;
      const toast: ToastItemData = {
        id,
        type: options?.type ?? "info",
        message,
        duration: options?.duration ?? DEFAULT_DURATION,
      };
      setToasts((prev) => [...prev, toast]);
      return id;
    },
    []
  );

  const success = useCallback(
    (message: string, options?: VariantOptions) =>
      show(message, { type: "success", duration: options?.duration }),
    [show]
  );
  const error = useCallback(
    (message: string, options?: VariantOptions) =>
      show(message, { type: "error", duration: options?.duration }),
    [show]
  );
  const info = useCallback(
    (message: string, options?: VariantOptions) =>
      show(message, { type: "info", duration: options?.duration }),
    [show]
  );

  const value = useMemo<ToastContextValue>(
    () => ({ show, success, error, info, dismiss }),
    [show, success, error, info, dismiss]
  );

  const politeToasts = toasts.filter((t) => t.type !== "error");
  const assertiveToasts = toasts.filter((t) => t.type === "error");

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
        {/* Assertive: errors (stacked on top) */}
        <div
          aria-live="assertive"
          aria-relevant="additions"
          className="flex flex-col gap-2"
        >
          {assertiveToasts.map((t) => (
            <div key={t.id} className="pointer-events-auto">
              <ToastCard
                toast={t}
                onDismiss={dismiss}
                reducedMotion={reducedMotion}
              />
            </div>
          ))}
        </div>
        {/* Polite: success + info */}
        <div
          aria-live="polite"
          aria-relevant="additions"
          className="flex flex-col gap-2"
        >
          {politeToasts.map((t) => (
            <div key={t.id} className="pointer-events-auto">
              <ToastCard
                toast={t}
                onDismiss={dismiss}
                reducedMotion={reducedMotion}
              />
            </div>
          ))}
        </div>
      </div>
    </ToastContext.Provider>
  );
}
