import { useEffect, useState } from "react";
import { create_product, fetch_product_by_id, update_product } from "../../api/products";
import { empty_admin_product_form, product_to_admin_form } from "../../utils/admin_product";
import { product_category_options } from "../../utils/product_categories";

const empty_image_row = "";

function AdminProductForm({ mode = "create", product_id = "", on_product_loaded }) {
  const is_edit = mode === "edit";
  const [form, set_form] = useState(empty_admin_product_form);
  const [loading, set_loading] = useState(is_edit);
  const [saving, set_saving] = useState(false);
  const [saved, set_saved] = useState(false);
  const [error, set_error] = useState("");

  useEffect(() => {
    if (!is_edit || !product_id) {
      return;
    }

    let active = true;
    set_loading(true);
    set_error("");

    fetch_product_by_id(product_id)
      .then((product) => {
        if (!active) {
          return;
        }

        if (!product) {
          set_error("Product not found.");
          return;
        }

        set_form(product_to_admin_form(product));
        on_product_loaded?.(product.name || "");
      })
      .catch(() => {
        if (active) {
          set_error("Could not load product.");
        }
      })
      .finally(() => {
        if (active) {
          set_loading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [is_edit, product_id]);

  const update_field = (field, value) => {
    set_form((prev) => ({ ...prev, [field]: value }));
    set_saved(false);
  };

  const toggle_category = (category) => {
    set_form((prev) => {
      const has_category = prev.categories.includes(category);
      return {
        ...prev,
        categories: has_category
          ? prev.categories.filter((item) => item !== category)
          : [...prev.categories, category],
      };
    });
    set_saved(false);
  };

  const update_image_link = (index, value) => {
    set_form((prev) => {
      const image_links = [...prev.image_links];
      image_links[index] = value;
      return { ...prev, image_links };
    });
    set_saved(false);
  };

  const add_image_row = () => {
    set_form((prev) => ({
      ...prev,
      image_links: [...prev.image_links, empty_image_row],
    }));
  };

  const remove_image_row = (index) => {
    set_form((prev) => {
      const image_links = prev.image_links.filter((_, item_index) => item_index !== index);
      return {
        ...prev,
        image_links: image_links.length > 0 ? image_links : [empty_image_row],
      };
    });
  };

  const handle_submit = async (event) => {
    event.preventDefault();
    set_saving(true);
    set_saved(false);
    set_error("");

    try {
      if (is_edit) {
        await update_product(product_id, form);
      } else {
        await create_product(form);
        set_form(empty_admin_product_form);
      }
      set_saved(true);
    } catch (submit_error) {
      set_error(submit_error.message || "Could not save product.");
    } finally {
      set_saving(false);
    }
  };

  if (loading) {
    return (
      <div className="sg-admin__panel sg-admin__product">
        <p className="sg-admin__muted">Loading product...</p>
      </div>
    );
  }

  if (is_edit && error && !form.name) {
    return (
      <div className="sg-admin__panel sg-admin__product">
        <p className="sg-admin__error">{error}</p>
      </div>
    );
  }

  return (
    <form className="sg-admin__panel sg-admin__product" onSubmit={handle_submit}>
      {!is_edit && <h2 className="sg-admin__panel-title">Add Product</h2>}

      <div className="sg-admin__field">
        <label className="sg-admin__label" htmlFor="admin-product-title">
          Title
        </label>
        <input
          id="admin-product-title"
          type="text"
          className="sg-admin__input"
          value={form.name}
          onChange={(event) => update_field("name", event.target.value)}
          placeholder="Heart Glow Tealights || 15gm"
        />
      </div>

      <div className="sg-admin__field">
        <label className="sg-admin__label" htmlFor="admin-product-scent">
          Scent tag
        </label>
        <input
          id="admin-product-scent"
          type="text"
          className="sg-admin__input"
          value={form.scent}
          onChange={(event) => update_field("scent", event.target.value)}
          placeholder="Romantic · Customizable"
        />
      </div>

      <div className="sg-admin__field">
        <label className="sg-admin__label" htmlFor="admin-product-description">
          Description
        </label>
        <textarea
          id="admin-product-description"
          className="sg-admin__textarea"
          rows={4}
          value={form.description}
          onChange={(event) => update_field("description", event.target.value)}
          placeholder="Write the product story..."
        />
      </div>

      <div className="sg-admin__field-row">
        <div className="sg-admin__field">
          <label className="sg-admin__label" htmlFor="admin-product-price">
            Price (₹)
          </label>
          <input
            id="admin-product-price"
            type="number"
            min="0"
            className="sg-admin__input"
            value={form.price}
            onChange={(event) => update_field("price", event.target.value)}
            placeholder="320"
          />
        </div>
        <div className="sg-admin__field">
          <label className="sg-admin__label" htmlFor="admin-product-original-price">
            Original price (₹)
          </label>
          <input
            id="admin-product-original-price"
            type="number"
            min="0"
            className="sg-admin__input"
            value={form.original_price}
            onChange={(event) => update_field("original_price", event.target.value)}
            placeholder="352"
          />
        </div>
      </div>

      <div className="sg-admin__field-row">
        <div className="sg-admin__field">
          <label className="sg-admin__label" htmlFor="admin-product-weight">
            Weight
          </label>
          <input
            id="admin-product-weight"
            type="text"
            className="sg-admin__input"
            value={form.weight}
            onChange={(event) => update_field("weight", event.target.value)}
            placeholder="15gm"
          />
        </div>
        <div className="sg-admin__field">
          <label className="sg-admin__label" htmlFor="admin-product-burn-time">
            Burn time
          </label>
          <input
            id="admin-product-burn-time"
            type="text"
            className="sg-admin__input"
            value={form.burn_time}
            onChange={(event) => update_field("burn_time", event.target.value)}
            placeholder="60 mins"
          />
        </div>
      </div>

      <div className="sg-admin__field-row">
        <div className="sg-admin__field">
          <label className="sg-admin__label" htmlFor="admin-product-rating">
            Rating
          </label>
          <input
            id="admin-product-rating"
            type="number"
            min="0"
            max="5"
            step="0.1"
            className="sg-admin__input"
            value={form.rating}
            onChange={(event) => update_field("rating", event.target.value)}
            placeholder="4.8"
          />
        </div>
        <div className="sg-admin__field sg-admin__field--toggle">
          <span className="sg-admin__label">Featured product</span>
          <label className="sg-admin__banner-toggle" title="Show on top of shop">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(event) => update_field("featured", event.target.checked)}
            />
            <span className="sg-admin__banner-toggle-track" aria-hidden="true" />
          </label>
        </div>
      </div>

      <div className="sg-admin__field">
        <label className="sg-admin__label" htmlFor="admin-product-details-heading">
          Details heading
        </label>
        <input
          id="admin-product-details-heading"
          type="text"
          className="sg-admin__input"
          value={form.details_heading}
          onChange={(event) => update_field("details_heading", event.target.value)}
          placeholder="Why You'll Love It"
        />
      </div>

      <div className="sg-admin__field">
        <label className="sg-admin__label" htmlFor="admin-product-details">
          Other details
        </label>
        <textarea
          id="admin-product-details"
          className="sg-admin__textarea"
          rows={4}
          value={form.details_text}
          onChange={(event) => update_field("details_text", event.target.value)}
          placeholder={"One detail per line\nHand-poured with premium wax"}
        />
      </div>

      <div className="sg-admin__field">
        <span className="sg-admin__label">Google Drive image links</span>
        <div className="sg-admin__image-links">
          {form.image_links.map((link, index) => (
            <div key={`image-link-${index}`} className="sg-admin__image-link-row">
              <input
                type="url"
                className="sg-admin__input"
                value={link}
                onChange={(event) => update_image_link(index, event.target.value)}
                placeholder="Paste Google Drive share link (Anyone with link can view)"
              />
              <button
                type="button"
                className="sg-admin__image-link-remove"
                onClick={() => remove_image_row(index)}
                aria-label="Remove image link"
              >
                ×
              </button>
            </div>
          ))}
        </div>
        <button type="button" className="sg-admin__link-btn" onClick={add_image_row}>
          + Add image link
        </button>
      </div>

      <div className="sg-admin__field">
        <span className="sg-admin__label">Categories</span>
        <div className="sg-admin__categories">
          {product_category_options.map((category) => {
            const is_active = form.categories.includes(category);

            return (
              <button
                key={category}
                type="button"
                className={`sg-admin__category${is_active ? " sg-admin__category--active" : ""}`}
                onClick={() => toggle_category(category)}
                aria-pressed={is_active}
              >
                {category}
              </button>
            );
          })}
        </div>
      </div>

      <div className="sg-admin__banner-actions">
        <button type="submit" className="sg-admin__save" disabled={saving}>
          {saving ? "Saving..." : is_edit ? "Save changes" : "Save product"}
        </button>
        {saved && <span className="sg-admin__success">{is_edit ? "Changes saved" : "Product saved"}</span>}
        {error && form.name && <span className="sg-admin__error">{error}</span>}
      </div>
    </form>
  );
}

export default AdminProductForm;
