import Hero from "@/components/sections/Hero";
import EngineeringStats from "@/components/sections/EngineeringStats";
import About from "@/components/sections/About";
import ExperienceTimeline from "@/components/sections/ExperienceTimeline";
import Projects from "@/components/sections/Projects";
import ArchitectureGraph from "@/components/sections/ArchitectureGraph";
import AIWorkflow from "@/components/sections/AIWorkflow";
import TechStack from "@/components/sections/TechStack";
import EngineeringProcess from "@/components/sections/EngineeringProcess";
import Certification from "@/components/sections/Certification";
import Education from "@/components/sections/Education";
import Contact from "@/components/sections/Contact";

export default function Home() {
  return (
    <main className="relative">
      <Hero />
      <EngineeringStats />
      <About />
      <ExperienceTimeline />
      <Projects />
      <ArchitectureGraph />
      <AIWorkflow />
      <TechStack />
      <EngineeringProcess />
      <Certification />
      <Education />
      <Contact />
    </main>
  );
}
