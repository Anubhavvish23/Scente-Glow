import { useState } from "react";
import { delete_product } from "../../api/products";

function TrashIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <path d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M10 11v6M14 11v6M6 7l1 14h10l1-14" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function AdminDeleteProductButton({ product_id, product_name, on_deleted, className = "" }) {
  const [deleting, set_deleting] = useState(false);

  const handle_delete = async () => {
    const confirmed = window.confirm(`Delete "${product_name}"? It will be removed from the shop.`);
    if (!confirmed) {
      return;
    }

    set_deleting(true);

    try {
      await delete_product(product_id);
      on_deleted?.(product_id);
    } catch {
      window.alert("Could not delete product. Try again.");
    } finally {
      set_deleting(false);
    }
  };

  return (
    <button
      type="button"
      className={`sg-admin__delete-btn${className ? ` ${className}` : ""}`}
      onClick={handle_delete}
      disabled={deleting}
      aria-label={`Delete ${product_name}`}
      title="Delete product"
    >
      <TrashIcon />
    </button>
  );
}

export default AdminDeleteProductButton;
