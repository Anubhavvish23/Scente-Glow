import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import AdminDeleteProductButton from "../../components/admin/AdminDeleteProductButton";
import AdminLayout from "../../components/admin/AdminLayout";
import AdminProductForm from "../../components/admin/AdminProductForm";
import "./Admin.css";

function AdminProductEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product_name, set_product_name] = useState("");

  const handle_deleted = () => {
    navigate("/admin/products");
  };

  return (
    <AdminLayout>
      <div className="sg-admin__panel-head-row sg-admin__panel-head-row--spaced">
        <h2 className="sg-admin__panel-title">Edit product</h2>
        <div className="sg-admin__panel-head-actions">
          {product_name && (
            <AdminDeleteProductButton
              product_id={id}
              product_name={product_name}
              on_deleted={handle_deleted}
            />
          )}
          <Link to="/admin/products" className="sg-admin__back-link">
            ← All products
          </Link>
        </div>
      </div>
      <AdminProductForm mode="edit" product_id={id} on_product_loaded={set_product_name} />
    </AdminLayout>
  );
}

export default AdminProductEdit;
