const admin_email = (import.meta.env.VITE_ADMIN_EMAIL || "").trim().toLowerCase();
const max_attempts = 5;
const lockout_ms = 15 * 60 * 1000;
const attempt_storage_key = "sg_admin_login_attempts";

export function get_admin_email() {
  return admin_email;
}

export function is_admin_email(email) {
  if (!admin_email || !email) {
    return false;
  }
  return email.trim().toLowerCase() === admin_email;
}

export function is_input_target(target) {
  if (!(target instanceof HTMLElement)) {
    return false;
  }
  const tag = target.tagName.toLowerCase();
  return (
    tag === "input" ||
    tag === "textarea" ||
    tag === "select" ||
    target.isContentEditable
  );
}

function read_attempt_state() {
  try {
    const raw = sessionStorage.getItem(attempt_storage_key);
    if (!raw) {
      return { count: 0, locked_until: 0 };
    }
    const parsed = JSON.parse(raw);
    return {
      count: Number(parsed.count) || 0,
      locked_until: Number(parsed.locked_until) || 0,
    };
  } catch {
    return { count: 0, locked_until: 0 };
  }
}

function write_attempt_state(state) {
  sessionStorage.setItem(attempt_storage_key, JSON.stringify(state));
}

export function get_login_lockout() {
  const state = read_attempt_state();
  const now = Date.now();

  if (state.locked_until > now) {
    const minutes_left = Math.ceil((state.locked_until - now) / 60000);
    return {
      locked: true,
      message: `Too many attempts. Try again in ${minutes_left} minute${minutes_left === 1 ? "" : "s"}.`,
    };
  }

  if (state.locked_until > 0 && state.locked_until <= now) {
    write_attempt_state({ count: 0, locked_until: 0 });
  }

  return { locked: false, message: "" };
}

export function record_failed_login() {
  const state = read_attempt_state();
  const next_count = state.count + 1;

  if (next_count >= max_attempts) {
    write_attempt_state({ count: next_count, locked_until: Date.now() + lockout_ms });
    return;
  }

  write_attempt_state({ count: next_count, locked_until: 0 });
}

export function clear_login_attempts() {
  sessionStorage.removeItem(attempt_storage_key);
}

export function map_auth_error() {
  return "Invalid credentials. Please try again.";
}
