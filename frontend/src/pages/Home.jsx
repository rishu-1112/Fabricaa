import Hero from "../components/Hero";
import Categories from "../components/Categories";
import Showcase from "../components/Showcase";
import Process from "../components/Process";
import WhyUs from "../components/WhyUs";
import Gallery from "../components/Gallery";
import FabricFaq from "../components/FabricFaq";
import ContactBanner from "../components/ContactBanner";

export default function Home() {
  return (
    <div className="paper min-h-screen">
      <Hero />
      <Categories />
      <Showcase />
      <Process />
      <WhyUs />
      <Gallery />
      <FabricFaq />
      <ContactBanner />
    </div>
  );
}
