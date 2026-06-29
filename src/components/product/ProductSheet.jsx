import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetch_product_by_id } from "../../api/products";
import ProductImageCarousel from "./ProductImageCarousel";
import ProductCartControl from "./ProductCartControl";
import FragranceSelector from "./FragranceSelector";
import ProductSheetSkeleton from "./ProductSheetSkeleton";
import RelatedProducts from "./RelatedProducts";
import ProductPricing from "../pricing/ProductPricing";
import { useProductSheet } from "../../context/ProductSheetContext";
import { useIsMobile } from "../../hooks/useIsMobile";
import { get_whatsapp_product_url } from "../../utils/whatsapp";
import { get_product_details } from "../../utils/product";
import "./ProductSheet.css";

function ProductSheet() {
  const is_mobile = useIsMobile();
  const navigate = useNavigate();
  const { product_id, close_product_sheet } = useProductSheet();
  const [product, set_product] = useState(null);
  const [loading, set_loading] = useState(false);
  const [selected_fragrance, set_selected_fragrance] = useState("");
  const [customization, set_customization] = useState(null);
  const [visible, set_visible] = useState(false);
  const [snap, set_snap] = useState("partial");
  const content_ref = useRef(null);
  const snap_lock = useRef(false);
  const touch_start_y = useRef(0);

  useEffect(() => {
    if (!is_mobile && product_id) {
      navigate(`/product/${product_id}`);
      close_product_sheet();
    }
  }, [is_mobile, product_id, close_product_sheet, navigate]);

  useEffect(() => {
    if (!product_id || !is_mobile) {
      set_visible(false);
      set_product(null);
      set_snap("partial");
      return undefined;
    }

    set_snap("partial");
    set_loading(true);
    set_selected_fragrance("");
    set_customization(null);

    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }

    fetch_product_by_id(product_id)
      .then((data) => {
        set_product(data);
        set_loading(false);
      })
      .catch(() => {
        set_loading(false);
      });

    document.body.style.overflow = "hidden";
    requestAnimationFrame(() => {
      requestAnimationFrame(() => set_visible(true));
    });

    return () => {
      document.body.style.overflow = "";
    };
  }, [product_id, is_mobile]);

  const handle_close = () => {
    set_visible(false);
    set_snap("partial");
    window.setTimeout(close_product_sheet, 320);
  };

  const run_snap_action = useCallback(
    (action) => {
      if (snap_lock.current) return;
      snap_lock.current = true;
      window.setTimeout(() => {
        snap_lock.current = false;
      }, 420);

      if (action === "expand") {
        set_snap("full");
      } else if (action === "collapse") {
        set_snap("partial");
      } else if (action === "close") {
        set_visible(false);
        set_snap("partial");
        window.setTimeout(close_product_sheet, 320);
      }
    },
    [close_product_sheet]
  );

  const handle_wheel = useCallback(
    (event) => {
      const el = content_ref.current;
      if (!el || el.scrollTop > 2) return;

      if (event.deltaY < 0 && snap === "partial") {
        event.preventDefault();
        run_snap_action("expand");
      } else if (event.deltaY > 0) {
        if (snap === "full") {
          event.preventDefault();
          run_snap_action("collapse");
        } else if (snap === "partial") {
          event.preventDefault();
          run_snap_action("close");
        }
      }
    },
    [snap, run_snap_action]
  );

  const handle_touch_start = (event) => {
    touch_start_y.current = event.touches[0].clientY;
  };

  const handle_touch_end = (event) => {
    const el = content_ref.current;
    if (!el || el.scrollTop > 2) return;

    const delta = event.changedTouches[0].clientY - touch_start_y.current;
    if (Math.abs(delta) < 45) return;

    if (delta < 0 && snap === "partial") {
      run_snap_action("expand");
    } else if (delta > 0 && snap === "full") {
      run_snap_action("collapse");
    } else if (delta > 0 && snap === "partial") {
      run_snap_action("close");
    }
  };

  useEffect(() => {
    const el = content_ref.current;
    if (!el || !product) return undefined;

    el.addEventListener("wheel", handle_wheel, { passive: false });
    return () => el.removeEventListener("wheel", handle_wheel);
  }, [handle_wheel, product]);

  if (!is_mobile || !product_id) return null;

  return (
    <div
      className={`sg-product-sheet-overlay ${visible ? "sg-product-sheet-overlay--visible" : ""}`}
      onClick={handle_close}
    >
      <div
        className={`sg-product-sheet ${visible ? "sg-product-sheet--visible" : ""} ${snap === "full" ? "sg-product-sheet--full" : "sg-product-sheet--partial"}`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <button
          type="button"
          className="sg-product-sheet__close"
          onClick={handle_close}
          aria-label="Close"
        >
          ×
        </button>

        <div className="sg-product-sheet__handle" aria-hidden="true" />

        {loading ? (
          <ProductSheetSkeleton />
        ) : !product ? (
          <div className="sg-product-sheet__loading">
            <p>Product not found.</p>
          </div>
        ) : (
          <div
            ref={content_ref}
            className="sg-product-sheet__content"
            onTouchStart={handle_touch_start}
            onTouchEnd={handle_touch_end}
          >
            <button
              type="button"
              className="sg-product-sheet__back"
              onClick={handle_close}
            >
              ← Back to collection
            </button>

            <ProductImageCarousel
              images={[product.img, product.lifestyle]}
              alt={product.name}
              compact
            />

            <h2 className="sg-product-sheet__name">{product.name.toUpperCase()}</h2>
            {product.category && (
              <p className="sg-product-sheet__category">{product.category}</p>
            )}
            <p className="sg-product-sheet__scent">{product.scent}</p>

            <ProductPricing
              price={product.price}
              original_price={product.original_price}
            />

            <p className="sg-product-sheet__description">
              {product.description ||
                "Hand-poured in small batches using 100% natural soy wax, lead-free cotton wicks, and fine fragrance oils for a clean, even burn."}
            </p>

            <ul className="sg-product-sheet__details">
              {get_product_details(product).map((detail) => (
                <li key={detail}>{detail}</li>
              ))}
            </ul>

            <FragranceSelector
              value={selected_fragrance}
              on_change={set_selected_fragrance}
              className="sg-fragrance-selector--sheet"
            />

            <ProductCartControl
              product={product}
              variant="sheet"
              selected_fragrance={selected_fragrance}
              customization={customization}
              on_customization_change={set_customization}
            />

            {(() => {
              const whatsapp_url = get_whatsapp_product_url(
                product,
                selected_fragrance,
                customization
              );

              return whatsapp_url ? (
                <a
                  href={whatsapp_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="sg-product-sheet__whatsapp-btn"
                >
                  Order by WhatsApp
                </a>
              ) : (
                <span
                  className="sg-product-sheet__whatsapp-btn sg-product-sheet__whatsapp-btn--disabled"
                  aria-disabled="true"
                >
                  Order by WhatsApp
                </span>
              );
            })()}

            <RelatedProducts current_product={product} />
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductSheet;
