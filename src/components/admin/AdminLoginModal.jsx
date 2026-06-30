import { useEffect, useRef, useState } from "react";
import { useAdmin } from "../../context/AdminContext";
import "./AdminLoginModal.css";

function AdminLoginModal({ open, on_close, on_success }) {
  const { login } = useAdmin();
  const [password, set_password] = useState("");
  const [error, set_error] = useState("");
  const [submitting, set_submitting] = useState(false);
  const input_ref = useRef(null);

  useEffect(() => {
    if (!open) {
      set_password("");
      set_error("");
      set_submitting(false);
      return undefined;
    }

    const previous_overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focus_timer = window.setTimeout(() => {
      input_ref.current?.focus();
    }, 0);

    const handle_escape = (event) => {
      if (event.key === "Escape") {
        on_close();
      }
    };

    window.addEventListener("keydown", handle_escape);

    return () => {
      document.body.style.overflow = previous_overflow;
      window.clearTimeout(focus_timer);
      window.removeEventListener("keydown", handle_escape);
    };
  }, [open, on_close]);

  if (!open) {
    return null;
  }

  const handle_submit = async (event) => {
    event.preventDefault();
    if (submitting) {
      return;
    }

    set_submitting(true);
    set_error("");

    try {
      await login(password);
      on_success();
      on_close();
    } catch (login_error) {
      set_error(login_error.message || "Invalid credentials. Please try again.");
    } finally {
      set_submitting(false);
    }
  };

  return (
    <div className="sg-admin-login-overlay" onClick={on_close}>
      <div
        className="sg-admin-login-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="sg-admin-login-title"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className="sg-admin-login-modal__close"
          onClick={on_close}
          aria-label="Close"
        >
          ×
        </button>

        <p className="sg-admin-login-modal__eyebrow">Scenté Glow</p>
        <h2 id="sg-admin-login-title" className="sg-admin-login-modal__title">
          Admin access
        </h2>
        <p className="sg-admin-login-modal__lead">Enter your admin password to continue.</p>

        <form className="sg-admin-login-modal__form" onSubmit={handle_submit}>
          <label className="sg-admin-login-modal__label" htmlFor="sg-admin-password">
            Password
          </label>
          <input
            ref={input_ref}
            id="sg-admin-password"
            type="password"
            className="sg-admin-login-modal__input"
            value={password}
            onChange={(event) => set_password(event.target.value)}
            autoComplete="current-password"
            disabled={submitting}
          />

          {error && <p className="sg-admin-login-modal__error">{error}</p>}

          <button
            type="submit"
            className="sg-admin-login-modal__submit"
            disabled={submitting || !password}
          >
            {submitting ? "Signing in..." : "Unlock admin"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminLoginModal;
