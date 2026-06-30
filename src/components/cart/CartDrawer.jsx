import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useProductSheet } from "../../context/ProductSheetContext";
import { useIsMobile } from "../../hooks/useIsMobile";
import { useToast } from "../../context/ToastContext";
import { format_price } from "../../utils/pricing";
import { format_customization_summary } from "../../utils/customization";
import { format_bulk_pack_summary } from "../../utils/bulk_packs";
import { get_whatsapp_order_url } from "../../utils/whatsapp";
import EmptyState from "../empty/EmptyState";
import "./CartDrawer.css";

function CartDrawer() {
  const {
    cart_items,
    cart_count,
    cart_subtotal,
    cart_discount,
    cart_total,
    coupon_code,
    coupon_error,
    cart_open,
    close_cart,
    remove_from_cart,
    update_quantity,
    apply_coupon,
    remove_coupon,
  } = useCart();
  const { open_product_sheet } = useProductSheet();
  const { show_toast } = useToast();
  const is_mobile = useIsMobile();
  const navigate = useNavigate();
  const [coupon_input, set_coupon_input] = useState("");

  const open_product = (product_id) => {
    close_cart();
    if (is_mobile) {
      open_product_sheet(product_id);
    } else {
      navigate(`/product/${product_id}`);
    }
  };

  const handle_apply_coupon = () => {
    const applied = apply_coupon(coupon_input);
    if (applied) {
      show_toast(`Coupon ${coupon_input.trim().toUpperCase()} applied`);
      set_coupon_input("");
    }
  };

  if (!cart_open) return null;

  return (
    <div className="sg-cart-overlay" onClick={close_cart}>
      <aside
        className="sg-cart"
        onClick={(e) => e.stopPropagation()}
        aria-label="Shopping cart"
      >
        <div className="sg-cart__header">
          <h2 className="sg-cart__title">Your Cart ({cart_count})</h2>
          <button type="button" className="sg-cart__close" onClick={close_cart}>
            ×
          </button>
        </div>

        {cart_items.length === 0 ? (
          <EmptyState
            className="sg-empty-state--compact"
            icon={
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4H6z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 01-8 0" />
              </svg>
            }
            title="Your cart is empty"
            description="Discover our hand-poured candles and find a scent that feels like home."
            action_label="Browse candles"
            action_to="/shop"
            on_action={close_cart}
          />
        ) : (
          <>
            <ul className="sg-cart__items">
              {cart_items.map((item) => (
                <li key={item.line_id || item.product_id} className="sg-cart__item">
                  <button
                    type="button"
                    className="sg-cart__item-img-wrap"
                    onClick={() => open_product(item.product_id)}
                  >
                    <img src={item.img} alt={item.name} className="sg-cart__item-img" />
                  </button>
                  <div className="sg-cart__item-info">
                    <button
                      type="button"
                      className="sg-cart__item-name"
                      onClick={() => open_product(item.product_id)}
                    >
                      {item.name}
                    </button>
                    <p className="sg-cart__item-scent">{item.fragrance || item.scent}</p>
                    {item.bulk_pack && (
                      <p className="sg-cart__item-customization">
                        {format_bulk_pack_summary(item.bulk_pack)}
                      </p>
                    )}
                    {item.customization && (
                      <p className="sg-cart__item-customization">
                        {format_customization_summary(item.customization)}
                      </p>
                    )}
                    <p className="sg-cart__item-price">{format_price(item.price)}</p>
                    <div className="sg-cart__qty">
                      <button
                        type="button"
                        onClick={() =>
                          update_quantity(
                            item.product_id,
                            item.quantity - 1,
                            item.fragrance,
                            item.customization,
                            item.bulk_pack
                          )
                        }
                      >
                        −
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() =>
                          update_quantity(
                            item.product_id,
                            item.quantity + 1,
                            item.fragrance,
                            item.customization,
                            item.bulk_pack
                          )
                        }
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="sg-cart__remove"
                    onClick={() =>
                      remove_from_cart(
                        item.product_id,
                        item.fragrance,
                        item.customization,
                        item.bulk_pack
                      )
                    }
                    aria-label={`Remove ${item.name}`}
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
            <div className="sg-cart__footer">
              <div className="sg-cart__coupon">
                {coupon_code ? (
                  <div className="sg-cart__coupon-applied">
                    <span>{coupon_code} applied</span>
                    <button type="button" onClick={remove_coupon}>
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="sg-cart__coupon-form">
                    <input
                      type="text"
                      value={coupon_input}
                      onChange={(e) => set_coupon_input(e.target.value)}
                      placeholder="Coupon code"
                      className="sg-cart__coupon-input"
                    />
                    <button type="button" onClick={handle_apply_coupon}>
                      Apply
                    </button>
                  </div>
                )}
                {coupon_error && <p className="sg-cart__coupon-error">{coupon_error}</p>}
              </div>

              {cart_discount > 0 && (
                <div className="sg-cart__subtotal">
                  <span>Subtotal</span>
                  <span>{format_price(cart_subtotal)}</span>
                </div>
              )}
              {cart_discount > 0 && (
                <div className="sg-cart__discount">
                  <span>Discount</span>
                  <span>-{format_price(cart_discount)}</span>
                </div>
              )}
              <div className="sg-cart__total">
                <span>Total</span>
                <span>{format_price(cart_total)}</span>
              </div>
              <a
                href={get_whatsapp_order_url(cart_items, cart_total, {
                  cart_subtotal,
                  coupon_code,
                  cart_discount,
                })}
                target="_blank"
                rel="noopener noreferrer"
                className="sg-cart__whatsapp"
              >
                Order by WhatsApp
              </a>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}

export default CartDrawer;
