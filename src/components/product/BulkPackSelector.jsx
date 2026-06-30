import { format_price, get_discount_percent } from "../../utils/pricing";
import { get_product_bulk_packs } from "../../utils/bulk_packs";
import "./BulkPackSelector.css";

function BulkPackSelector({ product, value, on_change, className = "" }) {
  const packs = get_product_bulk_packs(product);

  if (packs.length === 0) {
    return null;
  }

  return (
    <div className={`sg-bulk-pack-selector ${className}`.trim()}>
      <p className="sg-bulk-pack-selector__label">Bulk order</p>
      <div className="sg-bulk-pack-selector__options">
        {packs.map((pack) => {
          const is_active = value?.id === pack.id;
          const discount = get_discount_percent(pack.price, pack.original_price);

          return (
            <button
              key={pack.id}
              type="button"
              className={`sg-bulk-pack-selector__option${is_active ? " sg-bulk-pack-selector__option--active" : ""}`}
              onClick={() => on_change(pack)}
              aria-pressed={is_active}
            >
              <span className="sg-bulk-pack-selector__option-label">{pack.label}</span>
              <span className="sg-bulk-pack-selector__option-pricing">
                <span className="sg-bulk-pack-selector__option-price">
                  {format_price(pack.price)}
                </span>
                {pack.original_price > pack.price && (
                  <>
                    <span className="sg-bulk-pack-selector__option-original">
                      {format_price(pack.original_price)}
                    </span>
                    {discount > 0 && (
                      <span className="sg-bulk-pack-selector__option-discount">
                        {discount}% off
                      </span>
                    )}
                  </>
                )}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default BulkPackSelector;
