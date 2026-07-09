import { memo, useMemo } from "react";
import ProductPricing from "../pricing/ProductPricing";
import { get_product_listing_pricing } from "../../utils/bulk_packs";

function ShopProductPricing({ product }) {
  const listing = useMemo(() => get_product_listing_pricing(product), [product]);

  return (
    <div className="sg-shop__card-pricing">
      {listing.pack_label && (
        <p className="sg-shop__card-pack">{listing.pack_label}</p>
      )}
      <ProductPricing
        price={listing.price}
        original_price={listing.original_price}
        compact
      />
    </div>
  );
}

export default memo(ShopProductPricing);
