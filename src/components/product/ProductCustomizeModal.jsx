import { useEffect, useState } from "react";
import {
  customization_colors,
  customization_letters,
} from "../../utils/customization";
import "./ProductCustomizeModal.css";

function ProductCustomizeModal({ open, initial_value, on_close, on_confirm }) {
  const [selected_letter, set_selected_letter] = useState("");
  const [selected_color, set_selected_color] = useState(null);

  useEffect(() => {
    if (!open) {
      return;
    }
    set_selected_letter(initial_value?.letter || "");
    set_selected_color(
      customization_colors.find((color) => color.name === initial_value?.color_name) || null
    );
  }, [open, initial_value]);

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    const previous_overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handle_escape = (event) => {
      if (event.key === "Escape") {
        on_close();
      }
    };

    window.addEventListener("keydown", handle_escape);

    return () => {
      document.body.style.overflow = previous_overflow;
      window.removeEventListener("keydown", handle_escape);
    };
  }, [open, on_close]);

  if (!open) {
    return null;
  }

  const can_confirm = Boolean(selected_letter && selected_color);

  const handle_confirm = () => {
    if (!can_confirm) {
      return;
    }

    on_confirm({
      letter: selected_letter,
      color_name: selected_color.name,
      color_hex: selected_color.hex,
    });
    on_close();
  };

  return (
    <div className="sg-customize-overlay" onClick={on_close}>
      <div
        className="sg-customize-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="sg-customize-title"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className="sg-customize-modal__close"
          onClick={on_close}
          aria-label="Close"
        >
          ×
        </button>

        <h2 id="sg-customize-title" className="sg-customize-modal__title">
          Customize your candle
        </h2>
        <p className="sg-customize-modal__lead">Choose a wax colour and letter for your charm.</p>

        <div className="sg-customize-modal__section">
          <p className="sg-customize-modal__label">Colour</p>
          <div className="sg-customize-modal__colors">
            {customization_colors.map((color) => {
              const is_active = selected_color?.name === color.name;

              return (
                <button
                  key={color.name}
                  type="button"
                  className={`sg-customize-modal__color${is_active ? " sg-customize-modal__color--active" : ""}`}
                  onClick={() => set_selected_color(color)}
                  aria-pressed={is_active}
                  aria-label={color.name}
                >
                  <span
                    className="sg-customize-modal__color-swatch"
                    style={{ backgroundColor: color.hex }}
                  />
                  <span className="sg-customize-modal__color-name">{color.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="sg-customize-modal__section">
          <p className="sg-customize-modal__label">Letter</p>
          <div className="sg-customize-modal__letters">
            {customization_letters.map((letter) => {
              const is_active = selected_letter === letter;

              return (
                <button
                  key={letter}
                  type="button"
                  className={`sg-customize-modal__letter${is_active ? " sg-customize-modal__letter--active" : ""}`}
                  onClick={() => set_selected_letter(letter)}
                  aria-pressed={is_active}
                >
                  {letter}
                </button>
              );
            })}
          </div>
        </div>

        <button
          type="button"
          className="sg-customize-modal__confirm"
          onClick={handle_confirm}
          disabled={!can_confirm}
        >
          Save customization
        </button>
      </div>
    </div>
  );
}

export default ProductCustomizeModal;
