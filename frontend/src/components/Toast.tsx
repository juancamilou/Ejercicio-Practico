import { useEffect } from "react";

interface ToastProps {
  id: string;
  message: string;
  type: "success" | "error" | "warning" | "info";
  duration?: number;
  onClose: (id: string) => void;
}

export default function Toast({
  id,
  message,
  type,
  duration = 4000,
  onClose,
}: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id);
    }, duration);

    return () => clearTimeout(timer);
  }, [id, duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case "success":
        return "✅";
      case "error":
        return "❌";
      case "warning":
        return "⚠️";
      case "info":
        return "ℹ️";
      default:
        return "💬";
    }
  };

  const getColors = () => {
    switch (type) {
      case "success":
        return "bg-green-500 text-white border-green-600";
      case "error":
        return "bg-red-500 text-white border-red-600";
      case "warning":
        return "bg-yellow-500 text-white border-yellow-600";
      case "info":
        return "bg-blue-500 text-white border-blue-600";
      default:
        return "bg-gray-500 text-white border-gray-600";
    }
  };

  return (
    <div
      className={`
        fixed bottom-4 right-4 px-4 py-3 rounded-lg shadow-lg border-l-4
        ${getColors()} 
        flex items-center gap-3 animate-bounce
        z-50 max-w-sm
      `}
    >
      <span className="text-xl">{getIcon()}</span>
      <p className="font-semibold">{message}</p>
      <button
        onClick={() => onClose(id)}
        className="ml-2 text-lg font-bold opacity-70 hover:opacity-100"
      >
        ✕
      </button>
    </div>
  );
}
