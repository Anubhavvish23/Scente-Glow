import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import Footer from "../../components/footer/Footer";
import "./About.css";

const about_img = "/about/e1256a022_generated_bebe330e.png";
const detail_img = "/about/b231a77a8_generated_b6b6f734.png";
const lifestyle_img = "/about/b96c96116_generated_a1986ec2.png";

const values = [
  {
    num: "01",
    title: "Natural Materials",
    desc: "100% soy wax, cotton wicks, botanical oils. No synthetics, no compromises. Every ingredient is chosen for purity and performance.",
  },
  {
    num: "02",
    title: "Small Batches",
    desc: "Each candle is hand-poured in batches of twenty or fewer, ensuring meticulous attention to fragrance balance, texture, and burn quality.",
  },
  {
    num: "03",
    title: "Conscious Design",
    desc: "Our vessels are designed to outlast the candle itself — repurposed as vases, cups, or objects of beauty in your home.",
  },
];

function ParallaxSection({ src, alt, className }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-30px", "30px"]);

  return (
    <div ref={ref} className={`sg-about__parallax ${className || ""}`}>
      <motion.img src={src} alt={alt} style={{ y }} className="sg-about__parallax-img" />
    </div>
  );
}

function About() {
  return (
    <div className="sg-about">
      <section className="sg-about__hero">
        <img
          src={about_img}
          alt="Artisan working with candle wax"
          className="sg-about__hero-img"
        />
        <div className="sg-about__hero-overlay">
          <div className="sg-about__hero-content">
            <p className="sg-about__eyebrow sg-about__eyebrow--light">Our Story</p>
            <h1 className="sg-about__hero-title">
              Crafted with devotion, lit with intention.
            </h1>
          </div>
        </div>
      </section>

      <section className="sg-about__section">
        <div className="sg-about__grid sg-about__grid--origin">
          <div>
            <p className="sg-about__eyebrow">The Beginning</p>
            <h2 className="sg-about__heading">
              What started as a quiet ritual became a lifelong pursuit.
            </h2>
            <p className="sg-about__text">
              ScenteGlow was born in a small sun-filled studio in the south of France, where our
              founder first discovered the alchemy of wax and fragrance. What began as evening
              experiments — melting beeswax, blending essential oils, watching flame dance —
              slowly became an obsession with light itself.
            </p>
            <p className="sg-about__text">
              Today, every ScenteGlow candle is still hand-poured in small batches, using 100%
              natural soy wax, lead-free cotton wicks, and fragrance oils sourced from the finest
              perfumeries in Grasse. We believe that the act of lighting a candle should feel like
              a ceremony — a moment of pause in an otherwise hurried world.
            </p>
          </div>
          <ParallaxSection
            src={detail_img}
            alt="Close-up of candle wax texture"
            className="sg-about__parallax--square"
          />
        </div>
      </section>

      <section className="sg-about__section sg-about__section--card">
        <div className="sg-about__values">
          <p className="sg-about__eyebrow sg-about__eyebrow--center">Our Principles</p>
          <h2 className="sg-about__heading sg-about__heading--center">
            Guided by light, grounded in craft.
          </h2>

          <div className="sg-about__values-grid">
            {values.map((value) => (
              <div key={value.num}>
                <span className="sg-about__value-num">{value.num}</span>
                <h3 className="sg-about__value-title">{value.title}</h3>
                <p className="sg-about__value-desc">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="sg-about__section">
        <div className="sg-about__grid sg-about__grid--closing">
          <ParallaxSection
            src={lifestyle_img}
            alt="Candle in a styled interior"
            className="sg-about__parallax--tall"
          />
          <div>
            <h2 className="sg-about__quote">
              "We don't make candles. We compose atmospheres."
            </h2>
            <p className="sg-about__text">
              Every fragrance we create is a story — a memory, a place, a feeling distilled into
              wax. Our hope is that each time you light a ScenteGlow candle, you find a moment of
              beauty in your day.
            </p>
            <Link to="/shop" className="sg-about__cta">
              Shop the Collection
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default About;
