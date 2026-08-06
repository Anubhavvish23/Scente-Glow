import { useState } from "react";
import { useSiteSettings } from "../../context/SiteSettingsContext";
import { default_product_categories } from "../../utils/product_categories";

function AdminCategorySection() {
  const { categories, update_categories } = useSiteSettings();
  const [new_category, set_new_category] = useState("");
  const [saving, set_saving] = useState(false);
  const [saved, set_saved] = useState(false);
  const [error, set_error] = useState("");

  const handle_add = async (event) => {
    event.preventDefault();
    const name = new_category.trim();

    if (!name) {
      set_error("Enter a category name.");
      return;
    }

    const exists = categories.some(
      (item) => item.toLowerCase() === name.toLowerCase()
    );

    if (exists) {
      set_error("This category already exists.");
      return;
    }

    set_saving(true);
    set_saved(false);
    set_error("");

    try {
      await update_categories([...categories, name]);
      set_new_category("");
      set_saved(true);
    } catch (submit_error) {
      set_error(submit_error.message || "Could not save category.");
    } finally {
      set_saving(false);
    }
  };

  const handle_remove = async (name) => {
    const is_default = default_product_categories.some(
      (item) => item.toLowerCase() === name.toLowerCase()
    );

    if (is_default) {
      set_error("Default categories cannot be removed.");
      return;
    }

    if (categories.length <= 1) {
      set_error("Keep at least one category.");
      return;
    }

    set_saving(true);
    set_saved(false);
    set_error("");

    try {
      await update_categories(categories.filter((item) => item !== name));
      set_saved(true);
    } catch (submit_error) {
      set_error(submit_error.message || "Could not remove category.");
    } finally {
      set_saving(false);
    }
  };

  return (
    <section className="sg-admin__panel sg-admin__categories-panel">
      <h2 className="sg-admin__panel-title sg-admin__panel-title--left">Add Category</h2>

      <form className="sg-admin__fragrance-form" onSubmit={handle_add}>
        <div className="sg-admin__fragrance-row">
          <input
            type="text"
            className="sg-admin__input"
            value={new_category}
            onChange={(event) => {
              set_new_category(event.target.value);
              set_saved(false);
              set_error("");
            }}
            placeholder="Wedding Collection"
            aria-label="Category name"
          />
          <button type="submit" className="sg-admin__save" disabled={saving}>
            {saving ? "Saving..." : "Add"}
          </button>
        </div>
      </form>

      <ul className="sg-admin__fragrance-list">
        {categories.map((category) => {
          const is_default = default_product_categories.some(
            (item) => item.toLowerCase() === category.toLowerCase()
          );

          return (
            <li key={category} className="sg-admin__fragrance-item">
              <span>{category}</span>
              {!is_default && (
                <button
                  type="button"
                  className="sg-admin__fragrance-remove"
                  onClick={() => handle_remove(category)}
                  disabled={saving}
                  aria-label={`Remove ${category}`}
                >
                  ×
                </button>
              )}
            </li>
          );
        })}
      </ul>

      <div className="sg-admin__banner-actions sg-admin__banner-actions--left">
        {saved && <span className="sg-admin__success">Saved</span>}
        {error && <span className="sg-admin__error">{error}</span>}
      </div>
    </section>
  );
}

export default AdminCategorySection;
