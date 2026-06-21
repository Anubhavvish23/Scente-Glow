import "./ShopSkeleton.css";

function ShopSkeleton({ count = 4 }) {
  return (
    <div className="sg-shop-skeleton">
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className="sg-shop-skeleton__card">
          <div className="sg-shop-skeleton__media" />
          <div className="sg-shop-skeleton__line sg-shop-skeleton__line--title" />
          <div className="sg-shop-skeleton__line sg-shop-skeleton__line--scent" />
          <div className="sg-shop-skeleton__line sg-shop-skeleton__line--price" />
        </div>
      ))}
    </div>
  );
}

export default ShopSkeleton;
