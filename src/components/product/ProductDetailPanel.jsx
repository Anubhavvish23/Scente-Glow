import { memo, useMemo } from "react";
import ProductPricing from "../pricing/ProductPricing";
import BulkPackSelector from "./BulkPackSelector";
import FragranceSelector from "./FragranceSelector";
import ProductCartControl from "./ProductCartControl";
import { has_bulk_packs } from "../../utils/bulk_packs";
import { has_product_fragrances } from "../../utils/fragrances";
import {
  default_product_description,
  get_product_details,
  is_product_sold_out,
} from "../../utils/product";
import { get_product_category_label } from "../../utils/product_categories";
import { get_whatsapp_product_url } from "../../utils/whatsapp";

function ProductWhatsappButton({ url, variant }) {
  const class_name =
    variant === "page"
      ? "sg-product-page__whatsapp-btn"
      : "sg-product-sheet__whatsapp-btn";

  if (url) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className={class_name}
      >
        Order by WhatsApp
      </a>
    );
  }

  return (
    <span
      className={`${class_name} ${variant === "page" ? "sg-product-page__whatsapp-btn--disabled" : "sg-product-sheet__whatsapp-btn--disabled"}`}
      aria-disabled="true"
    >
      Order by WhatsApp
    </span>
  );
}

function ProductDetailPanel({
  product,
  variant = "page",
  selected_fragrance,
  on_fragrance_change,
  customization,
  on_customization_change,
  selected_bulk_pack,
  on_bulk_pack_change,
}) {
  const product_has_packs = has_bulk_packs(product);
  const category_label = get_product_category_label(product);
  const details = get_product_details(product);
  const details_class_name = `sg-product-${variant === "page" ? "page" : "sheet"}__details${
    product.details_heading ? ` sg-product-${variant === "page" ? "page" : "sheet"}__details--hearts` : ""
  }`;

  const whatsapp_url = useMemo(
    () =>
      get_whatsapp_product_url(
        product,
        selected_fragrance,
        customization,
        selected_bulk_pack
      ),
    [product, selected_fragrance, customization, selected_bulk_pack]
  );

  return (
    <>
      {variant === "page" ? (
        <>
          <p className="sg-product-page__eyebrow">
            {category_label || "Hand-poured candle"}
          </p>
          <h1 className="sg-product-page__name">{product.name.toUpperCase()}</h1>
        </>
      ) : (
        <>
          <h2 className="sg-product-sheet__name">{product.name.toUpperCase()}</h2>
          {category_label && <p className="sg-product-sheet__category">{category_label}</p>}
        </>
      )}

      <p className={`sg-product-${variant === "page" ? "page" : "sheet"}__scent`}>
        {product.scent}
      </p>

      {product_has_packs ? (
        <BulkPackSelector
          product={product}
          value={selected_bulk_pack}
          on_change={on_bulk_pack_change}
          reveal_prices_on_click
          className={
            variant === "page"
              ? "sg-bulk-pack-selector--hero"
              : "sg-bulk-pack-selector--hero sg-bulk-pack-selector--sheet"
          }
        />
      ) : (
        <ProductPricing price={product.price} original_price={product.original_price} />
      )}

      <p className={`sg-product-${variant === "page" ? "page" : "sheet"}__description`}>
        {product.description || default_product_description}
      </p>

      {product.details_heading && (
        variant === "page" ? (
          <h2 className="sg-product-page__details-heading">{product.details_heading}</h2>
        ) : (
          <h3 className="sg-product-sheet__details-heading">{product.details_heading}</h3>
        )
      )}

      <ul className={details_class_name}>
        {details.map((detail) => (
          <li key={detail}>{detail}</li>
        ))}
      </ul>

      {variant === "page" && (
        <div className="sg-product-page__meta">
          <p>
            <span>Weight</span> {product.weight || "200g"}
          </p>
          <p>
            <span>Burn time</span> {product.burn_time || "45–50 hours"}
          </p>
          <p>
            <span>Wick</span> Cotton, lead-free
          </p>
        </div>
      )}

      {has_product_fragrances(product) && (
        <FragranceSelector
          product={product}
          value={selected_fragrance}
          on_change={on_fragrance_change}
          className={variant === "sheet" ? "sg-fragrance-selector--sheet" : ""}
        />
      )}

      <ProductCartControl
        product={product}
        variant={variant}
        selected_fragrance={selected_fragrance}
        customization={customization}
        on_customization_change={on_customization_change}
        selected_bulk_pack={selected_bulk_pack}
      />

      {is_product_sold_out(product) && (
        <p className={`sg-product-${variant === "page" ? "page" : "sheet"}__sold-out`}>
          This product is currently sold out.
        </p>
      )}

      <ProductWhatsappButton url={whatsapp_url} variant={variant} />
    </>
  );
}

export default memo(ProductDetailPanel);
