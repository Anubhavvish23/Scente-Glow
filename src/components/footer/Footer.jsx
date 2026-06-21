import { Link } from "react-router-dom";
import "./Footer.css";

const whatsapp_url = "https://wa.me/917406903913";

function Footer() {
  const current_year = new Date().getFullYear();

  return (
    <footer className="sg-footer">
      <div className="sg-footer__inner">
        <div className="sg-footer__grid">
          <div>
            <h4 className="sg-footer__heading">Navigate</h4>
            <div className="sg-footer__links-col">
              <Link to="/">Home</Link>
              <Link to="/shop">Shop</Link>
              <Link to="/about">About</Link>
              <Link to="/contact">Contact</Link>
            </div>
          </div>

          <div>
            <h4 className="sg-footer__heading">Information</h4>
            <div className="sg-footer__links-col">
              <Link to="/about">Our Story</Link>
              <Link to="/shop">Collections</Link>
              <Link to="/contact">Shipping & Returns</Link>
              <Link to="/contact">Care Instructions</Link>
            </div>
          </div>

          <div>
            <h4 className="sg-footer__heading">Connect</h4>
            <div className="sg-footer__links-col">
              <a
                href="https://www.instagram.com/scenteglow"
                target="_blank"
                rel="noopener noreferrer"
              >
                Instagram
              </a>
              <a
                href="https://www.pinterest.com/scenteglow"
                target="_blank"
                rel="noopener noreferrer"
              >
                Pinterest
              </a>
              <a href={whatsapp_url} target="_blank" rel="noopener noreferrer">
                WhatsApp · +91 74069 03913
              </a>
              <a href="mailto:hello@scenteglow.com">hello@scenteglow.com</a>
            </div>
          </div>
        </div>

        <div className="sg-footer__brand">
          <Link to="/" className="sg-footer__logo-link">
            <img
              src="/logo.png"
              alt="Scenté Glow Candle"
              className="sg-footer__logo"
            />
          </Link>
        </div>

        <div className="sg-footer__bottom">
          <p className="sg-footer__copy">
            &copy; {current_year} Scenté Glow Candle Atelier. All rights reserved.
          </p>
          <div className="sg-footer__legal">
            <Link to="/contact">Privacy</Link>
            <Link to="/contact">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
