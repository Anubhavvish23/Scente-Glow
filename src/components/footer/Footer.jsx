import { Link } from "react-router-dom";
import {
  EmailIcon,
  InstagramIcon,
  WhatsAppIcon,
} from "../social/SocialIcons";
import "./Footer.css";

const whatsapp_url = "https://wa.me/917406903913";

function Footer() {
  const current_year = new Date().getFullYear();

  return (
    <footer className="sg-footer">
      <div className="sg-footer__inner">
        <div className="sg-footer__top">
          <div className="sg-footer__brand">
            <Link to="/" className="sg-footer__logo-link">
              <img
                src="/logo.png"
                alt="Scenté Glow Candle"
                className="sg-footer__logo"
              />
            </Link>

            <div className="sg-footer__social">
              <a
                href="https://www.instagram.com/scente.glow/"
                target="_blank"
                rel="noopener noreferrer"
                className="sg-footer__social-link"
                aria-label="Instagram"
              >
                <InstagramIcon />
              </a>
              <a
                href={whatsapp_url}
                target="_blank"
                rel="noopener noreferrer"
                className="sg-footer__social-link"
                aria-label="WhatsApp"
              >
                <WhatsAppIcon />
              </a>
              <a
                href="mailto:scenteglow@protonmail.com"
                className="sg-footer__social-link"
                aria-label="Email"
              >
                <EmailIcon />
              </a>
            </div>
          </div>
        </div>

        <div className="sg-footer__bottom">
          <p className="sg-footer__copy">
            &copy; {current_year} ScentéGlow Candle.  All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
