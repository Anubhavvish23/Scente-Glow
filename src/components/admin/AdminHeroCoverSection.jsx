import { useEffect, useState } from "react";
import { useSiteSettings } from "../../context/SiteSettingsContext";

function AdminHeroCoverSection() {
  const { hero_cover, update_hero_cover } = useSiteSettings();
  const [cover_image, set_cover_image] = useState(hero_cover.cover_image || "");
  const [second_image, set_second_image] = useState(hero_cover.second_image || "");
  const [saving, set_saving] = useState(false);
  const [saved, set_saved] = useState(false);
  const [error, set_error] = useState("");

  useEffect(() => {
    set_cover_image(hero_cover.cover_image || "");
    set_second_image(hero_cover.second_image || "");
  }, [hero_cover.cover_image, hero_cover.second_image]);

  const handle_save = async (event) => {
    event.preventDefault();
    set_saving(true);
    set_saved(false);
    set_error("");

    try {
      await update_hero_cover({
        cover_image: cover_image.trim(),
        second_image: second_image.trim(),
      });
      set_saved(true);
    } catch (submit_error) {
      set_error(submit_error.message || "Could not save cover images.");
    } finally {
      set_saving(false);
    }
  };

  return (
    <section className="sg-admin__panel sg-admin__hero-cover">
      <h2 className="sg-admin__panel-title sg-admin__panel-title--left">Home cover images</h2>
      <p className="sg-admin__muted">
        Cover image shows first. If you add a second image, the home hero swaps every 2 seconds.
      </p>

      <form className="sg-admin__form" onSubmit={handle_save}>
        <div className="sg-admin__field">
          <label className="sg-admin__label" htmlFor="admin-hero-cover">
            Cover image
          </label>
          <input
            id="admin-hero-cover"
            type="url"
            className="sg-admin__input"
            value={cover_image}
            onChange={(event) => {
              set_cover_image(event.target.value);
              set_saved(false);
              set_error("");
            }}
            placeholder="Paste Google Drive link or /homepage.png"
          />
        </div>

        <div className="sg-admin__field">
          <label className="sg-admin__label" htmlFor="admin-hero-second">
            Second image (optional)
          </label>
          <input
            id="admin-hero-second"
            type="url"
            className="sg-admin__input"
            value={second_image}
            onChange={(event) => {
              set_second_image(event.target.value);
              set_saved(false);
              set_error("");
            }}
            placeholder="Paste Google Drive share link"
          />
        </div>

        <div className="sg-admin__banner-actions sg-admin__banner-actions--left">
          <button type="submit" className="sg-admin__save" disabled={saving}>
            {saving ? "Saving..." : "Save cover"}
          </button>
          {saved && <span className="sg-admin__success">Saved</span>}
          {error && <span className="sg-admin__error">{error}</span>}
        </div>
      </form>
    </section>
  );
}

export default AdminHeroCoverSection;
