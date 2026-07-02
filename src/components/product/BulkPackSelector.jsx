import { useEffect, useState } from "react";
import { format_price, get_discount_percent } from "../../utils/pricing";
import { get_product_bulk_packs } from "../../utils/bulk_packs";
import "./BulkPackSelector.css";

function BulkPackSelector({
  product,
  value,
  on_change,
  className = "",
  reveal_prices_on_click = false,
}) {
  const packs = get_product_bulk_packs(product);
  const [revealed_pack_ids, set_revealed_pack_ids] = useState(() => new Set());

  useEffect(() => {
    set_revealed_pack_ids(new Set());
  }, [product?.id]);

  if (packs.length === 0) {
    return null;
  }

  const handle_pack_click = (pack) => {
    if (reveal_prices_on_click) {
      set_revealed_pack_ids((prev) => {
        const next = new Set(prev);
        next.add(pack.id);
        return next;
      });
    }
    on_change(pack);
  };

  return (
    <div className={`sg-bulk-pack-selector ${className}`.trim()}>
      <p className="sg-bulk-pack-selector__label">Packages</p>
      <div className="sg-bulk-pack-selector__options">
        {packs.map((pack) => {
          const is_active = value?.id === pack.id;
          const show_price = !reveal_prices_on_click || revealed_pack_ids.has(pack.id);
          const discount = get_discount_percent(pack.price, pack.original_price);

          return (
            <button
              key={pack.id}
              type="button"
              className={`sg-bulk-pack-selector__option${is_active ? " sg-bulk-pack-selector__option--active" : ""}`}
              onClick={() => handle_pack_click(pack)}
              aria-pressed={is_active}
            >
              <span className="sg-bulk-pack-selector__option-label">{pack.label}</span>
              {show_price ? (
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
              ) : (
                <span className="sg-bulk-pack-selector__option-hint">View price</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default BulkPackSelector;
