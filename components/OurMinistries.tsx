"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

const GALLERY_LABELS = ["Worship Night", "Family Gathering", "GKDI Building", "Serving Team"];

export default function OurMinistries() {
  const rootRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.from(".ministries-heading", {
        y: 24,
        opacity: 0,
        duration: 0.7,
        ease: "power3.out",
        scrollTrigger: {
          trigger: rootRef.current,
          toggleActions: "play reverse play reverse",
          start: "top 80%",
        },
      });

      gsap.from(".ministries-gallery-item", {
        opacity: 0,
        scale: 0.9,
        duration: 0.5,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".ministries-gallery",
          toggleActions: "play reverse play reverse",
          start: "top 82%",
        },
      });
    },
    { scope: rootRef },
  );

  return (
    <section ref={rootRef} className="px-5 py-10 md:px-8 md:py-14">
      <p className="ministries-heading text-xs font-semibold tracking-[0.3em] text-accent-cyan md:text-sm">
        OUR MINISTRIES
      </p>
      <h2 className="ministries-heading mt-3 font-display text-3xl font-bold leading-tight md:text-4xl">
        Our Ministries
      </h2>
      <p className="ministries-heading mt-3 text-sm leading-relaxed text-white/70 md:text-base">
        Bersama Tuhan, GKDI Tangerang telah melayani dan bertumbuh selama 31 tahun.
      </p>

      <div className="ministries-gallery mt-6 grid grid-cols-2 gap-3 md:mt-8 md:grid-cols-4">
        {GALLERY_LABELS.map((label) => (
          <div
            key={label}
            className="ministries-gallery-item flex aspect-[4/3] items-center justify-center rounded-xl border border-ink-panel-border bg-gradient-to-br from-ink-panel to-[#132347] text-center text-xs text-white/40"
          >
            {label}
          </div>
        ))}
      </div>

      <a
        href="https://gkdi.org/"
        target="_blank"
        rel="noopener noreferrer"
        className="ministries-heading mt-8 inline-flex items-center gap-2 text-sm font-semibold text-accent-cyan transition-colors hover:text-white md:text-base"
      >
        Get to Know Our Church
        <span aria-hidden>→</span>
      </a>
    </section>
  );
}
