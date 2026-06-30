export const pack_row_count = 3;

export const empty_pack_rows = Array.from({ length: pack_row_count }, () => ({
  size: "",
  price: "",
  discount_percent: "",
}));

export function bulk_packs_to_admin_rows(bulk_packs) {
  if (!Array.isArray(bulk_packs) || bulk_packs.length === 0) {
    return empty_pack_rows.map((row) => ({ ...row }));
  }

  const rows = bulk_packs.slice(0, pack_row_count).map((pack) => {
    const price = Number(pack.price);
    const original_price = Number(pack.original_price);
    let discount_percent = "";

    if (
      Number.isFinite(price) &&
      Number.isFinite(original_price) &&
      original_price > price
    ) {
      discount_percent = String(Math.round((1 - price / original_price) * 100));
    }

    return {
      size: pack.size != null ? String(pack.size) : "",
      price: pack.price != null ? String(pack.price) : "",
      discount_percent,
    };
  });

  while (rows.length < pack_row_count) {
    rows.push({ size: "", price: "", discount_percent: "" });
  }

  return rows;
}

export function admin_rows_to_bulk_packs(rows) {
  if (!Array.isArray(rows)) {
    return [];
  }

  return rows
    .map((row) => {
      const size = Number(row.size);
      const price = Number(row.price);
      const discount_percent = Number(row.discount_percent);

      if (!Number.isFinite(size) || size <= 0 || !Number.isFinite(price) || price < 0) {
        return null;
      }

      const pack = {
        id: `pack-${size}`,
        label: `Pack of ${size}`,
        size,
        price,
      };

      if (Number.isFinite(discount_percent) && discount_percent > 0 && discount_percent < 100) {
        pack.original_price = Math.round(price / (1 - discount_percent / 100));
      }

      return pack;
    })
    .filter(Boolean);
}
