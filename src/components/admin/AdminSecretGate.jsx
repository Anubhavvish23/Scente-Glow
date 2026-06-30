import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAdmin } from "../../context/AdminContext";
import { is_input_target } from "../../utils/admin_auth";
import AdminLoginModal from "./AdminLoginModal";

function AdminSecretGate() {
  const navigate = useNavigate();
  const { is_admin, loading } = useAdmin();
  const [modal_open, set_modal_open] = useState(false);

  useEffect(() => {
    const handle_keydown = (event) => {
      if (!event.altKey || event.key.toLowerCase() !== "a") {
        return;
      }

      if (is_input_target(event.target)) {
        return;
      }

      event.preventDefault();

      if (loading) {
        return;
      }

      if (is_admin) {
        navigate("/admin");
        return;
      }

      set_modal_open(true);
    };

    window.addEventListener("keydown", handle_keydown);
    return () => window.removeEventListener("keydown", handle_keydown);
  }, [is_admin, loading, navigate]);

  return (
    <AdminLoginModal
      open={modal_open}
      on_close={() => set_modal_open(false)}
      on_success={() => navigate("/admin")}
    />
  );
}

export default AdminSecretGate;
