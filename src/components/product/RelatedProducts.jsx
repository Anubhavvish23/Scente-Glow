import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProductSheet } from "../../context/ProductSheetContext";
import { useIsMobile } from "../../hooks/useIsMobile";
import { fetch_products } from "../../api/products";
import ProductPricing from "../pricing/ProductPricing";
import ProductHoverImages from "./ProductHoverImages";
import { get_product_images } from "../../utils/product";
import "./RelatedProducts.css";

function RelatedProducts({ current_product, variant = "sheet" }) {
  const [related, set_related] = useState([]);
  const { open_product_sheet } = useProductSheet();
  const navigate = useNavigate();
  const is_mobile = useIsMobile();

  useEffect(() => {
    if (!current_product) return;

    fetch_products().then((products) => {
      const scent_tag = (current_product.scent || "").split("·")[0].trim().toLowerCase();
      const items = products
        .filter((item) => item.id !== current_product.id)
        .sort((a, b) => {
          const a_match = (a.scent || "").toLowerCase().includes(scent_tag) ? 0 : 1;
          const b_match = (b.scent || "").toLowerCase().includes(scent_tag) ? 0 : 1;
          return a_match - b_match;
        })
        .slice(0, 4);

      set_related(items);
    });
  }, [current_product]);

  if (related.length === 0) return null;

  const handle_click = (item_id) => {
    if (is_mobile) {
      open_product_sheet(item_id);
      return;
    }
    navigate(`/product/${item_id}`);
  };

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
            <ProductPricing
              price={item.price}
              original_price={item.original_price}
              compact
            />
          </button>
        ))}
      </div>
    </section>
  );
}

export default RelatedProducts;
