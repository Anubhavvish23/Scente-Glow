import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { create_product, fetch_product_by_id, update_product } from "../../api/products";
import { useProductsCatalog } from "../../context/ProductsCatalogContext";
import { empty_admin_product_form, product_to_admin_form } from "../../utils/admin_product";
import { normalize_hex } from "../../utils/colours";
import { useSiteSettings } from "../../context/SiteSettingsContext";
import {
  default_product_categories,
  normalize_categories,
} from "../../utils/product_categories";

const empty_image_row = "";

function AdminProductForm({ mode = "create", product_id = "", on_product_loaded, on_created }) {
  const is_edit = mode === "edit";
  const { products, refresh_products } = useProductsCatalog();
  const { categories: site_categories } = useSiteSettings();
  const category_options = normalize_categories([
    ...(site_categories?.length > 0 ? site_categories : default_product_categories),
    ...form.categories,
  ]);
  const [form, set_form] = useState(empty_admin_product_form);
  const [loading, set_loading] = useState(is_edit);
  const [saving, set_saving] = useState(false);
  const [saved, set_saved] = useState(false);
  const [error, set_error] = useState("");
  const [new_colour_name, set_new_colour_name] = useState("");
  const [new_colour_hex, set_new_colour_hex] = useState("#f4a6c1");
  const [new_fragrance, set_new_fragrance] = useState("");

  useEffect(() => {
    if (!is_edit || !product_id) {
      set_loading(false);
      return;
    }

    let active = true;
    set_loading(true);
    set_error("");

    const cached = products.find((product) => product.id === product_id);
    if (cached) {
      set_form(product_to_admin_form(cached));
      on_product_loaded?.(cached.name || "");
      set_loading(false);
    }

    fetch_product_by_id(product_id)
      .then((product) => {
        if (!active) {
          return;
        }

        if (!product) {
          set_error("Product not found or was deleted.");
          set_form(empty_admin_product_form);
          on_product_loaded?.("");
          return;
        }

        set_form(product_to_admin_form(product));
        on_product_loaded?.(product.name || "");
      })
      .catch((load_error) => {
        if (active) {
          set_error(load_error?.message || "Could not load product.");
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
    set_error("");
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

  const update_pack_row = (index, field, value) => {
    set_form((prev) => {
      const pack_rows = [...prev.pack_rows];
      pack_rows[index] = { ...pack_rows[index], [field]: value };
      return { ...prev, pack_rows };
    });
    set_saved(false);
  };

  const add_colour = () => {
    const name = new_colour_name.trim();
    const hex = normalize_hex(new_colour_hex);

    if (!name) {
      set_error("Enter a colour name.");
      return;
    }

    if (!hex) {
      set_error("Pick a valid colour.");
      return;
    }

    const exists = form.custom_colours.some(
      (item) => item.name.toLowerCase() === name.toLowerCase()
    );

    if (exists) {
      set_error("This colour already exists for this product.");
      return;
    }

    set_form((prev) => ({
      ...prev,
      custom_colours: [...prev.custom_colours, { name, hex }],
    }));
    set_new_colour_name("");
    set_new_colour_hex("#f4a6c1");
    set_saved(false);
    set_error("");
  };

  const remove_colour = (name) => {
    set_form((prev) => ({
      ...prev,
      custom_colours: prev.custom_colours.filter((item) => item.name !== name),
    }));
    set_saved(false);
  };

  const add_fragrance = () => {
    const name = new_fragrance.trim();

    if (!name) {
      set_error("Enter a fragrance name.");
      return;
    }

    const exists = form.custom_fragrances.some(
      (item) => item.toLowerCase() === name.toLowerCase()
    );

    if (exists) {
      set_error("This fragrance already exists for this product.");
      return;
    }

    set_form((prev) => ({
      ...prev,
      custom_fragrances: [...prev.custom_fragrances, name],
    }));
    set_new_fragrance("");
    set_saved(false);
    set_error("");
  };

  const remove_fragrance = (name) => {
    set_form((prev) => ({
      ...prev,
      custom_fragrances: prev.custom_fragrances.filter((item) => item !== name),
    }));
    set_saved(false);
  };

  const handle_submit = async (event) => {
    event.preventDefault();
    set_saving(true);
    set_saved(false);
    set_error("");

    if (form.colours_enabled && form.custom_colours.length === 0) {
      set_error("Add at least one colour or turn off colour options.");
      set_saving(false);
      return;
    }

    if (form.fragrances_enabled && form.custom_fragrances.length === 0) {
      set_error("Add at least one fragrance or turn off fragrance options.");
      set_saving(false);
      return;
    }

    try {
      if (is_edit) {
        await update_product(product_id, form);
      } else {
        const created = await create_product(form);
        await refresh_products();
        set_saved(true);
        if (typeof on_created === "function") {
          on_created(created?.id || "");
          return;
        }
        set_form(empty_admin_product_form);
      }

      await refresh_products();
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
        <Link to="/admin/products" className="sg-admin__back-link">
          ← All products
        </Link>
      </div>
    );
  }

  return (
    <form className="sg-admin__panel sg-admin__product" onSubmit={handle_submit}>
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
      </div>

      <div className="sg-admin__toggle-grid sg-admin__toggle-grid--status">
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
        <div className="sg-admin__field sg-admin__field--toggle">
          <span className="sg-admin__label">Sold out</span>
          <label className="sg-admin__banner-toggle" title="Mark as sold out on shop">
            <input
              type="checkbox"
              checked={form.sold_out}
              onChange={(event) => update_field("sold_out", event.target.checked)}
            />
            <span className="sg-admin__banner-toggle-track" aria-hidden="true" />
          </label>
        </div>
      </div>

      <div className="sg-admin__option-bars">
        <div className="sg-admin__option-bar">
          <div className="sg-admin__option-bar-head">
            <span className="sg-admin__option-bar-label">Colour options</span>
            <label className="sg-admin__banner-toggle" title="Let customers pick a wax colour">
              <input
                type="checkbox"
                checked={form.colours_enabled}
                onChange={(event) => update_field("colours_enabled", event.target.checked)}
              />
              <span className="sg-admin__banner-toggle-track" aria-hidden="true" />
            </label>
          </div>
          {form.colours_enabled && (
            <div className="sg-admin__field sg-admin__colour-section">
              <div className="sg-admin__colour-row">
                <input
                  type="color"
                  className="sg-admin__colour-picker"
                  value={new_colour_hex}
                  onChange={(event) => set_new_colour_hex(event.target.value)}
                  aria-label="Colour swatch"
                />
                <input
                  type="text"
                  className="sg-admin__input"
                  value={new_colour_name}
                  onChange={(event) => set_new_colour_name(event.target.value)}
                  placeholder="Blush Petal"
                  aria-label="Colour name"
                />
                <button type="button" className="sg-admin__save" onClick={add_colour}>
                  Add
                </button>
              </div>

              {form.custom_colours.length > 0 && (
                <ul className="sg-admin__colour-list">
                  {form.custom_colours.map((colour) => (
                    <li key={colour.name} className="sg-admin__colour-item">
                      <span
                        className="sg-admin__colour-swatch"
                        style={{ backgroundColor: colour.hex }}
                        aria-hidden="true"
                      />
                      <span>{colour.name}</span>
                      <button
                        type="button"
                        className="sg-admin__colour-remove"
                        onClick={() => remove_colour(colour.name)}
                        aria-label={`Remove ${colour.name}`}
                      >
                        ×
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>

        <div className="sg-admin__option-bar">
          <div className="sg-admin__option-bar-head">
            <span className="sg-admin__option-bar-label">Letter options</span>
            <label className="sg-admin__banner-toggle" title="Let customers pick a letter">
              <input
                type="checkbox"
                checked={form.letters_enabled}
                onChange={(event) => update_field("letters_enabled", event.target.checked)}
              />
              <span className="sg-admin__banner-toggle-track" aria-hidden="true" />
            </label>
          </div>
        </div>

        <div className="sg-admin__option-bar">
          <div className="sg-admin__option-bar-head">
            <span className="sg-admin__option-bar-label">Fragrance options</span>
            <label className="sg-admin__banner-toggle" title="Let customers pick a fragrance">
              <input
                type="checkbox"
                checked={form.fragrances_enabled}
                onChange={(event) => update_field("fragrances_enabled", event.target.checked)}
              />
              <span className="sg-admin__banner-toggle-track" aria-hidden="true" />
            </label>
          </div>
          {form.fragrances_enabled && (
            <div className="sg-admin__field sg-admin__product-fragrance-section">
              <div className="sg-admin__fragrance-row">
                <input
                  type="text"
                  className="sg-admin__input"
                  value={new_fragrance}
                  onChange={(event) => set_new_fragrance(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      add_fragrance();
                    }
                  }}
                  placeholder="Rose Oud"
                  aria-label="Fragrance name"
                />
                <button type="button" className="sg-admin__save" onClick={add_fragrance}>
                  Add
                </button>
              </div>

              {form.custom_fragrances.length > 0 && (
                <ul className="sg-admin__fragrance-list">
                  {form.custom_fragrances.map((fragrance) => (
                    <li key={fragrance} className="sg-admin__fragrance-item">
                      <span>{fragrance}</span>
                      <button
                        type="button"
                        className="sg-admin__fragrance-remove"
                        onClick={() => remove_fragrance(fragrance)}
                        aria-label={`Remove ${fragrance}`}
                      >
                        ×
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>

        <div className="sg-admin__option-bar">
          <div className="sg-admin__option-bar-head">
            <span className="sg-admin__option-bar-label">Package options</span>
            <label className="sg-admin__banner-toggle" title="Add bulk package prices">
              <input
                type="checkbox"
                checked={form.packages_visible}
                onChange={(event) => update_field("packages_visible", event.target.checked)}
              />
              <span className="sg-admin__banner-toggle-track" aria-hidden="true" />
            </label>
          </div>
          {form.packages_visible && (
            <div className="sg-admin__field sg-admin__package-section">
              <ul className="sg-admin__package-lines">
                {form.pack_rows.map((row, index) => (
                  <li key={`pack-line-${index}`}>
                    <p className="sg-admin__banner-text sg-admin__banner-text--package">
                      pack of{" "}
                      <input
                        type="number"
                        min="1"
                        className="sg-admin__banner-input sg-admin__banner-input--pack-size"
                        value={row.size}
                        onChange={(event) => update_pack_row(index, "size", event.target.value)}
                        placeholder="10"
                        aria-label={`Package ${index + 1} size`}
                      />{" "}
                      at{" "}
                      <input
                        type="number"
                        min="0"
                        className="sg-admin__banner-input sg-admin__banner-input--pack-price"
                        value={row.price}
                        onChange={(event) => update_pack_row(index, "price", event.target.value)}
                        placeholder="320"
                        aria-label={`Package ${index + 1} price`}
                      />{" "}
                      <input
                        type="number"
                        min="0"
                        max="100"
                        className="sg-admin__banner-input sg-admin__banner-input--pack-discount"
                        value={row.discount_percent}
                        onChange={(event) =>
                          update_pack_row(index, "discount_percent", event.target.value)
                        }
                        placeholder="10"
                        aria-label={`Package ${index + 1} discount`}
                      />
                      % off
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          )}
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
          {category_options.map((category) => {
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
