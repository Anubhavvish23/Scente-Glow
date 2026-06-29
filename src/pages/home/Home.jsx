import { Link } from "react-router-dom";
import Footer from "../../components/footer/Footer";
import "./Home.css";

function Home() {
  return (
    <div className="sg-home">
      <section className="sg-hero">
        <div className="sg-hero__bg" aria-hidden="true" />
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

      <Footer />
    </div>
  );
}

export default Home;
