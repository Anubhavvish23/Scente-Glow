import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import WhyChooseUs from "../../components/home/WhyChooseUs";
import { useSiteSettings } from "../../context/SiteSettingsContext";
import { get_hero_cover_images } from "../../utils/hero_cover";
import "./Home.css";

const hero_swap_ms = 2000;

function Home() {
  const { hero_cover } = useSiteSettings();
  const hero_images = get_hero_cover_images(hero_cover);
  const [active_index, set_active_index] = useState(0);

  useEffect(() => {
    set_active_index(0);
  }, [hero_images.join("|")]);

  useEffect(() => {
    if (hero_images.length <= 1) {
      return undefined;
    }

    const interval = window.setInterval(() => {
      set_active_index((prev) => (prev + 1) % hero_images.length);
    }, hero_swap_ms);

    return () => window.clearInterval(interval);
  }, [hero_images.length, hero_images.join("|")]);

  return (
    <div className="sg-home">
      <section className="sg-hero">
        <div className="sg-hero__bg-stack" aria-hidden="true">
          {hero_images.map((src, index) => (
            <div
              key={`${src}-${index}`}
              className={`sg-hero__bg${index === active_index ? " sg-hero__bg--active" : ""}`}
              style={{ backgroundImage: `url("${src}")` }}
            />
          ))}
        </div>
        <div className="sg-hero__overlay" aria-hidden="true" />

        <div className="sg-hero__inner">
          <div className="sg-hero__content">
            <h1 className="sg-hero__title">
              Light a moment.
              <br />
              Keep it forever.
            </h1>
            <p className="sg-hero__lead">
              Crafted to evoke emotions, memories and moments.
            </p>
            <Link to="/collections" className="sg-hero__cta">
              Shop Now
            </Link>
          </div>
        </div>
      </section>

      <WhyChooseUs />
    </div>
  );
}

export default Home;
