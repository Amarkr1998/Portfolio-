import SectionHeader from "@/components/home/SectionHeader";
import ExpertiseExplorer from "@/components/home/ExpertiseExplorer";

export default function Expertise() {
  return (
    <section id="expertise" aria-labelledby="expertise-heading" className="section">
      <div className="container-x">
        <SectionHeader num="05" label="Expertise" title="The full skills inventory" id="expertise-heading">
          <p>
            Solid markers show where a skill appears in my professional work. Dashed ones come from my resume&rsquo;s
            skills list, with any independent GitHub project that uses them noted underneath.
          </p>
        </SectionHeader>
        <ExpertiseExplorer />
      </div>
    </section>
  );
}
