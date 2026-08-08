import { useEffect, useState } from "react";
import { useSiteSettings } from "../../context/SiteSettingsContext";
import { get_hero_cover_images } from "../../utils/hero_cover";

const empty_image_row = "";

function AdminHeroCoverSection() {
  const { hero_cover, update_hero_cover } = useSiteSettings();
  const [image_links, set_image_links] = useState(() => {
    const images = get_hero_cover_images(hero_cover);
    return images.length > 0 ? images : [empty_image_row];
  });
  const [saving, set_saving] = useState(false);
  const [saved, set_saved] = useState(false);
  const [error, set_error] = useState("");

  useEffect(() => {
    const images = get_hero_cover_images(hero_cover);
    set_image_links(images.length > 0 ? images : [empty_image_row]);
  }, [hero_cover]);

  const update_image_link = (index, value) => {
    set_image_links((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
    set_saved(false);
    set_error("");
  };

  const add_image_row = () => {
    set_image_links((prev) => [...prev, empty_image_row]);
    set_saved(false);
    set_error("");
  };

  const remove_image_row = (index) => {
    set_image_links((prev) => {
      const next = prev.filter((_, item_index) => item_index !== index);
      return next.length > 0 ? next : [empty_image_row];
    });
    set_saved(false);
    set_error("");
  };

  const handle_save = async (event) => {
    event.preventDefault();
    set_saving(true);
    set_saved(false);
    set_error("");

    const images = image_links.map((link) => link.trim()).filter(Boolean);

    if (images.length === 0) {
      set_error("Add at least one cover image.");
      set_saving(false);
      return;
    }

    try {
      await update_hero_cover({ images });
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
        First image is the cover. Extra images swap on the home hero every 2 seconds.
      </p>

      <form className="sg-admin__form" onSubmit={handle_save}>
        <div className="sg-admin__field">
          <div className="sg-admin__image-links">
            {image_links.map((link, index) => (
              <div key={`hero-image-${index}`} className="sg-admin__image-link-row">
                <input
                  type="text"
                  className="sg-admin__input"
                  value={link}
                  onChange={(event) => update_image_link(index, event.target.value)}
                  placeholder={
                    index === 0
                      ? "Cover image — Drive link or /homepage.png"
                      : "Paste Google Drive share link"
                  }
                  aria-label={index === 0 ? "Cover image" : `Cover image ${index + 1}`}
                />
                <button
                  type="button"
                  className="sg-admin__image-link-remove"
                  onClick={() => remove_image_row(index)}
                  aria-label="Remove image"
                  disabled={image_links.length <= 1}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          <button type="button" className="sg-admin__link-btn" onClick={add_image_row}>
            + Add image
          </button>
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
