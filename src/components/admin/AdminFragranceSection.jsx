import { useState } from "react";
import { useSiteSettings } from "../../context/SiteSettingsContext";

function AdminFragranceSection() {
  const { fragrances, update_fragrances } = useSiteSettings();
  const [new_fragrance, set_new_fragrance] = useState("");
  const [saving, set_saving] = useState(false);
  const [saved, set_saved] = useState(false);
  const [error, set_error] = useState("");

  const handle_add = async (event) => {
    event.preventDefault();
    const name = new_fragrance.trim();

    if (!name) {
      set_error("Enter a fragrance name.");
      return;
    }

    const exists = fragrances.some(
      (item) => item.toLowerCase() === name.toLowerCase()
    );

    if (exists) {
      set_error("This fragrance already exists.");
      return;
    }

    set_saving(true);
    set_saved(false);
    set_error("");

    try {
      await update_fragrances([...fragrances, name]);
      set_new_fragrance("");
      set_saved(true);
    } catch (submit_error) {
      set_error(submit_error.message || "Could not save fragrance.");
    } finally {
      set_saving(false);
    }
  };

  const handle_remove = async (name) => {
    if (fragrances.length <= 1) {
      set_error("Keep at least one fragrance.");
      return;
    }

    set_saving(true);
    set_saved(false);
    set_error("");

    try {
      await update_fragrances(fragrances.filter((item) => item !== name));
      set_saved(true);
    } catch (submit_error) {
      set_error(submit_error.message || "Could not remove fragrance.");
    } finally {
      set_saving(false);
    }
  };

  return (
    <section className="sg-admin__panel sg-admin__fragrances">
      <h2 className="sg-admin__panel-title sg-admin__panel-title--left">Add Fragrance</h2>

      <form className="sg-admin__fragrance-form" onSubmit={handle_add}>
        <div className="sg-admin__fragrance-row">
          <input
            type="text"
            className="sg-admin__input"
            value={new_fragrance}
            onChange={(event) => {
              set_new_fragrance(event.target.value);
              set_saved(false);
              set_error("");
            }}
            placeholder="Rose Oud"
            aria-label="Fragrance name"
          />
          <button type="submit" className="sg-admin__save" disabled={saving}>
            {saving ? "Saving..." : "Add"}
          </button>
        </div>
      </form>

      <ul className="sg-admin__fragrance-list">
        {fragrances.map((fragrance) => (
          <li key={fragrance} className="sg-admin__fragrance-item">
            <span>{fragrance}</span>
            <button
              type="button"
              className="sg-admin__fragrance-remove"
              onClick={() => handle_remove(fragrance)}
              disabled={saving}
              aria-label={`Remove ${fragrance}`}
            >
              ×
            </button>
          </li>
        ))}
      </ul>

      <div className="sg-admin__banner-actions sg-admin__banner-actions--left">
        {saved && <span className="sg-admin__success">Saved</span>}
        {error && <span className="sg-admin__error">{error}</span>}
      </div>
    </section>
  );
}

export default AdminFragranceSection;
