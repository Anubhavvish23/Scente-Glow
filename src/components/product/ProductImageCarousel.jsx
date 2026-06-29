import { useCallback, useEffect, useRef, useState } from "react";
import "./ProductImageCarousel.css";

function ProductImageCarousel({
  images,
  alt,
  className = "",
  compact = false,
}) {
  const valid_images = images.filter(Boolean);
  const [active_index, set_active_index] = useState(0);
  const [drag_offset, set_drag_offset] = useState(0);
  const [is_dragging, set_is_dragging] = useState(false);
  const drag_start_x = useRef(0);
  const pause_until = useRef(0);
  const container_ref = useRef(null);

  useEffect(() => {
    set_active_index(0);
  }, [valid_images.join("|")]);

  const pause_autoplay = useCallback(() => {
    pause_until.current = Date.now() + 5000;
  }, []);

  useEffect(() => {
    if (valid_images.length <= 1) return undefined;

    const interval = window.setInterval(() => {
      if (Date.now() < pause_until.current || is_dragging) return;
      set_active_index((prev) => (prev + 1) % valid_images.length);
    }, 3000);

    return () => window.clearInterval(interval);
  }, [valid_images.length, is_dragging]);

  const on_pointer_down = (event) => {
    if (valid_images.length <= 1) return;
    if (event.target.closest(".sg-product-carousel__dots")) return;
    drag_start_x.current = event.clientX;
    set_is_dragging(true);
    set_drag_offset(0);
    container_ref.current?.setPointerCapture(event.pointerId);
  };

  const on_pointer_move = (event) => {
    if (!is_dragging) return;
    set_drag_offset(event.clientX - drag_start_x.current);
  };

  const finish_drag = (event) => {
    if (!is_dragging) return;

    const threshold = 50;
    if (drag_offset > threshold) {
      set_active_index((prev) => (prev - 1 + valid_images.length) % valid_images.length);
      pause_autoplay();
    } else if (drag_offset < -threshold) {
      set_active_index((prev) => (prev + 1) % valid_images.length);
      pause_autoplay();
    }

    set_drag_offset(0);
    set_is_dragging(false);

    if (container_ref.current?.hasPointerCapture(event.pointerId)) {
      container_ref.current.releasePointerCapture(event.pointerId);
    }
  };

  if (valid_images.length === 0) return null;

  return (
    <div
      ref={container_ref}
      className={`sg-product-carousel ${compact ? "sg-product-carousel--compact" : ""} ${className}`}
      onPointerDown={on_pointer_down}
      onPointerMove={on_pointer_move}
      onPointerUp={finish_drag}
      onPointerCancel={finish_drag}
    >
      <div
        className={`sg-product-carousel__track ${is_dragging ? "sg-product-carousel__track--dragging" : ""}`}
        style={{
          transform: `translateX(calc(-${active_index * 100}% + ${drag_offset}px))`,
        }}
      >
        {valid_images.map((src, index) => (
          <div key={src} className="sg-product-carousel__slide">
            <img src={src} alt={`${alt} ${index + 1}`} draggable={false} />
          </div>
        ))}
      </div>

      {valid_images.length > 1 && (
        <div className="sg-product-carousel__dots">
          {valid_images.map((src, index) => (
            <button
              key={src}
              type="button"
              className={`sg-product-carousel__dot ${index === active_index ? "sg-product-carousel__dot--active" : ""}`}
              onClick={() => {
                set_active_index(index);
                pause_autoplay();
              }}
              aria-label={`Show image ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default ProductImageCarousel;
