import { useState } from "react";
import { sale_banner } from "../../utils/coupons";
import "./SaleBanner.css";

function SaleBanner() {
  const [visible, set_visible] = useState(true);

  const handle_dismiss = () => {
    set_visible(false);
  };

  if (!visible) return null;

  return (
    <div className="sg-sale-banner">
      <p className="sg-sale-banner__text">
        <span className="sg-sale-banner__tag">Sale</span>
        {sale_banner.message}
      </p>
      <button
        type="button"
        className="sg-sale-banner__close"
        onClick={handle_dismiss}
        aria-label="Dismiss sale banner"
      >
        ×
      </button>
    </div>
  );
}

export default SaleBanner;
