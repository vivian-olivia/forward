"use client";

import { useRef } from "react";
import Image from "next/image";
import Countdown from "./Countdown";
import { EVENT_DATE_LABEL_EN, EVENT_LOCATION, EVENT_TIME_LABEL } from "@/lib/event";
import { gsap, useGSAP, ScrollTrigger } from "@/lib/gsap";

export default function Hero() {
  const rootRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.fromTo(
        ".hero-forward-logo",
        { clipPath: "inset(0 100% 0 0)", opacity: 0 },
        {
          clipPath: "inset(0 0% 0 0)",
          opacity: 1,
          duration: 1.8,
          delay: 0.15,
          ease: "power2.inOut",
        },
      );
    },
    { scope: rootRef },
  );

  return (
    <section ref={rootRef} className="relative min-h-[100svh] overflow-hidden">
      <div ref={bgRef} className="absolute inset-0 -z-20 scale-110">
        <Image
          src="/background.png"
          alt=""
          fill
          priority
          className="object-cover object-top"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/20 to-ink" />
      </div>

      <div className="flex min-h-[100svh] flex-col items-center px-6 py-10 text-center">
        <Image
          src="/gkdi-logo-crop.png"
          alt="GKDI Tangerang"
          width={321}
          height={137}
          priority
          className="hero-gkdi-logo h-10 w-auto"
        />

        <div className="flex w-full flex-1 flex-col items-center justify-center">
          <p className="hero-invite font-invite text-2xl uppercase text-white sm:text-3xl">
            You&rsquo;re Invited!
          </p>

          <Image
            src="/anniv.png"
            alt="GKDI Tangerang 31st Anniversary"
            width={1586}
            height={262}
            priority
            className="hero-anniv mt-5 h-auto w-full max-w-sm"
          />

          <Image
            src="/forward-logo-crop.png"
            alt="Forward"
            width={3840}
            height={639}
            priority
            className="hero-forward-logo mt-2 h-auto w-full max-w-lg"
          />

          <p className="hero-tagline mt-6 text-base font-bold italic leading-snug text-white">
            {EVENT_DATE_LABEL_EN} &ndash; {EVENT_TIME_LABEL}
            <br />
            {EVENT_LOCATION}
          </p>

          <div className="hero-countdown mx-auto mt-7 max-w-xs">
            <Countdown />
          </div>

          <div className="hero-verse mt-7 max-w-xs rounded-2xl border border-white/25 bg-white/5 px-5 py-4 backdrop-blur-sm">
            <p className="text-xs italic leading-relaxed text-white/90">
              &ldquo;I have been crucified with Christ and I no longer live,
              but Christ lives in me. The life I now live in the body, I live
              by faith in the Son of God, who loved me and gave himself for
              me.&rdquo;
            </p>
            <p className="mt-2 text-xs font-bold text-white">Galatians 2:20</p>
          </div>

          <a
            href="#keep-in-touch"
            onClick={(e) => {
              e.preventDefault();
              gsap.to(window, {
                duration: 1,
                ease: "power2.inOut",
                scrollTo: { y: "#keep-in-touch", offsetY: 0 },
              });
            }}
            className="hero-cta gradient-btn mt-8 inline-flex items-center gap-2 rounded-full px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-900/30 transition-transform active:scale-95"
          >
            RSVP NOW
            <span aria-hidden>→</span>
          </a>
        </div>
      </div>
    </section>
  );
}
