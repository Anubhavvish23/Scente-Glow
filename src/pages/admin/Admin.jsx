import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetch_products } from "../../api/products";
import { useSiteSettings } from "../../context/SiteSettingsContext";
import AdminLayout from "../../components/admin/AdminLayout";
import AdminFragranceSection from "../../components/admin/AdminFragranceSection";
import "./Admin.css";

const preview_limit = 5;

function Admin() {
  const { sale_banner_settings, update_sale_banner } = useSiteSettings();
  const [enabled, set_enabled] = useState(sale_banner_settings.enabled);
  const [code, set_code] = useState(sale_banner_settings.code || "");
  const [percent, set_percent] = useState(
    sale_banner_settings.percent === "" || sale_banner_settings.percent == null
      ? ""
      : String(sale_banner_settings.percent)
  );
  const [saving, set_saving] = useState(false);
  const [saved, set_saved] = useState(false);
  const [error, set_error] = useState("");
  const [products, set_products] = useState([]);
  const [products_loading, set_products_loading] = useState(true);

  useEffect(() => {
    set_enabled(sale_banner_settings.enabled);
    set_code(sale_banner_settings.code || "");
    set_percent(
      sale_banner_settings.percent === "" || sale_banner_settings.percent == null
        ? ""
        : String(sale_banner_settings.percent)
    );
  }, [sale_banner_settings]);

  useEffect(() => {
    let active = true;

    fetch_products()
      .then((data) => {
        if (active) {
          set_products(data.slice(0, preview_limit));
          set_products_loading(false);
        }
      })
      .catch(() => {
        if (active) {
          set_products_loading(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  const handle_save = async (event) => {
    event.preventDefault();
    set_saving(true);
    set_saved(false);
    set_error("");

    try {
      await update_sale_banner({
        enabled,
        code: code.trim(),
        percent: percent === "" ? "" : Number(percent),
      });
      set_saved(true);
    } catch {
      set_error("Could not save. Try again.");
    } finally {
      set_saving(false);
    }
  };

  return (
    <AdminLayout>
      <form className="sg-admin__banner" onSubmit={handle_save}>
        <h2 className="sg-admin__banner-title">Add Banner</h2>
        <div className="sg-admin__banner-row">
          <p className="sg-admin__banner-text">
            Use code{" "}
            <input
              type="text"
              className="sg-admin__banner-input sg-admin__banner-input--code"
              value={code}
              onChange={(event) => set_code(event.target.value.toUpperCase())}
              placeholder="CODE"
              aria-label="Coupon code"
            />{" "}
            for{" "}
            <input
              type="number"
              min="0"
              max="100"
              className="sg-admin__banner-input sg-admin__banner-input--percent"
              value={percent}
              onChange={(event) => set_percent(event.target.value)}
              placeholder="10"
              aria-label="Discount percentage"
            />
            % off on your order
          </p>

          <label className="sg-admin__banner-toggle" title="Enable banner">
            <input
              type="checkbox"
              checked={enabled}
              onChange={(event) => set_enabled(event.target.checked)}
            />
            <span className="sg-admin__banner-toggle-track" aria-hidden="true" />
          </label>
        </div>

        <div className="sg-admin__banner-actions">
          <button type="submit" className="sg-admin__save" disabled={saving}>
            {saving ? "Saving..." : "Save"}
          </button>
          {saved && <span className="sg-admin__success">Saved</span>}
          {error && <span className="sg-admin__error">{error}</span>}
        </div>
      </form>

      <AdminFragranceSection />

      <section className="sg-admin__panel sg-admin__products-preview">
        <h2 className="sg-admin__panel-title sg-admin__panel-title--left">Products</h2>

        {products_loading ? (
          <p className="sg-admin__muted">Loading products...</p>
        ) : products.length === 0 ? (
          <p className="sg-admin__muted">No products found.</p>
        ) : (
          <ul className="sg-admin__product-names">
            {products.map((product) => (
              <li key={product.id}>
                <Link
                  to={`/admin/products/${product.id}/edit`}
                  className="sg-admin__product-name-link"
                >
                  {product.name}
                </Link>
              </li>
            ))}
          </ul>
        )}

        <div className="sg-admin__preview-actions">
          <Link to="/admin/products" className="sg-admin__view-all-btn">
            View all
          </Link>
        </div>
      </section>
    </AdminLayout>
  );
}

export default Admin;
