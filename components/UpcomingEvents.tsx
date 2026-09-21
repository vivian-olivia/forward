"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import {
  FaCalendarDays,
  FaCalendarPlus,
  FaClock,
  FaLocationDot,
  FaMicrophone,
  FaXmark,
} from "react-icons/fa6";
import { gsap, useGSAP } from "@/lib/gsap";

const EVENTS = [
  {
    title: "Parenting Class: Parenting Through Every Season",
    image: "/events/parenting-2.jpeg",
    imagePosition: "center 25%",
    badgeClass: "bg-accent-orange",
    status: "confirmed" as const,
    date: "Sabtu, 3 Oktober 2026",
    time: "16.00 WIB",
    location: "GKDI Tangerang Lt. 4",
    mapUrl: "https://maps.app.goo.gl/Z8R2r5xFzMVxDUUu6",
    speakers: "Ps Jonson Sibuea & Alin Suliana",
    // WIB (UTC+7) converted to UTC for the Google Calendar link
    calendarStartUTC: "20261003T090000Z",
    calendarEndUTC: "20261003T110000Z",
  },
  {
    title: "Youth Gathering",
    image: "/events/youth-gathering-3.jpeg",
    imagePosition: "center top",
    imageScaleClass: "scale-[1.04] origin-top",
    badgeClass: "bg-accent-cyan",
    status: "coming-soon" as const,
    date: "Rabu, 30 September 2026",
    time: "19.00 - 21.00 WIB",
    location: "GKDI Tangerang Lt. 4",
    mapUrl: "https://maps.app.goo.gl/Z8R2r5xFzMVxDUUu6",
    // WIB (UTC+7) converted to UTC for the Google Calendar link
    calendarStartUTC: "20260930T120000Z",
    calendarEndUTC: "20260930T140000Z",
  },
];

function buildGoogleCalendarUrl(event: (typeof EVENTS)[number]) {
  if (!("calendarStartUTC" in event) || !event.calendarStartUTC) return null;

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: event.title,
    dates: `${event.calendarStartUTC}/${event.calendarEndUTC}`,
    location: event.location ?? "",
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export default function UpcomingEvents() {
  const rootRef = useRef<HTMLElement>(null);
  const [zoomedEvent, setZoomedEvent] = useState<(typeof EVENTS)[number] | null>(null);

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
            <button
              type="button"
              onClick={() => setZoomedEvent(event)}
              className="relative block h-48 w-full cursor-zoom-in overflow-hidden md:h-56"
              aria-label={`Zoom ${event.title} image`}
            >
              <Image
                src={event.image}
                alt={event.title}
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className={`object-cover transition-transform duration-500 group-hover:scale-105 ${
                  "imageScaleClass" in event ? event.imageScaleClass : ""
                }`}
                style={{ objectPosition: event.imagePosition ?? "center" }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-bg via-ink-bg/20 to-transparent" />

              {event.status === "coming-soon" ? (
                <span className="absolute bottom-4 right-4 rounded-full bg-black/50 px-3 py-1 text-xs font-semibold tracking-wide text-white backdrop-blur-sm">
                  Coming Soon
                </span>
              ) : (
                <span
                  className={`absolute bottom-4 right-4 rounded-full px-3 py-1 text-xs font-semibold tracking-wide text-ink-bg ${event.badgeClass}`}
                >
                  {event.date}
                </span>
              )}
            </button>

            <div className="p-5 md:p-6">
              <h3 className="font-display text-xl font-bold text-white md:text-2xl">
                {event.title}
              </h3>

              {"date" in event && event.date ? (
                <div className="mt-4 space-y-2.5 border-t border-white/10 pt-4">
                  <div className="flex items-start gap-2.5 text-sm text-white/70 md:text-base">
                    <FaCalendarDays className="mt-0.5 shrink-0 text-white/40" />
                    <span>{event.date}</span>
                  </div>
                  {"time" in event && event.time ? (
                    <div className="flex items-start gap-2.5 text-sm text-white/70 md:text-base">
                      <FaClock className="mt-0.5 shrink-0 text-white/40" />
                      <span>{event.time}</span>
                    </div>
                  ) : null}
                  {"location" in event && event.location ? (
                    <div className="flex items-start gap-2.5 text-sm text-white/70 md:text-base">
                      <FaLocationDot className="mt-0.5 shrink-0 text-white/40" />
                      {"mapUrl" in event && event.mapUrl ? (
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
                  ) : null}
                  {"speakers" in event && event.speakers ? (
                    <div className="flex items-start gap-2.5 text-sm text-white/70 md:text-base">
                      <FaMicrophone className="mt-0.5 shrink-0 text-white/40" />
                      <span>{event.speakers}</span>
                    </div>
                  ) : null}

                  {(() => {
                    const calendarUrl = buildGoogleCalendarUrl(event);
                    if (!calendarUrl) return null;
                    return (
                      <a
                        href={calendarUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-white/20"
                      >
                        <FaCalendarPlus className="text-white/70" />
                        Set Reminder
                      </a>
                    );
                  })()}
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

      {zoomedEvent ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
          onClick={() => setZoomedEvent(null)}
        >
          <button
            type="button"
            onClick={() => setZoomedEvent(null)}
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
            aria-label="Close zoomed image"
          >
            <FaXmark />
          </button>
          <div
            className="relative h-[80vh] w-full max-w-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={zoomedEvent.image}
              alt={zoomedEvent.title}
              fill
              sizes="100vw"
              className="object-contain"
            />
          </div>
        </div>
      ) : null}
    </section>
  );
}
