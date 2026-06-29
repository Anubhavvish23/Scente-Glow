import { useState } from "react";
import { useCart } from "../../context/CartContext";
import { useToast } from "../../context/ToastContext";
import {
  format_customization_summary,
  is_letter_customizable,
  customization_matches,
} from "../../utils/customization";
import ProductCustomizeModal from "./ProductCustomizeModal";
import "./ProductCartControl.css";

function release_focus() {
  window.requestAnimationFrame(() => {
    const active = document.activeElement;
    if (active instanceof HTMLElement) {
      active.blur();
    }
  });
}

function ProductCartControl({
  product,
  variant = "page",
  selected_fragrance = "",
  customization = null,
  on_customization_change,
}) {
  const { cart_items, add_to_cart, update_quantity } = useCart();
  const { show_toast } = useToast();
  const [customize_open, set_customize_open] = useState(false);
  const needs_customization = is_letter_customizable(product);
  const cart_item = cart_items.find((item) =>
    item.product_id === product.id &&
    (item.fragrance || "") === selected_fragrance &&
    customization_matches(item.customization, customization)
  );
  const quantity = cart_item?.quantity || 0;
  const can_add =
    Boolean(selected_fragrance) && (!needs_customization || Boolean(customization));

  const add_label = !selected_fragrance
    ? "Select a fragrance"
    : needs_customization && !customization
      ? "Customize letter & colour"
      : "Add to cart";

  const handle_add = () => {
    if (!can_add) {
      return;
    }
    add_to_cart(product, selected_fragrance, customization);
    show_toast(build_toast_message(product.name, selected_fragrance, customization));
    release_focus();
  };

  const handle_minus = () => {
    update_quantity(product.id, quantity - 1, selected_fragrance, customization);
    release_focus();
  };

  const handle_plus = () => {
    if (!can_add) {
      return;
    }
    if (quantity === 0) {
      add_to_cart(product, selected_fragrance, customization);
      show_toast(build_toast_message(product.name, selected_fragrance, customization));
      release_focus();
      return;
    }
    update_quantity(product.id, quantity + 1, selected_fragrance, customization);
    release_focus();
  };

  return (
    <div className={`sg-product-cart-control-wrap sg-product-cart-control-wrap--${variant}`}>
      {needs_customization && (
        <>
          <button
            type="button"
            className={`sg-product-cart-control__customize sg-product-cart-control__customize--${variant}`}
            onClick={() => set_customize_open(true)}
          >
            {customization ? "Edit customization" : "Customize"}
          </button>
          {customization && (
            <p className="sg-product-cart-control__customization-summary">
              {format_customization_summary(customization)}
            </p>
          )}
          <ProductCustomizeModal
            open={customize_open}
            initial_value={customization}
            on_close={() => set_customize_open(false)}
            on_confirm={on_customization_change}
          />
        </>
      )}

      {quantity === 0 ? (
        <button
          type="button"
          className={`sg-product-cart-control sg-product-cart-control--add sg-product-cart-control--${variant}${can_add ? "" : " sg-product-cart-control--disabled"}`}
          onClick={handle_add}
          disabled={!can_add}
        >
          {add_label}
        </button>
      ) : (
        <div className={`sg-product-cart-control sg-product-cart-control--qty sg-product-cart-control--${variant}`}>
          <button
            type="button"
            className="sg-product-cart-control__btn"
            onClick={handle_minus}
            aria-label="Decrease quantity"
          >
            −
          </button>
          <span className="sg-product-cart-control__count">{quantity}</span>
          <button
            type="button"
            className="sg-product-cart-control__btn"
            onClick={handle_plus}
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
      )}
    </div>
  );
}

function build_toast_message(name, fragrance, customization) {
  const parts = [name];
  if (fragrance) {
    parts.push(fragrance);
  }
  const customization_summary = format_customization_summary(customization);
  if (customization_summary) {
    parts.push(customization_summary);
  }
  return `${parts.join(" · ")} added to cart`;
}

export default ProductCartControl;