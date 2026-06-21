import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { fetch_product_by_id } from "../../api/products";
import ProductPricing from "../../components/pricing/ProductPricing";
import ProductImageCarousel from "../../components/product/ProductImageCarousel";
import ProductReviews from "../../components/product/ProductReviews";
import RelatedProducts from "../../components/product/RelatedProducts";
import ProductCartControl from "../../components/product/ProductCartControl";
import ProductPageSkeleton from "../../components/product/ProductPageSkeleton";
import { useIsMobile } from "../../hooks/useIsMobile";
import { useProductSheet } from "../../context/ProductSheetContext";
import { get_whatsapp_product_url } from "../../utils/whatsapp";
import "./Product.css";

function Product() {
  const { id } = useParams();
  const navigate = useNavigate();
  const is_mobile = useIsMobile();
  const { open_product_sheet } = useProductSheet();
  const [product, set_product] = useState(null);
  const [loading, set_loading] = useState(true);

  useEffect(() => {
    if (is_mobile && id) {
      open_product_sheet(id);
      navigate("/shop", { replace: true });
    }
  }, [is_mobile, id, open_product_sheet, navigate]);

  useEffect(() => {
    if (is_mobile) return;

    window.scrollTo(0, 0);
    set_loading(true);
    fetch_product_by_id(id)
      .then((data) => {
        set_product(data);
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

  return (
    <div className="sg-product-page">
      <Link to="/shop" className="sg-product-page__back">
        ← Back to collection
      </Link>

      <div className="sg-product-page__layout">
        <div className="sg-product-page__gallery">
          <ProductImageCarousel
            images={[product.img, product.lifestyle]}
            alt={product.name}
            rating={product.rating}
          />
        </div>

        <div className="sg-product-page__panel">
          <p className="sg-product-page__eyebrow">Hand-poured candle</p>
          <h1 className="sg-product-page__name">{product.name.toUpperCase()}</h1>
          <p className="sg-product-page__scent">{product.scent}</p>

          <ProductPricing
            price={product.price}
            original_price={product.original_price}
          />

          <p className="sg-product-page__description">
            {product.description ||
              "Hand-poured in small batches using 100% natural soy wax, lead-free cotton wicks, and fine fragrance oils for a clean, even burn."}
          </p>

          <ul className="sg-product-page__details">
            <li>100% natural soy wax</li>
            <li>Lead-free cotton wick</li>
            <li>45+ hour burn time</li>
            <li>Small batch poured</li>
            <li>Phthalate-free fragrance oils</li>
            <li>Reusable glass jar</li>
          </ul>

          <div className="sg-product-page__meta">
            <p><span>Weight</span> 200g</p>
            <p><span>Burn time</span> 45–50 hours</p>
            <p><span>Wick</span> Cotton, lead-free</p>
          </div>

          <ProductCartControl product={product} variant="page" />

          <a
            href={get_whatsapp_product_url(product)}
            target="_blank"
            rel="noopener noreferrer"
            className="sg-product-page__whatsapp-btn"
          >
            Order by WhatsApp
          </a>
        </div>
      </div>

      <div className="sg-product-page__reviews-wrap">
        <ProductReviews
          rating={product.rating}
          review_count={product.review_count}
          product_name={product.name}
        />
        <RelatedProducts current_product={product} variant="page" />
      </div>
    </div>
  );
}

export default Product;
