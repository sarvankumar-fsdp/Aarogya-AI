import AboutAarogya from "@/components/about";
import { Faq } from "@/components/faq";
import Footer from "@/components/footer";
import { Header } from "@/components/header";
import Hero from "@/components/hero";
import Services from "@/components/services";

export default function Home() {
  return (
    <main>
      <Header />
      <Hero />
      <Services />
      <Faq/>
      <AboutAarogya/>
      <Footer/>
    </main>
  );
}
