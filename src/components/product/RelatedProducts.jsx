import { memo, useCallback, useMemo } from "react";
import { useProductSheet } from "../../context/ProductSheetContext";
import { useProductsCatalog } from "../../context/ProductsCatalogContext";
import ShopProductPricing from "../shop/ShopProductPricing";
import ProductHoverImages from "./ProductHoverImages";
import { get_product_images } from "../../utils/product";
import { get_related_products } from "../../utils/shop_products";
import "./RelatedProducts.css";

function RelatedProducts({ current_product, variant = "sheet" }) {
  const { products } = useProductsCatalog();
  const { open_product } = useProductSheet();

  const related = useMemo(
    () => get_related_products(products, current_product),
    [products, current_product]
  );

  const handle_click = useCallback(
    (item_id) => {
      open_product(item_id);
    },
    [open_product]
  );

  if (related.length === 0) {
    return null;
  }

  return (
    <section className={`sg-related ${variant === "page" ? "sg-related--page" : ""}`}>
      <h3 className="sg-related__title">You may also like</h3>
      <div className="sg-related__scroll">
        {related.map((item) => (
          <button
            key={item.id}
            type="button"
            className="sg-related__card"
            onClick={() => handle_click(item.id)}
          >
            <div className="sg-related__media">
              <ProductHoverImages
                images={get_product_images(item)}
                alt={item.name}
                product={item}
                className="sg-hover-images--fill"
                rating_class_name="sg-product-rating--compact"
              />
            </div>
            <p className="sg-related__name">{item.name}</p>
            <ShopProductPricing product={item} />
          </button>
        ))}
      </div>
    </section>
  );
}

export default memo(RelatedProducts);
