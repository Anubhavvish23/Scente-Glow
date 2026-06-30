import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "../firebase";
import {
  clear_login_attempts,
  get_admin_email,
  get_login_lockout,
  is_admin_email,
  map_auth_error,
  record_failed_login,
} from "../utils/admin_auth";

const AdminContext = createContext(null);

export function AdminProvider({ children }) {
  const [user, set_user] = useState(null);
  const [loading, set_loading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebase_user) => {
      if (firebase_user && is_admin_email(firebase_user.email)) {
        set_user(firebase_user);
      } else {
        if (firebase_user) {
          signOut(auth);
        }
        set_user(null);
      }
      set_loading(false);
    });

    return unsubscribe;
  }, []);

  const is_admin = Boolean(user);

  const login = async (password) => {
    const lockout = get_login_lockout();
    if (lockout.locked) {
      throw new Error(lockout.message);
    }

    const email = get_admin_email();
    if (!email) {
      throw new Error("Admin access is not configured.");
    }

    if (!password) {
      throw new Error("Password is required.");
    }

    try {
      const credential = await signInWithEmailAndPassword(auth, email, password);
      if (!is_admin_email(credential.user.email)) {
        await signOut(auth);
        throw new Error(map_auth_error());
      }
      clear_login_attempts();
      return credential.user;
    } catch (error) {
      record_failed_login();
      throw new Error(map_auth_error());
    }
  };

  const logout = async () => {
    await signOut(auth);
    set_user(null);
  };

  const value = useMemo(
    () => ({
      user,
      is_admin,
      loading,
      login,
      logout,
    }),
    [user, is_admin, loading]
  );

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdmin must be used within AdminProvider");
  }
  return context;
}
