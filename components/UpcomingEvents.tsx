"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

// TODO: replace with real upcoming events once scheduled.
const EVENTS = [
  { date: "TBA", title: "Coming Soon", description: "Detail acara akan segera diumumkan." },
  { date: "TBA", title: "Coming Soon", description: "Detail acara akan segera diumumkan." },
  { date: "TBA", title: "Coming Soon", description: "Detail acara akan segera diumumkan." },
];

export default function UpcomingEvents() {
  const rootRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.from(".events-heading", {
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

      gsap.from(".events-item", {
        y: 24,
        opacity: 0,
        duration: 0.6,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".events-list",
          toggleActions: "play reverse play reverse",
          start: "top 82%",
        },
      });
    },
    { scope: rootRef },
  );

  return (
    <section ref={rootRef} className="px-5 py-10 md:px-8 md:py-14">
      <p className="events-heading text-xs font-semibold tracking-[0.3em] text-accent-cyan md:text-sm">
        WHAT&apos;S NEXT
      </p>
      <h2 className="events-heading mt-3 font-display text-3xl font-bold md:text-4xl">
        Upcoming Events
      </h2>

      <div className="events-list mt-6 space-y-3 md:mt-8">
        {EVENTS.map((event, i) => (
          <div
            key={i}
            className="events-item flex items-center gap-4 rounded-2xl border border-ink-panel-border bg-ink-panel/70 p-4 md:p-5"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/5 text-xs font-semibold text-accent-cyan md:h-12 md:w-12">
              {event.date}
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-display text-base font-semibold text-white md:text-lg">
                {event.title}
              </p>
              <p className="mt-0.5 text-sm text-white/60 md:text-base">{event.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
