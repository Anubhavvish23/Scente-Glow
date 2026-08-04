import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import Footer from "../../components/footer/Footer";
import "./About.css";

const about_img = "/about/e1256a022_generated_bebe330e.png";
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

      <section className="sg-about__section sg-about__section--origin">
        <div className="sg-about__grid sg-about__grid--origin">
          <div className="sg-about__origin-copy">
            <p className="sg-about__eyebrow">The Beginning</p>
            <h2 className="sg-about__heading sg-about__heading--origin">
              What started as a quiet ritual became a lifelong pursuit.
            </h2>
            <p className="sg-about__text">
              Scenté Glow began with a simple passion—to create candles that make everyday moments
              feel warm, comforting and memorable.
            </p>
            <p className="sg-about__text">
              Every candle is handcrafted in small batches using 100% natural soy wax, premium
              fragrance oils and carefully selected materials to ensure a clean long-lasting burn.
              We believe a candle is more than décor—it's a way to celebrate milestones, create
              cozy evenings and turn everyday moments into cherished memories.
            </p>
            <p className="sg-about__text">
              Whether it's a thoughtful gift, a festive hamper or a quiet evening at home, every
              Scenté Glow creation is made with care, creativity and attention to detail. Our
              mission is simple - to bring warmth, beauty and a touch of luxury into every space
              and every celebration.
            </p>
          </div>
          <ParallaxSection
            src={lifestyle_img}
            alt="Hand-poured Scenté Glow candle"
            className="sg-about__parallax--origin"
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
              wax. Our hope is that each time you light a Scenté Glow candle, you find a moment of
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
