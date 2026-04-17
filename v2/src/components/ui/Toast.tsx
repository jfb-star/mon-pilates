"use client";

import { createContext, useContext, useState, useCallback, useRef, useEffect } from "react";
import { CheckCircle, AlertCircle, Info, X } from "lucide-react";

type ToastType = "success" | "error" | "info";

interface Toast {
  id: string;
  type: ToastType;
  message: string;
  createdAt: number;
}

interface ToastContextValue {
  success: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

const ICONS = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
};

const COLORS = {
  success: { bg: "#ecfdf5", border: "#10b981", icon: "#059669" },
  error: { bg: "#fef2f2", border: "#ef4444", icon: "#dc2626" },
  info: { bg: "#eff6ff", border: "#0077B6", icon: "#0077B6" },
};

const AUTO_DISMISS = 4000;

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: (id: string) => void }) {
  const Icon = ICONS[toast.type];
  const color = COLORS[toast.type];
  const [exiting, setExiting] = useState(false);
  const [progress, setProgress] = useState(100);
  const startRef = useRef(Date.now());

  useEffect(() => {
    const raf = () => {
      const elapsed = Date.now() - startRef.current;
      const remaining = Math.max(0, 100 - (elapsed / AUTO_DISMISS) * 100);
      setProgress(remaining);
      if (remaining > 0) requestAnimationFrame(raf);
    };
    const id = requestAnimationFrame(raf);
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setExiting(true);
      setTimeout(() => onDismiss(toast.id), 300);
    }, AUTO_DISMISS);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  const handleDismiss = () => {
    setExiting(true);
    setTimeout(() => onDismiss(toast.id), 300);
  };

  return (
    <div
      role="alert"
      aria-live="assertive"
      style={{
        background: color.bg,
        borderLeft: `4px solid ${color.border}`,
        transform: exiting ? "translateX(120%)" : "translateX(0)",
        opacity: exiting ? 0 : 1,
        transition: "transform 300ms ease, opacity 300ms ease",
        animation: "toast-slide-in 300ms ease",
      }}
      className="relative rounded-lg shadow-lg p-4 pr-10 min-w-[300px] max-w-[420px] overflow-hidden"
    >
      <div className="flex items-start gap-3">
        <Icon size={20} style={{ color: color.icon, flexShrink: 0, marginTop: 2 }} />
        <p className="text-sm text-[#2D2D2D] leading-snug">{toast.message}</p>
      </div>
      <button
        onClick={handleDismiss}
        className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors"
        aria-label="Fermer"
      >
        <X size={16} />
      </button>
      <div
        className="absolute bottom-0 left-0 h-[3px] transition-none"
        style={{
          width: `${progress}%`,
          background: color.border,
        }}
      />
    </div>
  );
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const counterRef = useRef(0);

  const addToast = useCallback((type: ToastType, message: string) => {
    const id = `toast-${++counterRef.current}`;
    setToasts((prev) => [...prev.slice(-2), { id, type, message, createdAt: Date.now() }]);
  }, []);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const value: ToastContextValue = {
    success: useCallback((msg: string) => addToast("success", msg), [addToast]),
    error: useCallback((msg: string) => addToast("error", msg), [addToast]),
    info: useCallback((msg: string) => addToast("info", msg), [addToast]),
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col-reverse gap-3 pointer-events-none">
        {toasts.map((t) => (
          <div key={t.id} className="pointer-events-auto">
            <ToastItem toast={t} onDismiss={dismiss} />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
