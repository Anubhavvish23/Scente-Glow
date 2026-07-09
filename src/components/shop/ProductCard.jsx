import { memo, useCallback, useMemo } from "react";
import ProductHoverImages from "../product/ProductHoverImages";
import { get_product_images, is_product_sold_out } from "../../utils/product";
import { get_product_category_label } from "../../utils/product_categories";
import ShopProductPricing from "./ShopProductPricing";

function ProductCard({ product, on_open }) {
  const images = useMemo(() => get_product_images(product), [product]);
  const category_label = useMemo(() => get_product_category_label(product), [product]);
  const sold_out = useMemo(() => is_product_sold_out(product), [product]);

  const handle_click = useCallback(() => {
    on_open(product.id);
  }, [on_open, product.id]);

  return (
    <button
      type="button"
      className={`sg-shop__card${sold_out ? " sg-shop__card--sold-out" : ""}`}
      onClick={handle_click}
    >
      <div className="sg-shop__card-media">
        <ProductHoverImages
          images={images}
          alt={product.name}
          product={product}
          className="sg-hover-images--fill"
        />
      </div>
      <div className="sg-shop__card-info">
        <div>
          <h3 className="sg-shop__card-name">{product.name}</h3>
          {category_label && <p className="sg-shop__card-category">{category_label}</p>}
          <p className="sg-shop__card-scent">{product.scent}</p>
          <ShopProductPricing product={product} />
        </div>
      </div>
    </button>
  );
}

export default memo(ProductCard);
