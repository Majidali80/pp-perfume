
import Products from "@/components/Products";
import Hero from "@/components/hero";
import Carousel from "@/components/carousel";
import Selling from "@/components/selling";
import Promotion from "@/components/promotion";

export default function Home() {
  return (
    <div>
<Hero />
<Carousel />
      <Products />
      <Selling />
      <Promotion />
      
    </div>
  );
}
