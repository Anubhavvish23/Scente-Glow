import { useEffect, useState } from "react";
import { fetch_products } from "../../api/products";
import { fetch_stats_summary } from "../../api/stats";

function format_stat_label(key, product_names, is_product = false) {
  if (is_product) {
    return product_names[key] || key.replace(/-/g, " ");
  }
  return key.replace(/_/g, " ");
}

function AdminStatsSection() {
  const [stats, set_stats] = useState(null);
  const [product_names, set_product_names] = useState({});
  const [loading, set_loading] = useState(true);

  useEffect(() => {
    let active = true;

    Promise.all([fetch_stats_summary(), fetch_products()])
      .then(([stats_data, products]) => {
        if (!active) {
          return;
        }

        const names = Object.fromEntries(products.map((product) => [product.id, product.name]));
        set_stats(stats_data);
        set_product_names(names);
        set_loading(false);
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

  return (
    <section className="sg-admin__panel sg-admin__stats">
      <h2 className="sg-admin__panel-title sg-admin__panel-title--left">Simple stats</h2>

      {loading ? (
        <p className="sg-admin__muted">Loading stats...</p>
      ) : (
        <>
          <div className="sg-admin__stats-grid">
            <div className="sg-admin__stat-card">
              <span className="sg-admin__stat-value">{stats.total_product_views}</span>
              <span className="sg-admin__stat-label">Product views</span>
            </div>
            <div className="sg-admin__stat-card">
              <span className="sg-admin__stat-value">{stats.total_cart_adds}</span>
              <span className="sg-admin__stat-label">Cart adds</span>
            </div>
            <div className="sg-admin__stat-card">
              <span className="sg-admin__stat-value">{stats.total_whatsapp_orders}</span>
              <span className="sg-admin__stat-label">WhatsApp orders</span>
            </div>
          </div>

          <div className="sg-admin__stats-lists">
            <div className="sg-admin__stats-block">
              <h3 className="sg-admin__stats-heading">Top viewed products</h3>
              {stats.top_product_views.length === 0 ? (
                <p className="sg-admin__muted">No data yet</p>
              ) : (
                <ul className="sg-admin__stats-list">
                  {stats.top_product_views.map((item) => (
                    <li key={`view-${item.key}`}>
                      <span>{format_stat_label(item.key, product_names, true)}</span>
                      <span>{item.count}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="sg-admin__stats-block">
              <h3 className="sg-admin__stats-heading">Top cart adds</h3>
              {stats.top_cart_adds.length === 0 ? (
                <p className="sg-admin__muted">No data yet</p>
              ) : (
                <ul className="sg-admin__stats-list">
                  {stats.top_cart_adds.map((item) => (
                    <li key={`cart-${item.key}`}>
                      <span>{format_stat_label(item.key, product_names, true)}</span>
                      <span>{item.count}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="sg-admin__stats-block">
              <h3 className="sg-admin__stats-heading">Popular fragrances</h3>
              {stats.top_fragrances.length === 0 ? (
                <p className="sg-admin__muted">No data yet</p>
              ) : (
                <ul className="sg-admin__stats-list">
                  {stats.top_fragrances.map((item) => (
                    <li key={`fragrance-${item.key}`}>
                      <span>{format_stat_label(item.key, product_names)}</span>
                      <span>{item.count}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </>
      )}
    </section>
  );
}

export default AdminStatsSection;
