import Hero from "@/components/Hero";
import WorkList from "@/components/WorkList";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col">
      <Hero />
      <section id="work" className="pt-[120px]">
        <WorkList />
      </section>
      <section id="contact">
        <Contact />
      </section>
      <Footer />
    </main>
  );
}
