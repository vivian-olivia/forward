"use client";

import { useEffect, useRef, useState } from "react";

type Phase = "floating" | "playing" | "fading" | "done";

// Defaults, used when the props below aren't passed in.
const DEFAULT_FADE_START_SECONDS = 2.4;
const DEFAULT_FADE_DURATION_MS = 1800;

export default function EnvelopeIntro({
  children,
  fadeStartSeconds = DEFAULT_FADE_START_SECONDS,
  fadeDurationMs = DEFAULT_FADE_DURATION_MS,
}: {
  children: React.ReactNode;
  /** Second in envelope.mp4 at which the overlay starts fading out. */
  fadeStartSeconds?: number;
  /** Duration of the overlay's opacity-drop transition, in milliseconds. */
  fadeDurationMs?: number;
}) {
  const [phase, setPhase] = useState<Phase>("floating");
  const envelopeRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (phase === "playing") {
      envelopeRef.current?.play().catch(() => {});
    }
  }, [phase]);

  const handleOpen = () => {
    if (phase !== "floating") return;
    setPhase("playing");
  };

  const handleTransitionEnd = () => {
    if (phase === "fading") setPhase("done");
  };

  const envelopeVisible = phase === "playing" || phase === "fading";

  return (
    <>
      {children}
      {phase !== "done" && (
        <div
          className={`fixed inset-0 z-[100] bg-ink transition-opacity ease-out ${
            phase === "fading" ? "pointer-events-none opacity-0" : "opacity-100"
          }`}
          style={{ transitionDuration: `${fadeDurationMs}ms` }}
          onTransitionEnd={handleTransitionEnd}
        >
          {/* Static poster instead of an autoplaying loop: in-app browsers (e.g. WhatsApp)
              block background video autoplay and show a stray native play icon over it. */}
          <img
            src="/envelope-poster.jpg"
            alt=""
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${
              envelopeVisible ? "opacity-0" : "opacity-100"
            }`}
          />
          <video
            ref={envelopeRef}
            src="/envelope.mp4"
            muted
            playsInline
            preload="auto"
            onTimeUpdate={(e) => {
              const video = e.currentTarget;
              if (video.currentTime >= fadeStartSeconds) {
                setPhase("fading");
              }
            }}
            onEnded={() => setPhase("fading")}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${
              envelopeVisible ? "opacity-100" : "opacity-0"
            }`}
          />
          {phase === "floating" && (
            <button
              type="button"
              onClick={handleOpen}
              aria-label="Open invitation"
              className="absolute inset-0"
            />
          )}
        </div>
      )}
    </>
  );
}
