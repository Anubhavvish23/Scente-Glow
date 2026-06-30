export function sort_products_for_display(products) {
  return [...products].sort((a, b) => {
    const a_featured = a.featured ? 1 : 0;
    const b_featured = b.featured ? 1 : 0;

    if (b_featured !== a_featured) {
      return b_featured - a_featured;
    }

    return (a.name || "").localeCompare(b.name || "");
  });
}
