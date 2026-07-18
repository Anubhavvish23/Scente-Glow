import { memo, useCallback, useMemo, useState } from "react";
import { useCart } from "../../context/CartContext";
import { useToast } from "../../context/ToastContext";
import {
  format_bulk_pack_summary,
  has_bulk_packs,
  bulk_pack_matches,
} from "../../utils/bulk_packs";
import {
  format_customization_summary,
  has_product_colours,
  has_product_letters,
  is_customization_complete,
  is_letter_customizable,
  customization_matches,
} from "../../utils/customization";
import { has_product_fragrances } from "../../utils/fragrances";
import { is_product_sold_out } from "../../utils/product";
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
  selected_bulk_pack = null,
}) {
  const { cart_items, add_to_cart, update_quantity } = useCart();
  const { show_toast } = useToast();
  const [customize_open, set_customize_open] = useState(false);

  const needs_customization = is_letter_customizable(product);
  const needs_bulk_pack = has_bulk_packs(product);
  const needs_fragrance = has_product_fragrances(product);
  const sold_out = is_product_sold_out(product);

  const cart_item = useMemo(
    () =>
      cart_items.find(
        (item) =>
          item.product_id === product.id &&
          (item.fragrance || "") === selected_fragrance &&
          customization_matches(item.customization, customization) &&
          bulk_pack_matches(item.bulk_pack, selected_bulk_pack)
      ),
    [cart_items, product.id, selected_fragrance, customization, selected_bulk_pack]
  );

  const quantity = cart_item?.quantity || 0;

  const customize_label = useMemo(() => {
    if (has_product_letters(product) && has_product_colours(product)) {
      return "Select letter & colour";
    }
    if (has_product_letters(product)) {
      return "Select letter";
    }
    return "Select colours";
  }, [product]);

  const customize_button_label = useMemo(() => {
    if (!customization) {
      return customize_label;
    }
    if (has_product_letters(product) && has_product_colours(product)) {
      return "Edit letter & colour";
    }
    if (has_product_letters(product)) {
      return "Edit letter";
    }
    return "Edit colours";
  }, [customization, customize_label, product]);

  const can_add = useMemo(
    () =>
      !sold_out &&
      (!needs_fragrance || Boolean(selected_fragrance)) &&
      (!needs_customization || is_customization_complete(customization, product)) &&
      (!needs_bulk_pack || Boolean(selected_bulk_pack)),
    [
      sold_out,
      needs_fragrance,
      selected_fragrance,
      needs_customization,
      customization,
      product,
      needs_bulk_pack,
      selected_bulk_pack,
    ]
  );

  const add_label = useMemo(() => {
    if (sold_out) {
      return "Sold out";
    }
    if (needs_fragrance && !selected_fragrance) {
      return "Select a fragrance";
    }
    if (needs_bulk_pack && !selected_bulk_pack) {
      return "Select a pack size";
    }
    if (needs_customization && !is_customization_complete(customization, product)) {
      return customize_label;
    }
    return "Add to cart";
  }, [
    sold_out,
    needs_fragrance,
    selected_fragrance,
    needs_bulk_pack,
    selected_bulk_pack,
    needs_customization,
    customization,
    product,
    customize_label,
  ]);

  const toast_message = useMemo(
    () => build_toast_message(product.name, selected_fragrance, customization, selected_bulk_pack),
    [product.name, selected_fragrance, customization, selected_bulk_pack]
  );

  const handle_add = useCallback(() => {
    if (!can_add) {
      return;
    }
    add_to_cart(product, selected_fragrance, customization, selected_bulk_pack);
    show_toast(toast_message);
    release_focus();
  }, [
    can_add,
    add_to_cart,
    product,
    selected_fragrance,
    customization,
    selected_bulk_pack,
    show_toast,
    toast_message,
  ]);

  const handle_minus = useCallback(() => {
    update_quantity(
      product.id,
      quantity - 1,
      selected_fragrance,
      customization,
      selected_bulk_pack
    );
    release_focus();
  }, [
    update_quantity,
    product.id,
    quantity,
    selected_fragrance,
    customization,
    selected_bulk_pack,
  ]);

  const handle_plus = useCallback(() => {
    if (!can_add) {
      return;
    }
    if (quantity === 0) {
      add_to_cart(product, selected_fragrance, customization, selected_bulk_pack);
      show_toast(toast_message);
      release_focus();
      return;
    }
    update_quantity(
      product.id,
      quantity + 1,
      selected_fragrance,
      customization,
      selected_bulk_pack
    );
    release_focus();
  }, [
    can_add,
    quantity,
    add_to_cart,
    product,
    selected_fragrance,
    customization,
    selected_bulk_pack,
    show_toast,
    toast_message,
    update_quantity,
  ]);

  const handle_open_customize = useCallback(() => {
    set_customize_open(true);
  }, []);

  const handle_close_customize = useCallback(() => {
    set_customize_open(false);
  }, []);

  return (
    <div className={`sg-product-cart-control-wrap sg-product-cart-control-wrap--${variant}`}>
      {needs_customization && (
        <>
          <button
            type="button"
            className={`sg-product-cart-control__customize sg-product-cart-control__customize--${variant}`}
            onClick={handle_open_customize}
          >
            {customize_button_label}
          </button>
          {customization && (
            <p className="sg-product-cart-control__customization-summary">
              {format_customization_summary(customization)}
            </p>
          )}
          <ProductCustomizeModal
            open={customize_open}
            product={product}
            initial_value={customization}
            on_close={handle_close_customize}
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
            disabled={sold_out}
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
      )}
    </div>
  );
}

function build_toast_message(name, fragrance, customization, bulk_pack) {
  const parts = [name];
  const bulk_pack_summary = format_bulk_pack_summary(bulk_pack);
  if (bulk_pack_summary) {
    parts.push(bulk_pack_summary);
  }
  if (fragrance) {
    parts.push(fragrance);
  }
  const customization_summary = format_customization_summary(customization);
  if (customization_summary) {
    parts.push(customization_summary);
  }
  return `${parts.join(" · ")} added to cart`;
}

export default memo(ProductCartControl);
