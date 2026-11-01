import Hero from "@/components/home/Hero";
import TechStack from "@/components/home/TechStack";
import SelectedWork from "@/components/home/SelectedWork";
import IndependentProjects from "@/components/home/IndependentProjects";
import Experience from "@/components/home/Experience";
import Expertise from "@/components/home/Expertise";
import About from "@/components/home/About";
import Contact from "@/components/home/Contact";

export default function Home() {
  return (
    <main id="main-content" tabIndex={-1} className="outline-none">
      <Hero />
      <TechStack />
      <SelectedWork />
      <IndependentProjects />
      <Experience />
      <Expertise />
      <About />
      <Contact />
    </main>
  );
}
