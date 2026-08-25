"use client";

import { useState } from "react";
import { projects, type Project } from "@/data/portfolio";
import ProjectCard from "@/components/ProjectCard";
import ProjectDetails from "@/components/ProjectDetails";

export default function Projects() {
  const [selected, setSelected] = useState<Project | null>(null);

  return (
    <section id="projects" className="relative py-28 px-5 sm:px-8">
      <div className="max-w-6xl mx-auto">
        <p className="section-heading mb-4">FEATURED PROJECTS</p>
        <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight mb-14 max-w-2xl">
          Production systems, not demos.
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, i) => (
            <ProjectCard key={project.slug} project={project} index={i} onOpen={setSelected} />
          ))}
        </div>
      </div>

      <ProjectDetails project={selected} onClose={() => setSelected(null)} />
    </section>
  );
}
