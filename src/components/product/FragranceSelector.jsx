import { useSiteSettings } from "../../context/SiteSettingsContext";
import { default_fragrances } from "../../utils/fragrances";
import "./FragranceSelector.css";

function FragranceSelector({ value, on_change, className = "" }) {
  const { fragrances } = useSiteSettings();
  const options = fragrances.length > 0 ? fragrances : default_fragrances;

  return (
    <div className={`sg-fragrance-selector ${className}`.trim()}>
      <p className="sg-fragrance-selector__label">Fragrance</p>
      <div className="sg-fragrance-selector__options">
        {options.map((fragrance) => {
          const is_active = value === fragrance;

          return (
            <button
              key={fragrance}
              type="button"
              className={`sg-fragrance-selector__option${is_active ? " sg-fragrance-selector__option--active" : ""}`}
              onClick={() => on_change(fragrance)}
              aria-pressed={is_active}
            >
              {fragrance}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default FragranceSelector;
