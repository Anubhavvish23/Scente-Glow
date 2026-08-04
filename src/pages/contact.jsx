import { useRef, useState } from "react";
import Footer from "../components/footer/Footer";
import { send_contact_message } from "../api/contact";
import { useToast } from "../context/ToastContext";
import {
  EmailIcon,
  InstagramIcon,
  WhatsAppIcon,
} from "../components/social/SocialIcons";
import "./Contact.css";

const instagram_url = "https://www.instagram.com/scente.glow/";
const whatsapp_url = "https://wa.me/917406903913";

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
  const form_panel_ref = useRef(null);
  const email_input_ref = useRef(null);
  const [form, set_form] = useState(initial_form);
  const [submitting, set_submitting] = useState(false);
  const [sent, set_sent] = useState(false);

  const handle_change = (event) => {
    const { name, value } = event.target;
    set_form((prev) => ({ ...prev, [name]: value }));
    set_sent(false);
  };

  const handle_email_click = (event) => {
    event.preventDefault();
    form_panel_ref.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    window.setTimeout(() => {
      email_input_ref.current?.focus();
    }, 280);
  };

  const handle_submit = async (event) => {
    event.preventDefault();
    set_submitting(true);
    set_sent(false);

    try {
      await send_contact_message(form);
      set_form(initial_form);
      set_sent(true);
      show_toast("Message sent");
      window.setTimeout(() => set_sent(false), 3200);
    } catch {
      set_sent(false);
    } finally {
      set_submitting(false);
    }
  };

  return (
    <div className="sg-contact">
      <section className="sg-contact__main">
        <div className="sg-contact__layout">
          <div className="sg-contact__info">
            <p className="sg-contact__eyebrow">Get in touch</p>
            <h1 className="sg-contact__title">We would love to hear from you.</h1>
            <p className="sg-contact__lead">
              Questions about an order, a custom fragrance, or our collections — tap below to
              open Instagram or WhatsApp, or send a message with the form.
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

              <button
                type="button"
                className="sg-contact__detail-row sg-contact__detail-row--button"
                onClick={handle_email_click}
                aria-label="Write an email with the form"
              >
                <span className="sg-contact__detail-icon" aria-hidden="true">
                  <EmailIcon />
                </span>
                <span className="sg-contact__detail-text">
                  <span className="sg-contact__detail-label">Email</span>
                </span>
              </button>
            </div>
          </div>

          <div className="sg-contact__form-panel" ref={form_panel_ref}>
            <form className="sg-contact__form" onSubmit={handle_submit}>
              <div className="sg-contact__form-grid">
                <div className="sg-contact__field">
                  <label className="sg-contact__label" htmlFor="contact-email">
                    Email Address
                  </label>
                  <input
                    id="contact-email"
                    ref={email_input_ref}
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
                {submitting ? "Sending..." : "Send Message"}
              </button>

              {sent && (
                <p className="sg-contact__sent" role="status">
                  Message sent
                </p>
              )}
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Contact;
