import { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import ProductImageCarousel from "../../components/product/ProductImageCarousel";
import ProductDetailPanel from "../../components/product/ProductDetailPanel";
import RelatedProducts from "../../components/product/RelatedProducts";
import ProductPageSkeleton from "../../components/product/ProductPageSkeleton";
import { useIsMobile } from "../../hooks/useIsMobile";
import { useProductDetail } from "../../hooks/useProductDetail";
import { useProductSheet } from "../../context/ProductSheetContext";
import { get_product_images } from "../../utils/product";
import "./Product.css";

function Product() {
  const { id } = useParams();
  const navigate = useNavigate();
  const is_mobile = useIsMobile();
  const { open_product_sheet } = useProductSheet();
  const {
    product,
    loading,
    selected_fragrance,
    set_selected_fragrance,
    customization,
    set_customization,
    selected_bulk_pack,
    set_selected_bulk_pack,
  } = useProductDetail(id, { enabled: !is_mobile });

  useEffect(() => {
    if (is_mobile && id) {
      open_product_sheet(id);
      navigate("/shop", { replace: true });
    }
  }, [is_mobile, id, open_product_sheet, navigate]);

  useEffect(() => {
    if (!is_mobile) {
      window.scrollTo(0, 0);
    }
  }, [id, is_mobile]);

  if (is_mobile) {
    return null;
  }

  if (loading) {
    return <ProductPageSkeleton />;
  }

  if (!product) {
    return (
      <div className="sg-product-page sg-product-page--empty">
        <p>Product not found.</p>
        <Link to="/shop">Back to collection</Link>
      </div>
    );
  }

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
          <ProductDetailPanel
            product={product}
            variant="page"
            selected_fragrance={selected_fragrance}
            on_fragrance_change={set_selected_fragrance}
            customization={customization}
            on_customization_change={set_customization}
            selected_bulk_pack={selected_bulk_pack}
            on_bulk_pack_change={set_selected_bulk_pack}
          />
        </div>
      </div>

      <div className="sg-product-page__related-wrap">
        <RelatedProducts current_product={product} variant="page" />
      </div>
    </div>
  );
}

export default Product;
