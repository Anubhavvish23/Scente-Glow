import { format_product_rating, get_product_rating } from "../../utils/product";
import "./ProductRatingBadge.css";

function ProductRatingBadge({ product, rating, className = "" }) {
  const value = rating != null ? get_product_rating({ rating }) : get_product_rating(product);
  const display = value != null ? format_product_rating(value) : null;

  if (!display) {
    return null;
  }

  return (
    <span className={`sg-product-rating${className ? ` ${className}` : ""}`} aria-label={`${display} out of 5 stars`}>
      <span className="sg-product-rating__star" aria-hidden="true">
        ★
      </span>
      {display}
    </span>
  );
}

export default ProductRatingBadge;
