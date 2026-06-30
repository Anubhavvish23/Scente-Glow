import { createContext, useContext, useMemo, useState } from "react";
import {
  bulk_pack_matches,
  get_line_original_price,
  get_line_price,
} from "../utils/bulk_packs";
import { customization_matches } from "../utils/customization";
import { get_coupon_percent } from "../utils/coupons";

const CartContext = createContext(null);

function build_line_id(product_id, fragrance, customization, bulk_pack) {
  const parts = [product_id];
  if (fragrance) {
    parts.push(fragrance);
  }
  if (customization?.letter && customization?.color_name) {
    parts.push(`${customization.letter}-${customization.color_name}`);
  }
  if (bulk_pack?.id) {
    parts.push(bulk_pack.id);
  }
  return parts.join("::");
}

function matches_cart_line(item, product_id, fragrance, customization, bulk_pack) {
  return (
    item.product_id === product_id &&
    (item.fragrance || "") === (fragrance || "") &&
    customization_matches(item.customization, customization) &&
    bulk_pack_matches(item.bulk_pack, bulk_pack)
  );
}

export function CartProvider({ children }) {
  const [cart_items, set_cart_items] = useState([]);
  const [cart_open, set_cart_open] = useState(false);
  const [coupon_code, set_coupon_code] = useState("");
  const [coupon_error, set_coupon_error] = useState("");

  const cart_count = useMemo(
    () => cart_items.reduce((total, item) => total + item.quantity, 0),
    [cart_items]
  );

  const cart_subtotal = useMemo(
    () => cart_items.reduce((total, item) => total + item.price * item.quantity, 0),
    [cart_items]
  );

  const coupon_percent = useMemo(
    () => get_coupon_percent(coupon_code),
    [coupon_code]
  );

  const cart_discount = useMemo(
    () => Math.round(cart_subtotal * (coupon_percent / 100)),
    [cart_subtotal, coupon_percent]
  );

  const cart_total = useMemo(
    () => Math.max(cart_subtotal - cart_discount, 0),
    [cart_subtotal, cart_discount]
  );

  const add_to_cart = (
    product,
    fragrance = "",
    customization = null,
    bulk_pack = null
  ) => {
    set_cart_items((prev) => {
      const existing = prev.find((item) =>
        matches_cart_line(item, product.id, fragrance, customization, bulk_pack)
      );
      if (existing) {
        return prev.map((item) =>
          matches_cart_line(item, product.id, fragrance, customization, bulk_pack)
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [
        ...prev,
        {
          line_id: build_line_id(product.id, fragrance, customization, bulk_pack),
          product_id: product.id,
          name: product.name,
          scent: product.scent,
          fragrance,
          customization,
          bulk_pack,
          price: get_line_price(product, bulk_pack),
          original_price: get_line_original_price(product, bulk_pack),
          img: product.img,
          quantity: 1,
        },
      ];
    });
  };

  const remove_from_cart = (
    product_id,
    fragrance = "",
    customization = null,
    bulk_pack = null
  ) => {
    set_cart_items((prev) =>
      prev.filter(
        (item) => !matches_cart_line(item, product_id, fragrance, customization, bulk_pack)
      )
    );
  };

  const update_quantity = (
    product_id,
    quantity,
    fragrance = "",
    customization = null,
    bulk_pack = null
  ) => {
    if (quantity < 1) {
      remove_from_cart(product_id, fragrance, customization, bulk_pack);
      return;
    }
    set_cart_items((prev) =>
      prev.map((item) =>
        matches_cart_line(item, product_id, fragrance, customization, bulk_pack)
          ? { ...item, quantity }
          : item
      )
    );
  };

  const apply_coupon = (code) => {
    const normalized = code.trim().toUpperCase();
    const percent = get_coupon_percent(normalized);

    if (!percent) {
      set_coupon_error("Invalid coupon code");
      return false;
    }

    set_coupon_code(normalized);
    set_coupon_error("");
    return true;
  };

  const remove_coupon = () => {
    set_coupon_code("");
    set_coupon_error("");
  };

  const clear_cart = () => set_cart_items([]);

  const open_cart = () => set_cart_open(true);
  const close_cart = () => set_cart_open(false);

  return (
    <CartContext.Provider
      value={{
        cart_items,
        cart_count,
        cart_subtotal,
        cart_discount,
        cart_total,
        coupon_code,
        coupon_percent,
        coupon_error,
        cart_open,
        add_to_cart,
        remove_from_cart,
        update_quantity,
        apply_coupon,
        remove_coupon,
        clear_cart,
        open_cart,
        close_cart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}
