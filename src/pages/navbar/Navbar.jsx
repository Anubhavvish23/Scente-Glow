import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import "./Navbar.css";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { cart_count, open_cart } = useCart();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`sg-navbar ${scrolled ? "sg-navbar--scrolled" : ""}`}>
      <div className="sg-navbar__inner">
        <Link to="/" className="sg-navbar__logo">
          Scenté Glow
        </Link>

        <nav className={`sg-navbar__links ${menuOpen ? "sg-navbar__links--open" : ""}`}>
          <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link to="/collections" onClick={() => setMenuOpen(false)}>Collections</Link>
          <Link to="/about" onClick={() => setMenuOpen(false)}>About</Link>
          <Link to="/contact" onClick={() => setMenuOpen(false)}>Contact</Link>
        </nav>

        <div className="sg-navbar__actions">
          <button
            type="button"
            className="sg-navbar__icon"
            aria-label="Cart"
            onClick={open_cart}
          >
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4H6z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 01-8 0" />
            </svg>
            {cart_count > 0 && (
              <span className="sg-navbar__badge">{cart_count}</span>
            )}
          </button>
          <button
            className="sg-navbar__burger"
            aria-label="Toggle menu"
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
