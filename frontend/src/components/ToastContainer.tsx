import { useCallback, useState } from "react";
import Toast from "./Toast";

export interface ToastMessage {
  id: string;
  message: string;
  type: "success" | "error" | "warning" | "info";
  duration?: number;
}

export function useToast() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback(
    (
      message: string,
      type: "success" | "error" | "warning" | "info" = "info",
      duration = 4000,
    ) => {
      const id = `${Date.now()}-${Math.random()}`;
      const newToast: ToastMessage = { id, message, type, duration };
      setToasts((prev) => [...prev, newToast]);
      return id;
    },
    [],
  );

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const ToastContainer = () => (
    <div className="fixed bottom-0 right-0 p-4 pointer-events-none z-50">
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto mb-3">
          <Toast
            id={toast.id}
            message={toast.message}
            type={toast.type}
            duration={toast.duration}
            onClose={removeToast}
          />
        </div>
      ))}
    </div>
  );

  return { addToast, removeToast, ToastContainer };
}
