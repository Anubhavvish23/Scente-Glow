import "./ProductPageSkeleton.css";

function ProductPageSkeleton() {
  return (
    <div className="sg-product-skeleton">
      <div className="sg-product-skeleton__back" />
      <div className="sg-product-skeleton__layout">
        <div className="sg-product-skeleton__gallery" />
        <div className="sg-product-skeleton__panel">
          <div className="sg-product-skeleton__line sg-product-skeleton__line--sm" />
          <div className="sg-product-skeleton__line sg-product-skeleton__line--lg" />
          <div className="sg-product-skeleton__line sg-product-skeleton__line--md" />
          <div className="sg-product-skeleton__line sg-product-skeleton__line--price" />
          <div className="sg-product-skeleton__block" />
          <div className="sg-product-skeleton__btn" />
        </div>
      </div>
    </div>
  );
}

export default ProductPageSkeleton;
