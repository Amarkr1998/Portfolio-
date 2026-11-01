import SectionHeader from "@/components/home/SectionHeader";
import StackMap from "@/components/home/StackMap";

export default function TechStack() {
  return (
    <section id="stack" aria-labelledby="stack-heading" className="section bg-bg-alt">
      <div className="container-x">
        <SectionHeader num="01" label="Tech stack" title="The stack, traced to the work" id="stack-heading">
          <p>
            Every line connects a technology to where I&rsquo;ve used it: solid for professional work, dashed for my
            independent GitHub projects. Hollow nodes are on my resume but not yet shown in a project here.
          </p>
        </SectionHeader>
        <div className="reveal">
          <StackMap />
        </div>
      </div>
    </section>
  );
}
