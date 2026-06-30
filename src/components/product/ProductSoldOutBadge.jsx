import "./ProductSoldOutBadge.css";

function ProductSoldOutBadge({ className = "" }) {
  return (
    <span className={`sg-product-sold-out${className ? ` ${className}` : ""}`}>
      Sold out
    </span>
  );
}

export default ProductSoldOutBadge;
