interface AlertDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  type: "confirm" | "warning" | "error" | "success" | "info";
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
}

export default function AlertDialog({
  isOpen,
  title,
  message,
  type,
  onConfirm,
  onCancel,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
}: AlertDialogProps) {
  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case "confirm":
        return "❓";
      case "warning":
        return "⚠️";
      case "error":
        return "❌";
      case "success":
        return "✅";
      case "info":
        return "ℹ️";
      default:
        return "❓";
    }
  };

  const getBgColor = () => {
    switch (type) {
      case "confirm":
        return "bg-blue-50 border-blue-200";
      case "warning":
        return "bg-yellow-50 border-yellow-200";
      case "error":
        return "bg-red-50 border-red-200";
      case "success":
        return "bg-green-50 border-green-200";
      case "info":
        return "bg-indigo-50 border-indigo-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  const getButtonColor = () => {
    switch (type) {
      case "confirm":
        return "bg-blue-600 hover:bg-blue-700";
      case "warning":
        return "bg-yellow-600 hover:bg-yellow-700";
      case "error":
        return "bg-red-600 hover:bg-red-700";
      case "success":
        return "bg-green-600 hover:bg-green-700";
      case "info":
        return "bg-indigo-600 hover:bg-indigo-700";
      default:
        return "bg-gray-600 hover:bg-gray-700";
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div
        className={`bg-white p-6 rounded-lg shadow-2xl w-full max-w-md border-l-4 ${getBgColor()}`}
      >
        <div className="flex items-start gap-3 mb-4">
          <span className="text-3xl">{getIcon()}</span>
          <div>
            <h2 className="text-lg font-bold">{title}</h2>
          </div>
        </div>

        <p className="text-gray-700 mb-6 leading-relaxed">{message}</p>

        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded font-semibold hover:bg-gray-300 transition"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 text-white rounded font-semibold transition ${getButtonColor()}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
