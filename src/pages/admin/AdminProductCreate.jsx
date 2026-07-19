import { Link, useNavigate } from "react-router-dom";
import AdminLayout from "../../components/admin/AdminLayout";
import AdminProductForm from "../../components/admin/AdminProductForm";
import "./Admin.css";

function AdminProductCreate() {
  const navigate = useNavigate();

  const handle_created = (product_id) => {
    if (product_id) {
      navigate(`/admin/products/${product_id}/edit`);
      return;
    }
    navigate("/admin/products");
  };

  return (
    <AdminLayout>
      <div className="sg-admin__panel-head-row sg-admin__panel-head-row--spaced">
        <h2 className="sg-admin__panel-title">Add product</h2>
        <Link to="/admin/products" className="sg-admin__back-link">
          ← All products
        </Link>
      </div>
      <AdminProductForm mode="create" on_created={handle_created} />
    </AdminLayout>
  );
}

export default AdminProductCreate;
