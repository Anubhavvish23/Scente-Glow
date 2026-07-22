import { Link } from "react-router-dom";
import { useProductsCatalog } from "../../context/ProductsCatalogContext";
import AdminDeleteProductButton from "../../components/admin/AdminDeleteProductButton";
import AdminLayout from "../../components/admin/AdminLayout";
import "./Admin.css";

function AdminProductsList() {
  const { products, loading, refresh_products, remove_product_locally } = useProductsCatalog();

  const handle_deleted = async (product_id) => {
    remove_product_locally(product_id);
    await refresh_products();
  };

  return (
    <AdminLayout>
      <section className="sg-admin__panel sg-admin__products-list">
        <div className="sg-admin__panel-head-row sg-admin__panel-head-row--spaced">
          <h2 className="sg-admin__panel-title">All products</h2>
          <div className="sg-admin__panel-head-actions">
            <Link to="/admin/products/new" className="sg-admin__add-product-btn">
              + Add product
            </Link>
            <Link to="/admin" className="sg-admin__back-link">
              ← Back
            </Link>
          </div>
        </div>

        {loading ? (
          <p className="sg-admin__muted">Loading products...</p>
        ) : products.length === 0 ? (
          <div className="sg-admin__empty-products">
            <p className="sg-admin__muted">No products found.</p>
            <Link to="/admin/products/new" className="sg-admin__add-product-btn">
              + Add product
            </Link>
          </div>
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
