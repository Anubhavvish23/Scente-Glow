import { format_price, get_discount_percent } from "../../utils/pricing";
import "./ProductPricing.css";

function ProductPricing({ price, original_price, compact = false }) {
  const discount = get_discount_percent(price, original_price);
  const has_discount = discount > 0;

  return (
    <div className={`sg-pricing ${compact ? "sg-pricing--compact" : ""}`}>
      <span className="sg-pricing__current">{format_price(price)}</span>
      {has_discount && (
        <>
          <span className="sg-pricing__original">{format_price(original_price)}</span>
          <span className="sg-pricing__discount">{discount}% off</span>
        </>
      )}
    </div>
  );
}

export default ProductPricing;
