import { useEffect, useRef, useState } from "react";
import { useAdmin } from "../../context/AdminContext";
import "./AdminLoginModal.css";

function AdminLoginModal({ open, on_close, on_success }) {
  const { login } = useAdmin();
  const [password, set_password] = useState("");
  const [show_password, set_show_password] = useState(false);
  const [error, set_error] = useState("");
  const [submitting, set_submitting] = useState(false);
  const input_ref = useRef(null);

  useEffect(() => {
    if (!open) {
      set_password("");
      set_show_password(false);
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
          <div className="sg-admin-login-modal__password-wrap">
            <input
              ref={input_ref}
              id="sg-admin-password"
              type={show_password ? "text" : "password"}
              className="sg-admin-login-modal__input sg-admin-login-modal__input--password"
              value={password}
              onChange={(event) => set_password(event.target.value)}
              autoComplete="current-password"
              disabled={submitting}
            />
            <button
              type="button"
              className="sg-admin-login-modal__toggle-password"
              onClick={() => set_show_password((prev) => !prev)}
              aria-label={show_password ? "Hide password" : "Show password"}
              disabled={submitting}
            >
              {show_password ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                  <path d="M3 3l18 18M10.6 10.6a2 2 0 0 0 2.8 2.8M9.9 5.1A10.4 10.4 0 0 1 12 5c5.5 0 9.5 4.5 10.5 7- .4 1-1.2 2.4-2.5 3.7M6.1 6.1C4.3 7.4 3.2 9 2.5 12c1 2.5 5 7 9.5 7 1.4 0 2.7-.3 3.9-.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                  <path d="M2.5 12C3.5 9.5 7.5 5 12 5s8.5 4.5 9.5 7c-1 2.5-5 7-9.5 7s-8.5-4.5-9.5-7z" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </div>

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
