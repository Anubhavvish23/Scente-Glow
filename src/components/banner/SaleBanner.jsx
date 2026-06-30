import { useState } from "react";
import { useSiteSettings } from "../../context/SiteSettingsContext";
import { has_sale_banner_content } from "../../utils/coupons";
import "./SaleBanner.css";

function SaleBanner() {
  const { sale_banner_settings, sale_banner_message } = useSiteSettings();
  const [visible, set_visible] = useState(true);

  const handle_dismiss = () => {
    set_visible(false);
  };

  if (
    !visible ||
    !sale_banner_settings.enabled ||
    !has_sale_banner_content(sale_banner_settings)
  ) {
    return null;
  }

  return (
    <div className="sg-sale-banner">
      <p className="sg-sale-banner__text">
        <span className="sg-sale-banner__tag">Sale</span>
        {sale_banner_message}
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
