import React,{useState} from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Instagram, Linkedin, Facebook } from "lucide-react";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Sending...");
    try {
      const res = await fetch("http://localhost:5000/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (res.ok) {
        setStatus("✅ Message sent successfully!");
        setForm({ name: "", email: "", message: "" });
        // clear status after a while
        setTimeout(() => setStatus(""), 5000);
      } else setStatus(`❌ ${data.error || "Something went wrong."}`);
    } catch (err) {
      setStatus("❌ Error sending message. Try again later.");
    }
  };
  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-6xl mx-auto px-6 text-center">
        {/* Heading Section */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-5xl font-bold mb-4 text-gray-900"
        >
          Get in Touch
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-gray-600 mb-12 max-w-2xl mx-auto"
        >
          Have a question, partnership idea, or collaboration in mind? We’d love to hear from you. 
          Reach out via any of the channels below.
        </motion.p>

        {/* Contact Info Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {[
            { icon: <Mail className="w-6 h-6 text-indigo-600" />, title: "Email", value: "fabrica.textile@gmail.com" },
            { icon: <Phone className="w-6 h-6 text-indigo-600" />, title: "Phone", value: "+91 62090 94913" },
            { icon: <MapPin className="w-6 h-6 text-indigo-600" />, title: "Address", value: "123 Textile Park, Delhi, India" },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300"
            >
              <div className="flex justify-center mb-4">{item.icon}</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">{item.title}</h3>
              <p className="text-gray-600">{item.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Contact Form */}
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-2xl mx-auto bg-white rounded-2xl shadow-md p-8 space-y-6"
        >
          <div className="grid md:grid-cols-2 gap-4">
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              type="text"
              placeholder="Your Name"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              type="email"
              placeholder="Your Email"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            rows="5"
            placeholder="Your Message"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          ></textarea>
          <div className="flex flex-col items-center">
            <button
              type="submit"
              disabled={status === "Sending..."}
              className={`bg-indigo-600 text-white font-semibold px-8 py-3 rounded-lg hover:bg-indigo-700 transition-all duration-300 ${
                status === "Sending..." ? "opacity-60 cursor-not-allowed" : ""
              }`}
            >
              {status === "Sending..." ? "Sending..." : "Send Message"}
            </button>
            {status && (
              <p className="mt-3 text-sm text-gray-700">{status}</p>
            )}
          </div>
        </motion.form>

        {/* Social Media Icons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex justify-center gap-8 mt-12"
        >
          <a href="#" className="text-gray-600 hover:text-indigo-600 transition-all">
            <Instagram size={28} />
          </a>
          <a href="#" className="text-gray-600 hover:text-indigo-600 transition-all">
            <Linkedin size={28} />
          </a>
          <a href="#" className="text-gray-600 hover:text-indigo-600 transition-all">
            <Facebook size={28} />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
