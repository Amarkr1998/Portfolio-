"use client";

import { motion } from "framer-motion";
import { useUIState } from "@/components/providers/UIStateProvider";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import Hero from "@/components/sections/Hero";
import EngineeringStats from "@/components/sections/EngineeringStats";
import About from "@/components/sections/About";
import EngineeringImpact from "@/components/sections/EngineeringImpact";
import ExperienceTimeline from "@/components/sections/ExperienceTimeline";
import Projects from "@/components/sections/Projects";
import ArchitectureGraph from "@/components/sections/ArchitectureGraph";
import AIWorkflow from "@/components/sections/AIWorkflow";
import TechStack from "@/components/sections/TechStack";
import EngineeringProcess from "@/components/sections/EngineeringProcess";
import Certification from "@/components/sections/Certification";
import Education from "@/components/sections/Education";
import Contact from "@/components/sections/Contact";
import RecruiterView from "@/components/RecruiterView";

function CinematicPortfolio() {
  return (
    <>
      <Hero />
      <EngineeringStats />
      <About />
      <EngineeringImpact />
      <ExperienceTimeline />
      <Projects />
      <ArchitectureGraph />
      <AIWorkflow />
      <TechStack />
      <EngineeringProcess />
      <Certification />
      <Education />
      <Contact />
    </>
  );
}

// Switches between the default cinematic portfolio and the fast,
// information-first Recruiter View. Old content unmounts immediately (so
// Recruiter View genuinely drops the 3D scene, not just hides it) while the
// new content fades/slides in — instant on the way out, subtle on the way in.
export default function PortfolioShell() {
  const { recruiterViewOpen } = useUIState();
  const reducedMotion = useReducedMotion();
  const transition = reducedMotion ? { duration: 0 } : { duration: 0.32, ease: [0.16, 1, 0.3, 1] as const };

  return recruiterViewOpen ? (
    <motion.div
      key="recruiter"
      initial={{ opacity: 0, y: reducedMotion ? 0 : 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={transition}
    >
      <RecruiterView />
    </motion.div>
  ) : (
    <motion.div key="portfolio" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={transition}>
      <CinematicPortfolio />
    </motion.div>
  );
}
