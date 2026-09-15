"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

const TIMELINE = [
  {
    year: "1995",
    title: "Awal Berdiri",
    body: "GKDI Tangerang pertama kali berdiri sebagai bagian dari Gereja Kristus di Indonesia.",
  },
  {
    year: "2006",
    title: "Pergantian Kepemimpinan",
    body: "Kepemimpinan gereja beralih kepada Pdt. Sahat Joyce.",
  },
  {
    year: "2009",
    title: "Pindah ke Graha GKDI Karawaci",
    body: "Gereja pindah dan mulai beribadah di Graha GKDI Karawaci.",
  },
  {
    year: "2024",
    title: "Jemaat Bertumbuh",
    body: "Jumlah jemaat bertumbuh hingga mencapai 500 orang.",
  },
  {
    year: "2026",
    title: "Pindah ke Serpong Convention Center",
    body: "Gereja pindah dan mulai beribadah di Serpong Convention Center.",
  },
];

const GALLERY_LABELS = ["Worship Night", "Family Gathering", "GKDI Building", "Serving Team"];

export default function OurStory() {
  const rootRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.from(".story-heading", {
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

      gsap.from(".story-timeline-item", {
        y: 28,
        opacity: 0,
        duration: 0.6,
        stagger: 0.18,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".story-timeline",
          toggleActions: "play reverse play reverse",
          start: "top 78%",
        },
      });

      gsap.from(".story-timeline-dot", {
        scale: 0,
        duration: 0.4,
        stagger: 0.18,
        ease: "back.out(3)",
        scrollTrigger: {
          trigger: ".story-timeline",
          toggleActions: "play reverse play reverse",
          start: "top 78%",
        },
      });

      gsap.from(".story-gallery-label", {
        y: 20,
        opacity: 0,
        duration: 0.5,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".story-gallery",
          toggleActions: "play reverse play reverse",
          start: "top 85%",
        },
      });

      gsap.from(".story-gallery-item", {
        opacity: 0,
        scale: 0.9,
        duration: 0.5,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".story-gallery",
          toggleActions: "play reverse play reverse",
          start: "top 82%",
        },
      });
    },
    { scope: rootRef },
  );

  return (
    <section ref={rootRef} className="px-5 py-10 md:px-8 md:py-14">
      <p className="story-heading text-xs font-semibold tracking-[0.3em] text-accent-cyan md:text-sm">
        OUR STORY
      </p>
      <h2 className="story-heading mt-3 font-display text-3xl font-bold leading-tight md:text-4xl">
        31 Years of
        <br />
        Faith &amp; Impact
      </h2>
      <p className="story-heading mt-3 text-sm leading-relaxed text-white/70 md:text-base">
        Bersama Tuhan, GKDI Tangerang telah melayani dan bertumbuh selama 31 tahun.
        Berikut adalah perjalanan singkat kami:
      </p>

      <ol className="story-timeline relative mt-8 space-y-8 border-l border-ink-panel-border pl-6 md:mt-10">
        {TIMELINE.map((item) => (
          <li key={item.year} className="story-timeline-item relative">
            <span className="story-timeline-dot absolute -left-[29px] top-1 h-3 w-3 rounded-full border-2 border-ink bg-accent-cyan" />
            <p className="text-xs font-semibold tracking-wide text-accent-cyan md:text-sm">
              {item.year}
            </p>
            <h3 className="mt-1 font-display text-base font-semibold text-white md:text-lg">
              {item.title}
            </h3>
            <p className="mt-1 text-sm text-white/60 md:text-base">{item.body}</p>
          </li>
        ))}
      </ol>

      <p className="story-gallery-label mt-10 text-xs font-semibold tracking-[0.25em] text-accent-cyan md:text-sm">
        GALERI GKDI Tangerang
      </p>
      <div className="story-gallery mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
        {GALLERY_LABELS.map((label) => (
          <div
            key={label}
            className="story-gallery-item flex aspect-[4/3] items-center justify-center rounded-xl border border-ink-panel-border bg-gradient-to-br from-ink-panel to-[#132347] text-center text-xs text-white/40"
          >
            {label}
          </div>
        ))}
      </div>

      <a
        href="https://gkdi.org/"
        target="_blank"
        rel="noopener noreferrer"
        className="story-gallery-label mt-8 inline-flex items-center gap-2 text-sm font-semibold text-accent-cyan transition-colors hover:text-white md:text-base"
      >
        Get to Know Our Church
        <span aria-hidden>→</span>
      </a>
    </section>
  );
}
