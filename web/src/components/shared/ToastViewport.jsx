import { useAdminData } from "../../store/adminData";

const toneStyles = {
  success: "bg-green-50 border-green-200 text-green-800",
  danger:  "bg-red-50 border-red-200 text-red-800",
  warning: "bg-yellow-50 border-yellow-200 text-yellow-800",
  info:    "bg-blue-50 border-blue-200 text-blue-800"
};

export function ToastViewport() {
  const { toasts, dismissToast } = useAdminData();

  return (
    <div
      className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 w-80"
      aria-live="polite"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-start justify-between gap-3 px-4 py-3 rounded-xl border text-sm font-medium shadow-card animate-in fade-in slide-in-from-bottom-2 ${toneStyles[toast.tone] || toneStyles.success}`}
        >
          <span>{toast.message}</span>
          <button
            type="button"
            onClick={() => dismissToast(toast.id)}
            className="opacity-60 hover:opacity-100 text-lg leading-none transition-opacity shrink-0"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}
