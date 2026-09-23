"use client";

import { useRef } from "react";
import {
  EVENT_DATE_LABEL,
  EVENT_LOCATION,
  EVENT_TIME_LABEL,
} from "@/lib/event";
import { gsap, useGSAP } from "@/lib/gsap";
import { CONTACT_INQUIRY_MESSAGE } from "@/lib/message-templates";

const CONTACT_PHONE_DISPLAY = "+62 851-2196-9884";
const CONTACT_PHONE_WA = "6285121969884";
const MAP_SHARE_LINK =
  "https://www.google.com/maps/place/Serpong+Convention+Center/@-6.2218735,106.6298166,17z/data=!3m1!4b1!4m6!3m5!1s0x2e69f95eaf6c9425:0xdc0c157692e78080!8m2!3d-6.2218735!4d106.6323915!16s%2Fg%2F11zgdg1hpl";
const MAP_EMBED_SRC =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.3169387220373!2d106.62981657491734!3d-6.221873493766155!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f95eaf6c9425%3A0xdc0c157692e78080!2sSerpong%20Convention%20Center!5e0!3m2!1sen!2sid!4v1789661570616!5m2!1sen!2sid";

export default function EventDetail() {
  const rootRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.from(".event-heading", {
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

      gsap.from(".event-row", {
        y: 24,
        opacity: 0,
        duration: 0.6,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".event-panel",
          toggleActions: "play reverse play reverse",
          start: "top 82%",
        },
      });
    },
    { scope: rootRef },
  );

  return (
    <section ref={rootRef} className="px-5 py-10 md:px-8 md:py-14">
      <p className="event-heading text-xs font-semibold tracking-[0.3em] text-accent-cyan md:text-sm">
        EVENT INFORMATION
      </p>
      <h2 className="event-heading mt-3 font-display text-3xl font-bold md:text-4xl">
        Detail Acara
      </h2>

      <div className="event-panel mt-6 divide-y divide-ink-panel-border rounded-2xl border border-ink-panel-border bg-ink-panel/70 md:mt-8">
        <Row icon={<CalendarIcon />} label="Tanggal & Waktu">
          {EVENT_DATE_LABEL}
          <br />
          {EVENT_TIME_LABEL}
        </Row>

        <Row icon={<PinIcon />} label="Lokasi">
          {EVENT_LOCATION}
          <div className="mt-3 overflow-hidden rounded-xl border border-ink-panel-border">
            <iframe
              title="Event location map"
              src={MAP_EMBED_SRC}
              className="h-44 w-full md:h-56"
              loading="lazy"
              suppressHydrationWarning
            />
          </div>
          <a
            href={MAP_SHARE_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-block text-xs text-accent-cyan"
          >
            Buka di Google Maps
          </a>
        </Row>

        <Row icon={<PhoneIcon />} label="Kontak">
          <a
            href={`https://wa.me/${CONTACT_PHONE_WA}?text=${encodeURIComponent(
              CONTACT_INQUIRY_MESSAGE,
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent-cyan"
          >
            {CONTACT_PHONE_DISPLAY}
          </a>
        </Row>
      </div>
    </section>
  );
}

function Row({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="event-row flex gap-3 p-4 md:gap-4 md:p-5">
      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/5 text-accent-cyan md:h-9 md:w-9">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold text-accent-cyan md:text-sm">{label}</p>
        <div className="mt-1 text-sm leading-relaxed text-white/80 md:text-base">
          {children}
        </div>
      </div>
    </div>
  );
}

function CalendarIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M3 9h18M8 3v4M16 3v4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21Z"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <circle cx="12" cy="9.5" r="2.3" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
      <path
        d="M7 3h3l1.5 4-2 1.5a12 12 0 0 0 6 6l1.5-2 4 1.5v3a2 2 0 0 1-2 2C11 19 5 13 5 5a2 2 0 0 1 2-2Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}
