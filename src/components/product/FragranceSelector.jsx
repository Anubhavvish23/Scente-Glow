import { get_product_fragrances } from "../../utils/fragrances";
import "./FragranceSelector.css";

function FragranceSelector({ product, value, on_change, className = "" }) {
  const options = get_product_fragrances(product);

  if (options.length === 0) {
    return null;
  }

  return (
    <div className={`sg-fragrance-selector ${className}`.trim()}>
      <p className="sg-fragrance-selector__label">Select fragrance</p>
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
