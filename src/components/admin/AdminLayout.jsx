import { Link, useNavigate } from "react-router-dom";
import { useAdmin } from "../../context/AdminContext";

function AdminLayout({ children }) {
  const navigate = useNavigate();
  const { logout } = useAdmin();

  const handle_logout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div className="sg-admin">
      <header className="sg-admin__header">
        <div className="sg-admin__header-start">
          <Link to="/admin" className="sg-admin__home-link">
            Admin dashboard
          </Link>
        </div>
        <div className="sg-admin__header-end">
          <Link to="/admin/products" className="sg-admin__view-products">
            View all products
          </Link>
          <button type="button" className="sg-admin__logout" onClick={handle_logout}>
            Log out
          </button>
        </div>
      </header>
      {children}
    </div>
  );
}

export default AdminLayout;
