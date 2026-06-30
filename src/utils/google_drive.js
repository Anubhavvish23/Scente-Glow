export function extract_google_drive_file_id(url) {
  const trimmed = String(url || "").trim();
  if (!trimmed) {
    return "";
  }

  const patterns = [
    /\/file\/d\/([^/?]+)/,
    /[?&]id=([^&]+)/,
    /googleusercontent\.com\/d\/([^/=]+)/,
    /\/uc\?.*id=([^&]+)/,
  ];

  for (const pattern of patterns) {
    const match = trimmed.match(pattern);
    if (match?.[1]) {
      return match[1];
    }
  }

  return "";
}

export function convert_google_drive_url(url) {
  const trimmed = String(url || "").trim();
  if (!trimmed) {
    return "";
  }

  const file_id = extract_google_drive_file_id(trimmed);
  if (!file_id) {
    return trimmed;
  }

  return `https://lh3.googleusercontent.com/d/${file_id}=w1920`;
}

export function resolve_product_image_url(url) {
  const trimmed = String(url || "").trim();
  if (!trimmed) {
    return "";
  }

  if (
    trimmed.includes("drive.google.com") ||
    trimmed.includes("googleusercontent.com/d/")
  ) {
    return convert_google_drive_url(trimmed);
  }

  return trimmed;
}

export function normalize_image_links(links) {
  if (!Array.isArray(links)) {
    return [];
  }

  return links.map(convert_google_drive_url).filter(Boolean);
}
