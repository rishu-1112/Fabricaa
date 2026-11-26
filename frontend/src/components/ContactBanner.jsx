import React from "react";
import { Link } from "react-router-dom";

const ContactBanner = () => (
  <section className="bg-blue-700 py-20 text-center text-white">
    <h2 className="text-3xl font-bold mb-4">Let’s Talk About Your Fabric Needs</h2>
    <p className="mb-6 text-lg">Reach out to us to collaborate or request custom fabric samples.</p>
    <button className="bg-white text-blue-700 font-semibold px-6 py-3 rounded-full hover:bg-gray-100 transition">
      <Link to="/contact">Contact Us</Link>
    </button>
  </section>
);

export default ContactBanner;
