import { HeroSection } from "../components/pages/home/HeroSection";
import { FeaturedProducts } from "../components/pages/home/FeaturedProducts";
import { MapSection } from "../components/pages/home/MapSection";

export default function Home() {
  return (
    <div>
      <HeroSection />
      <FeaturedProducts />
      <MapSection />
    </div>
  );
}
