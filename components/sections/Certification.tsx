"use client";

import { motion } from "framer-motion";
import { certifications } from "@/data/portfolio";
import CertificateCarousel from "@/components/ui/CertificateCarousel";

export default function Certification() {
  return (
    <section id="certification" className="relative py-20 px-5 sm:px-8 overflow-x-hidden">
      <div className="max-w-4xl mx-auto">
        <p className="section-heading mb-4 text-center sm:text-left">CERTIFICATIONS</p>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
        >
          <CertificateCarousel certifications={certifications} />
        </motion.div>
      </div>
    </section>
  );
}
