"use client";

import { useEffect, useRef, useState } from "react";
import { EVENT_DATE_ISO } from "@/lib/event";
import { gsap, useGSAP } from "@/lib/gsap";

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

function getTimeLeft(): TimeLeft | null {
  const diff = new Date(EVENT_DATE_ISO).getTime() - Date.now();
  if (diff <= 0) return null;
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

const UNITS: { key: keyof TimeLeft; label: string }[] = [
  { key: "days", label: "Days" },
  { key: "hours", label: "Hours" },
  { key: "minutes", label: "Min" },
  { key: "seconds", label: "Sec" },
];

export default function Countdown() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null | "loading">(
    "loading",
  );
  const gridRef = useRef<HTMLDivElement>(null);
  const secondsRef = useRef<HTMLParagraphElement>(null);
  const prevSeconds = useRef<number | null>(null);

  const { contextSafe } = useGSAP({ scope: gridRef });

  const pulseSeconds = contextSafe(() => {
    gsap.fromTo(
      secondsRef.current,
      { scale: 1.18, color: "#38bdf8" },
      { scale: 1, color: "#ffffff", duration: 0.4, ease: "power2.out" },
    );
  });

  useEffect(() => {
    const tick = () => setTimeLeft(getTimeLeft());
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (timeLeft === "loading" || !timeLeft) return;
    if (prevSeconds.current !== null && prevSeconds.current !== timeLeft.seconds) {
      pulseSeconds();
    }
    prevSeconds.current = timeLeft.seconds;
  }, [timeLeft, pulseSeconds]);

  if (timeLeft === "loading") return <div className="h-[86px]" />;

  if (!timeLeft) {
    return (
      <p className="font-display text-lg font-semibold text-accent-cyan">
        We&apos;re live — see you there!
      </p>
    );
  }

  return (
    <div ref={gridRef} className="grid grid-cols-4 gap-2">
      {UNITS.map(({ key, label }) => (
        <div
          key={key}
          className="rounded-xl border border-ink-panel-border bg-ink-panel/80 px-2 py-3 text-center"
        >
          <p
            ref={key === "seconds" ? secondsRef : undefined}
            className="font-display text-2xl font-bold tabular-nums text-white"
          >
            {String(timeLeft[key]).padStart(2, "0")}
          </p>
          <p className="mt-0.5 text-[10px] uppercase tracking-wider text-white/50">
            {label}
          </p>
        </div>
      ))}
    </div>
  );
}
