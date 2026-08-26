import React, { useEffect, useState } from "react";
import { CheckCircle2, AlertCircle, X, Info, Trash2 } from "lucide-react";

export type ToastType = "success" | "error" | "info" | "delete";

interface CmsToastProps {
  message: { type: ToastType; text: string } | null;
  onClose?: () => void;
  /** Durasi auto-dismiss dalam milidetik. Default 4000. Set 0 untuk nonaktif. */
  duration?: number;
}

export const CmsToast: React.FC<CmsToastProps> = ({
  message,
  onClose,
  duration = 4000,
}) => {
  const [visible, setVisible] = useState(false);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    if (!message) {
      setVisible(false);
      setExiting(false);
      return;
    }

    setExiting(false);
    setVisible(true);

    if (duration <= 0) return;

    const timer = setTimeout(() => {
      dismiss();
    }, duration);

    return () => clearTimeout(timer);
  }, [message, duration]);

  const dismiss = () => {
    setExiting(true);
    setTimeout(() => {
      setVisible(false);
      onClose?.();
    }, 350);
  };

  if (!visible || !message) return null;

  const config = {
    success: {
      icon: <CheckCircle2 size={20} className="shrink-0 text-emerald-500" />,
      bar: "bg-emerald-500",
      bg: "bg-white border-l-4 border-emerald-500",
      title: "Berhasil",
      titleColor: "text-emerald-700",
      textColor: "text-slate-700",
    },
    error: {
      icon: <AlertCircle size={20} className="shrink-0 text-red-500" />,
      bar: "bg-red-500",
      bg: "bg-white border-l-4 border-red-500",
      title: "Terjadi Kesalahan",
      titleColor: "text-red-700",
      textColor: "text-slate-700",
    },
    info: {
      icon: <Info size={20} className="shrink-0 text-blue-500" />,
      bar: "bg-blue-500",
      bg: "bg-white border-l-4 border-blue-500",
      title: "Informasi",
      titleColor: "text-blue-700",
      textColor: "text-slate-700",
    },
    delete: {
      icon: <Trash2 size={20} className="shrink-0 text-rose-500" />,
      bar: "bg-rose-500",
      bg: "bg-white border-l-4 border-rose-500",
      title: "Berhasil Dihapus",
      titleColor: "text-rose-700",
      textColor: "text-slate-700",
    },
  };

  const c = config[message.type];

  return (
    <div
      className={`fixed bottom-6 right-6 z-[9999] max-w-sm w-full pointer-events-auto transition-all duration-350 ease-in-out ${
        exiting
          ? "opacity-0 translate-y-3 scale-95"
          : "opacity-100 translate-y-0 scale-100"
      }`}
      style={{ willChange: "transform, opacity" }}
    >
      <div
        className={`${c.bg} rounded-xl shadow-xl overflow-hidden flex flex-col`}
        style={{ boxShadow: "0 8px 32px 0 rgba(0,0,0,0.12)" }}
      >
        <div className="flex items-start gap-3 px-4 py-3.5">
          {c.icon}
          <div className="flex-1 min-w-0">
            <p className={`text-xs font-bold uppercase tracking-wider ${c.titleColor}`}>
              {c.title}
            </p>
            <p className={`text-sm mt-0.5 leading-snug ${c.textColor}`}>
              {message.text}
            </p>
          </div>
          <button
            onClick={dismiss}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer shrink-0"
          >
            <X size={15} />
          </button>
        </div>
        {/* Progress bar countdown */}
        {duration > 0 && (
          <div className={`h-0.5 ${c.bar} origin-left`}
            style={{
              animation: `toast-shrink ${duration}ms linear forwards`,
            }}
          />
        )}
      </div>

      <style>{`
        @keyframes toast-shrink {
          from { transform: scaleX(1); }
          to   { transform: scaleX(0); }
        }
      `}</style>
    </div>
  );
};
