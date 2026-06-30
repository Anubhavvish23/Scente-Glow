import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { fetch_product_by_id } from "../../api/products";
import ProductPricing from "../../components/pricing/ProductPricing";
import ProductImageCarousel from "../../components/product/ProductImageCarousel";
import RelatedProducts from "../../components/product/RelatedProducts";
import ProductCartControl from "../../components/product/ProductCartControl";
import BulkPackSelector from "../../components/product/BulkPackSelector";
import FragranceSelector from "../../components/product/FragranceSelector";
import ProductPageSkeleton from "../../components/product/ProductPageSkeleton";
import { useIsMobile } from "../../hooks/useIsMobile";
import { useProductSheet } from "../../context/ProductSheetContext";
import { get_whatsapp_product_url } from "../../utils/whatsapp";
import { get_product_details, get_product_images } from "../../utils/product";
import { get_product_category_label } from "../../utils/product_categories";
import {
  get_default_bulk_pack,
  get_line_original_price,
  get_line_price,
  has_bulk_packs,
} from "../../utils/bulk_packs";
import "./Product.css";

function Product() {
  const { id } = useParams();
  const navigate = useNavigate();
  const is_mobile = useIsMobile();
  const { open_product_sheet } = useProductSheet();
  const [product, set_product] = useState(null);
  const [loading, set_loading] = useState(true);
  const [selected_fragrance, set_selected_fragrance] = useState("");
  const [customization, set_customization] = useState(null);
  const [selected_bulk_pack, set_selected_bulk_pack] = useState(null);

  useEffect(() => {
    if (is_mobile && id) {
      open_product_sheet(id);
      navigate("/shop", { replace: true });
    }
  }, [is_mobile, id, open_product_sheet, navigate]);

  useEffect(() => {
    if (is_mobile) return;

    set_selected_fragrance("");
    set_customization(null);
    set_selected_bulk_pack(null);
    window.scrollTo(0, 0);
    set_loading(true);
    fetch_product_by_id(id)
      .then((data) => {
        set_product(data);
        set_selected_bulk_pack(
          has_bulk_packs(data) ? get_default_bulk_pack(data) : null
        );
        set_loading(false);
      })
      .catch(() => {
        set_loading(false);
      });
  }, [id, is_mobile]);

  if (is_mobile) return null;

  if (loading) {
    return <ProductPageSkeleton />;
  }

  if (!product) {
    return (
      <div className="sg-product-page sg-product-page--empty">
        <p>Product not found.</p>
        <Link to="/shop">Back to shop</Link>
      </div>
    );
  }

  const whatsapp_url = get_whatsapp_product_url(
    product,
    selected_fragrance,
    customization,
    selected_bulk_pack
  );
  const display_price = get_line_price(product, selected_bulk_pack);
  const display_original_price = get_line_original_price(product, selected_bulk_pack);

  return (
    <div className="sg-product-page">
      <div className="sg-product-page__header">
        <Link to="/shop" className="sg-product-page__back">
          ← Back to collection
        </Link>
      </div>

      <div className="sg-product-page__layout">
        <div className="sg-product-page__gallery">
          <ProductImageCarousel
            images={get_product_images(product)}
            alt={product.name}
            product={product}
          />
        </div>

        <div className="sg-product-page__panel">
          <p className="sg-product-page__eyebrow">
            {get_product_category_label(product) || "Hand-poured candle"}
          </p>
          <h1 className="sg-product-page__name">{product.name.toUpperCase()}</h1>
          <p className="sg-product-page__scent">{product.scent}</p>

          <ProductPricing
            price={display_price}
            original_price={display_original_price}
          />

          <p className="sg-product-page__description">
            {product.description ||
              "Hand-poured in small batches using 100% natural soy wax, lead-free cotton wicks, and fine fragrance oils for a clean, even burn."}
          </p>

          {product.details_heading && (
            <h2 className="sg-product-page__details-heading">{product.details_heading}</h2>
          )}
          <ul
            className={`sg-product-page__details${product.details_heading ? " sg-product-page__details--hearts" : ""}`}
          >
            {get_product_details(product).map((detail) => (
              <li key={detail}>{detail}</li>
            ))}
          </ul>

          <div className="sg-product-page__meta">
            <p><span>Weight</span> {product.weight || "200g"}</p>
            <p><span>Burn time</span> {product.burn_time || "45–50 hours"}</p>
            <p><span>Wick</span> Cotton, lead-free</p>
          </div>

          <BulkPackSelector
            product={product}
            value={selected_bulk_pack}
            on_change={set_selected_bulk_pack}
          />

          <FragranceSelector
            value={selected_fragrance}
            on_change={set_selected_fragrance}
          />

          <ProductCartControl
            product={product}
            variant="page"
            selected_fragrance={selected_fragrance}
            customization={customization}
            on_customization_change={set_customization}
            selected_bulk_pack={selected_bulk_pack}
          />

          {whatsapp_url ? (
            <a
              href={whatsapp_url}
              target="_blank"
              rel="noopener noreferrer"
              className="sg-product-page__whatsapp-btn"
            >
              Order by WhatsApp
            </a>
          ) : (
            <span
              className="sg-product-page__whatsapp-btn sg-product-page__whatsapp-btn--disabled"
              aria-disabled="true"
            >
              Order by WhatsApp
            </span>
          )}
        </div>
      </div>

      <div className="sg-product-page__related-wrap">
        <RelatedProducts current_product={product} variant="page" />
      </div>
    </div>
  );
}

export default Product;
