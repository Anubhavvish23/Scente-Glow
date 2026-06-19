import { Link } from "react-router-dom";
import ShopSection from "../shop/ShopSection";
import "./Home.css";
import "../shop/Shop.css";

function Home() {
  return (
    <div className="sg-home">
      <section className="sg-hero">
        <div className="sg-hero__bg" />
        <div className="sg-hero__overlay" />

        <div className="sg-hero__content">
          <p className="sg-hero__eyebrow">Artisan Candle Atelier</p>
          <h1 className="sg-hero__title">
            Scent is the silent
            <br />
            language of memory.
          </h1>
          <Link to="/shop" className="sg-hero__cta">
            Shop Now
          </Link>
        </div>
      </section>

      <ShopSection embedded />
    </div>
  );
}

export default Home;
