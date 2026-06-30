import { Navigate, Outlet } from "react-router-dom";
import { useAdmin } from "../../context/AdminContext";

function AdminRoute() {
  const { is_admin, loading } = useAdmin();

  if (loading) {
    return (
      <div className="sg-admin-loading">
        <p>Checking access...</p>
      </div>
    );
  }

  if (!is_admin) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

export default AdminRoute;
