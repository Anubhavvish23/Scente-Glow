import { createContext, useCallback, useContext, useMemo, useState } from "react";
import Toast from "../components/toast/Toast";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toast, set_toast] = useState(null);

  const show_toast = useCallback((message) => {
    set_toast({ id: Date.now(), message });
  }, []);

  const hide_toast = useCallback(() => {
    set_toast(null);
  }, []);

  const value = useMemo(() => ({ show_toast }), [show_toast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <Toast toast={toast} on_hide={hide_toast} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
}
