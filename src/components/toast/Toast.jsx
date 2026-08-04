import { useEffect } from "react";
import { createPortal } from "react-dom";
import "./Toast.css";

function Toast({ toast, on_hide }) {
  useEffect(() => {
    if (!toast) return undefined;
    const timer = window.setTimeout(on_hide, 3200);
    return () => window.clearTimeout(timer);
  }, [toast, on_hide]);

  if (!toast || typeof document === "undefined") return null;

  return createPortal(
    <div className="sg-toast" role="status" aria-live="polite">
      <span className="sg-toast__icon">✓</span>
      <span className="sg-toast__text">{toast.message}</span>
    </div>,
    document.body
  );
}

export default Toast;
