import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetch_products } from "../../api/products";
import AdminDeleteProductButton from "../../components/admin/AdminDeleteProductButton";
import AdminLayout from "../../components/admin/AdminLayout";
import "./Admin.css";

function AdminProductsList() {
  const [products, set_products] = useState([]);
  const [loading, set_loading] = useState(true);

  useEffect(() => {
    let active = true;

    fetch_products()
      .then((data) => {
        if (active) {
          set_products(data);
          set_loading(false);
        }
      })
      .catch(() => {
        if (active) {
          set_loading(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  const handle_deleted = (product_id) => {
    set_products((prev) => prev.filter((product) => product.id !== product_id));
  };

  return (
    <AdminLayout>
      <section className="sg-admin__panel sg-admin__products-list">
        <div className="sg-admin__panel-head-row">
          <h2 className="sg-admin__panel-title">All products</h2>
          <Link to="/admin" className="sg-admin__back-link">
            ← Back
          </Link>
        </div>

        {loading ? (
          <p className="sg-admin__muted">Loading products...</p>
        ) : products.length === 0 ? (
          <p className="sg-admin__muted">No products found.</p>
        ) : (
          <ul className="sg-admin__product-names">
            {products.map((product) => (
              <li key={product.id} className="sg-admin__product-row">
                <Link
                  to={`/admin/products/${product.id}/edit`}
                  className="sg-admin__product-name-link"
                >
                  {product.name}
                </Link>
                <AdminDeleteProductButton
                  product_id={product.id}
                  product_name={product.name}
                  on_deleted={handle_deleted}
                />
              </li>
            ))}
          </ul>
        )}
      </section>
    </AdminLayout>
  );
}

export default AdminProductsList;
