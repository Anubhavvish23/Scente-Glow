import { useCart } from "../../context/CartContext";
import { useToast } from "../../context/ToastContext";
import "./ProductCartControl.css";

function release_focus() {
  window.requestAnimationFrame(() => {
    const active = document.activeElement;
    if (active instanceof HTMLElement) {
      active.blur();
    }
  });
}

function ProductCartControl({ product, variant = "page" }) {
  const { cart_items, add_to_cart, update_quantity } = useCart();
  const { show_toast } = useToast();
  const cart_item = cart_items.find((item) => item.product_id === product.id);
  const quantity = cart_item?.quantity || 0;

  const handle_add = () => {
    add_to_cart(product);
    show_toast(`${product.name} added to cart`);
    release_focus();
  };

  const handle_minus = () => {
    update_quantity(product.id, quantity - 1);
    release_focus();
  };

  const handle_plus = () => {
    if (quantity === 0) {
      add_to_cart(product);
      show_toast(`${product.name} added to cart`);
      release_focus();
      return;
    }
    update_quantity(product.id, quantity + 1);
    release_focus();
  };

  if (quantity === 0) {
    return (
      <button
        type="button"
        className={`sg-product-cart-control sg-product-cart-control--add sg-product-cart-control--${variant}`}
        onClick={handle_add}
      >
        Add to cart
      </button>
    );
  }

  return (
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
  );
}

export default ProductCartControl;
