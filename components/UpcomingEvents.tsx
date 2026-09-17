"use client";

import { useRef } from "react";
import Image from "next/image";
import { FaCalendarDays, FaClock, FaLocationDot, FaMicrophone } from "react-icons/fa6";
import { gsap, useGSAP } from "@/lib/gsap";

const EVENTS = [
  {
    title: "Parenting Class",
    tagline: "Dekat di Hati, Kuat di Relasi",
    image: "/events/parenting-class.jpg",
    imagePosition: "center 25%",
    badgeClass: "bg-accent-orange",
    taglineClass: "text-accent-orange",
    status: "confirmed" as const,
    date: "Sabtu, 3 Oktober 2026",
    time: "16.00 WIB",
    location: "GKDI Tangerang Lt. 4",
    mapUrl: "https://maps.app.goo.gl/Z8R2r5xFzMVxDUUu6",
    speakers: "Ps Jonson Sibuea & Alin Suliana",
  },
  {
    title: "Youth Gathering",
    tagline: "Kumpul seru bareng YouthConnect",
    image: "/events/youth-gathering.jpg",
    badgeClass: "bg-accent-cyan",
    taglineClass: "text-accent-cyan",
    status: "coming-soon" as const,
  },
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
        y: 32,
        opacity: 0,
        duration: 0.6,
        stagger: 0.15,
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

      <div className="events-list mt-6 grid gap-5 sm:grid-cols-2 md:mt-8 md:gap-6">
        {EVENTS.map((event) => (
          <div
            key={event.title}
            className="events-item group relative overflow-hidden rounded-2xl border border-ink-panel-border bg-ink-panel/70"
          >
            <div className="relative h-48 w-full overflow-hidden md:h-56">
              <Image
                src={event.image}
                alt={event.title}
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                style={{ objectPosition: event.imagePosition ?? "center" }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-bg via-ink-bg/20 to-transparent" />

              {event.status === "coming-soon" ? (
                <span className="absolute right-4 top-4 rounded-full bg-black/50 px-3 py-1 text-xs font-semibold tracking-wide text-white backdrop-blur-sm">
                  Coming Soon
                </span>
              ) : (
                <span
                  className={`absolute right-4 top-4 rounded-full px-3 py-1 text-xs font-semibold tracking-wide text-ink-bg ${event.badgeClass}`}
                >
                  {event.date}
                </span>
              )}
            </div>

            <div className="p-5 md:p-6">
              <h3 className="font-display text-xl font-bold text-white md:text-2xl">
                {event.title}
              </h3>
              <p className={`mt-1 text-sm font-medium md:text-base ${event.taglineClass}`}>
                {event.tagline}
              </p>

              {event.status === "confirmed" ? (
                <div className="mt-4 space-y-2.5 border-t border-white/10 pt-4">
                  <div className="flex items-start gap-2.5 text-sm text-white/70 md:text-base">
                    <FaCalendarDays className="mt-0.5 shrink-0 text-white/40" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-start gap-2.5 text-sm text-white/70 md:text-base">
                    <FaClock className="mt-0.5 shrink-0 text-white/40" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-start gap-2.5 text-sm text-white/70 md:text-base">
                    <FaLocationDot className="mt-0.5 shrink-0 text-white/40" />
                    {event.mapUrl ? (
                      <a
                        href={event.mapUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline decoration-white/30 underline-offset-2 transition-colors hover:text-white"
                      >
                        {event.location}
                      </a>
                    ) : (
                      <span>{event.location}</span>
                    )}
                  </div>
                  <div className="flex items-start gap-2.5 text-sm text-white/70 md:text-base">
                    <FaMicrophone className="mt-0.5 shrink-0 text-white/40" />
                    <span>{event.speakers}</span>
                  </div>
                </div>
              ) : (
                <p className="mt-4 border-t border-white/10 pt-4 text-sm text-white/60 md:text-base">
                  Detail acara akan segera diumumkan. Stay tuned!
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
