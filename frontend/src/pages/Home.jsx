import React from "react";
import Hero from "../components/Hero";
import Categories from "../components/Categories";
import WhyUs from "../components/WhyUs";
import Showcase from "../components/Showcase";
import Process from "../components/Process";
import Gallery from "../components/Gallery";
import ContactBanner from "../components/ContactBanner";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <Hero />
      <Categories />
      <WhyUs />
      <Showcase />
      <Process />
      <Gallery />
      <ContactBanner />
    </div>
  );
}
