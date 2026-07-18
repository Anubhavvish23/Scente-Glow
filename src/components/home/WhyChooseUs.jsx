import { motion } from "framer-motion";
import "./WhyChooseUs.css";

const reasons = [
  {
    num: "01",
    title: "Hand-poured care",
    text: "Each candle is poured in small batches, so every flame feels intentional — never mass-made.",
    icon: "flame",
  },
  {
    num: "02",
    title: "Clean, lasting glow",
    text: "Natural soy wax and lead-free cotton wicks for a soft burn that fills the room without harshness.",
    icon: "leaf",
  },
  {
    num: "03",
    title: "Made to your mood",
    text: "Choose fragrance, colour, and finishes that feel personal — candles crafted around your ritual.",
    icon: "heart",
  },
];

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12 },
  },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

function ReasonIcon({ type }) {
  if (type === "flame") {
    return (
      <svg className="sg-why__icon" viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M12 2.5c1.2 2.4.6 3.9-.2 5.2-.9 1.5-2 2.7-2 4.6 0 2.4 1.9 4.2 4.2 4.2s4.2-1.8 4.2-4.2c0-2.8-1.6-4.5-2.8-6.1C14.2 4.4 13.4 3.3 12 2.5z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M12 18.3c-1.3 0-2.3-1-2.3-2.2 0-1.1.7-1.9 1.5-2.7.4-.4.8-.9.8-1.6"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (type === "leaf") {
    return (
      <svg className="sg-why__icon" viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M5 19c7.5 0 12.5-5 14-14-9 1.5-14 6.5-14 14z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M5 19c3-3 6.5-5.5 11-7"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  return (
    <svg className="sg-why__icon" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 20s-6.5-4.2-8.7-7.6C1.8 10.2 2.6 7 5.2 6.1c1.6-.6 3.4 0 4.4 1.4C10.6 6.1 12.4 5.5 14 6.1c2.6.9 3.4 4.1 1.9 6.3C13.7 15.8 12 20 12 20z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function WhyChooseUs() {
  return (
    <section className="sg-why" aria-labelledby="sg-why-title">
      <div className="sg-why__inner">
        <motion.div
          className="sg-why__intro"
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="sg-why__heading">Why choose us</p>
          <h2 id="sg-why-title" className="sg-why__title">
            Light made with patience,
            <br />
            kept with feeling.
          </h2>
          <p className="sg-why__lead">
            Scenté Glow is for quiet evenings, warm tables, and gifts that linger — crafted slowly,
            so every detail stays soft and true.
          </p>
        </motion.div>

        <motion.ul
          className="sg-why__list"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
        >
          {reasons.map((reason) => (
            <motion.li key={reason.num} className="sg-why__item" variants={item}>
              <div className="sg-why__icon-wrap">
                <ReasonIcon type={reason.icon} />
              </div>
              <span className="sg-why__num">{reason.num}</span>
              <h3 className="sg-why__item-title">{reason.title}</h3>
              <p className="sg-why__item-text">{reason.text}</p>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}

export default WhyChooseUs;
