import { useState } from "react";
import Footer from "../components/footer/Footer";
import { useToast } from "../context/ToastContext";
import {
  EmailIcon,
  InstagramIcon,
  WhatsAppIcon,
} from "../components/social/SocialIcons";
import "./Contact.css";

const instagram_url = "https://www.instagram.com/scente.glow/";
const whatsapp_url = "https://wa.me/917406903913";
const contact_email = "hello@scenteglow.com";

const subject_options = [
  "Order Enquiry",
  "Custom Fragrance",
  "General Question",
  "Other",
];

const initial_form = {
  email: "",
  subject: subject_options[0],
  message: "",
};

function Contact() {
  const { show_toast } = useToast();
  const [form, set_form] = useState(initial_form);
  const [submitting, set_submitting] = useState(false);

  const handle_change = (event) => {
    const { name, value } = event.target;
    set_form((prev) => ({ ...prev, [name]: value }));
  };

  const handle_submit = (event) => {
    event.preventDefault();
    set_submitting(true);

    const body_lines = [
      `Email: ${form.email}`,
      `Subject: ${form.subject}`,
      "",
      form.message,
    ];

    const mailto_url = `mailto:${contact_email}?subject=${encodeURIComponent(
      `Scenté Glow — ${form.subject}`
    )}&body=${encodeURIComponent(body_lines.join("\n"))}`;

    window.location.href = mailto_url;
    show_toast("Opening your email app to send the message");
    set_submitting(false);
  };

  return (
    <div className="sg-contact">
      <section className="sg-contact__main">
        <div className="sg-contact__layout">
          <div className="sg-contact__info">
            <p className="sg-contact__eyebrow">Get in touch</p>
            <h1 className="sg-contact__title">We would love to hear from you.</h1>
            <p className="sg-contact__lead">
              Questions about an order, a custom fragrance, or our collections — reach us below
              or send a message.
            </p>

            <div className="sg-contact__details">
              <a
                href={instagram_url}
                target="_blank"
                rel="noopener noreferrer"
                className="sg-contact__detail-row"
              >
                <span className="sg-contact__detail-icon" aria-hidden="true">
                  <InstagramIcon />
                </span>
                <span className="sg-contact__detail-text">
                  <span className="sg-contact__detail-label">Instagram</span>
        
                </span>
              </a>

              <a
                href={whatsapp_url}
                target="_blank"
                rel="noopener noreferrer"
                className="sg-contact__detail-row"
              >
                <span className="sg-contact__detail-icon" aria-hidden="true">
                  <WhatsAppIcon />
                </span>
                <span className="sg-contact__detail-text">
                  <span className="sg-contact__detail-label">WhatsApp</span>
           
                </span>
              </a>

              <a href={`mailto:${contact_email}`} className="sg-contact__detail-row">
                <span className="sg-contact__detail-icon" aria-hidden="true">
                  <EmailIcon />
                </span>
                <span className="sg-contact__detail-text">
                  <span className="sg-contact__detail-label">Email</span>
                
                </span>
              </a>
            </div>
          </div>

          <div className="sg-contact__form-panel">
            <form className="sg-contact__form" onSubmit={handle_submit}>
              <div className="sg-contact__form-grid">
                <div className="sg-contact__field">
                  <label className="sg-contact__label" htmlFor="contact-email">
                    Email Address
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handle_change}
                    className="sg-contact__input"
                    required
                    autoComplete="email"
                  />
                </div>

                <div className="sg-contact__field">
                  <label className="sg-contact__label" htmlFor="contact-subject">
                    Subject
                  </label>
                  <select
                    id="contact-subject"
                    name="subject"
                    value={form.subject}
                    onChange={handle_change}
                    className="sg-contact__input sg-contact__select"
                    required
                  >
                    {subject_options.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="sg-contact__field sg-contact__field--full">
                  <label className="sg-contact__label" htmlFor="contact-message">
                    Message
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    value={form.message}
                    onChange={handle_change}
                    className="sg-contact__input sg-contact__textarea"
                    rows={3}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="sg-contact__submit"
                disabled={submitting}
              >
                Send Message
              </button>

              <p className="sg-contact__form-note">We typically respond within 24 hours</p>
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Contact;
