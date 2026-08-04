import { addDoc, collection } from "firebase/firestore";
import { db } from "../firebase";

const contact_email = "scenteglow99@gmail.com";

export async function send_contact_message({ email, subject, message }) {
  const payload = {
    email: String(email || "").trim(),
    subject: String(subject || "").trim(),
    message: String(message || "").trim(),
    created_at: Date.now(),
  };

  if (!payload.email || !payload.subject || !payload.message) {
    throw new Error("Missing fields");
  }

  await addDoc(collection(db, "contact_messages"), payload);

  fetch(`https://formsubmit.co/ajax/${contact_email}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      email: payload.email,
      _replyto: payload.email,
      _subject: `Scenté Glow — ${payload.subject}`,
      subject: payload.subject,
      message: payload.message,
    }),
  }).catch(() => {});

  return payload;
}
