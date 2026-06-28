import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useSearch } from "../../context/SearchContext";
import "./Navbar.css";

const Navbar = () => {
  const [scrolled, set_scrolled] = useState(false);
  const [menu_open, set_menu_open] = useState(false);
  const { cart_count, open_cart } = useCart();
  const { open_shop_search } = useSearch();
  const navigate = useNavigate();

  useEffect(() => {
    const on_scroll = () => set_scrolled(window.scrollY > 30);
    window.addEventListener("scroll", on_scroll);
    return () => window.removeEventListener("scroll", on_scroll);
  }, []);

  const handle_search_click = () => {
    set_menu_open(false);
    open_shop_search();
    navigate("/collections");
  };

  return (
    <header className={`sg-navbar ${scrolled ? "sg-navbar--scrolled" : ""}`}>
      <div className="sg-navbar__inner">
        <Link to="/" className="sg-navbar__logo">
          Scenté Glow
        </Link>

        <nav className={`sg-navbar__links ${menu_open ? "sg-navbar__links--open" : ""}`}>
          <Link to="/" onClick={() => set_menu_open(false)}>Home</Link>
          <Link to="/collections" onClick={() => set_menu_open(false)}>Collections</Link>
          <Link to="/about" onClick={() => set_menu_open(false)}>About</Link>
          <Link to="/contact" onClick={() => set_menu_open(false)}>Contact</Link>
        </nav>

        <div className="sg-navbar__actions">
          <button
            type="button"
            className="sg-navbar__icon"
            aria-label="Search candles"
            onClick={handle_search_click}
          >
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
              <circle cx="11" cy="11" r="7" />
              <path d="M20 20l-4-4" />
            </svg>
          </button>
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
            onClick={() => set_menu_open((open) => !open)}
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
