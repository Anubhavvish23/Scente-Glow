import { useEffect, useState } from "react";
import ProductRatingBadge from "./ProductRatingBadge";
import "./ProductHoverImages.css";

function ProductHoverImages({
  images,
  alt,
  product,
  className = "",
  rating_class_name = "",
}) {
  const valid_images = images.filter(Boolean);
  const display_images = valid_images.length > 0 ? valid_images : [];
  const [hovered, set_hovered] = useState(false);
  const [active_index, set_active_index] = useState(0);

  useEffect(() => {
    if (!hovered || display_images.length <= 1) {
      return undefined;
    }

    const interval = window.setInterval(() => {
      set_active_index((prev) => (prev + 1) % display_images.length);
    }, 900);

    return () => window.clearInterval(interval);
  }, [hovered, display_images.length]);

  useEffect(() => {
    if (!hovered) {
      set_active_index(0);
    }
  }, [hovered]);

  return (
    <div
      className={`sg-hover-images ${className}`.trim()}
      onMouseEnter={() => set_hovered(true)}
      onMouseLeave={() => set_hovered(false)}
    >
      <ProductRatingBadge product={product} className={rating_class_name} />
      {display_images.length === 0 ? (
        <div className="sg-hover-images__placeholder" aria-hidden="true" />
      ) : (
        display_images.map((src, index) => (
          <img
            key={`${src}-${index}`}
            src={src}
            alt={index === 0 ? alt : `${alt} ${index + 1}`}
            className={`sg-hover-images__img${index === active_index ? " sg-hover-images__img--active" : ""}`}
            draggable={false}
          />
        ))
      )}
    </div>
  );
}

export default ProductHoverImages;
