import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";

const Home = () => {
  return (
    <main className="sg-home">
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
    </main>
  );
};

export default Home;
