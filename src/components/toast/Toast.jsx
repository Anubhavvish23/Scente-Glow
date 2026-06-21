import { useEffect } from "react";
import "./Toast.css";

function Toast({ toast, on_hide }) {
  useEffect(() => {
    if (!toast) return undefined;
    const timer = window.setTimeout(on_hide, 2800);
    return () => window.clearTimeout(timer);
  }, [toast, on_hide]);

  if (!toast) return null;

  return (
    <div className="sg-toast" role="status" aria-live="polite">
      <span className="sg-toast__icon">✓</span>
      <span className="sg-toast__text">{toast.message}</span>
    </div>
  );
}

export default Toast;
