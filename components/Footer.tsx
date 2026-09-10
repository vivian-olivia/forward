"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, useGSAP } from "@/lib/gsap";

export default function Footer() {
  const rootRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
        scrollTrigger: {
          trigger: rootRef.current,
          toggleActions: "play reverse play reverse",
          start: "top 85%",
        },
      });

      tl.from(".footer-logo", { y: 20, opacity: 0, duration: 0.6 })
        .from(
          ".footer-tagline",
          { y: 14, opacity: 0, duration: 0.5 },
          "-=0.3",
        )
        .from(
          ".footer-social",
          { y: 14, opacity: 0, scale: 0.8, duration: 0.45, stagger: 0.08 },
          "-=0.25",
        )
        .from(
          ".footer-line",
          { scaleX: 0, duration: 0.6 },
          "-=0.2",
        )
        .from(
          ".footer-copyright",
          { opacity: 0, duration: 0.4 },
          "-=0.2",
        );
    },
    { scope: rootRef },
  );

  return (
    <footer
      ref={rootRef}
      className="relative overflow-hidden px-5 pb-8 pt-14 text-center"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_100%,rgba(56,189,248,0.18),transparent_55%)]"
      />
      <Image
        src="/gkdi-logo-crop.png"
        alt="GKDI Tangerang"
        width={321}
        height={137}
        className="footer-logo mx-auto h-9 w-auto"
      />
      <p className="footer-tagline mt-4 text-xs text-white/50">
        We gather here to know God and make God known
      </p>

      <div className="mt-5 flex justify-center gap-5 text-white/60">
        <SocialLink label="Instagram" href="https://www.instagram.com/gkdi.tangerang/">
          <InstagramIcon />
        </SocialLink>
        <SocialLink label="YouTube" href="https://www.youtube.com/c/GKDITangerangOfficial">
          <YoutubeIcon />
        </SocialLink>
        <SocialLink label="Facebook" href="https://www.facebook.com/gkditangerang/">
          <FacebookIcon />
        </SocialLink>
        <SocialLink label="Linktree" href="https://linktr.ee/GKDITANGERANG">
          <LinktreeIcon />
        </SocialLink>
      </div>

      <div className="footer-line gradient-line mx-auto mt-8 h-px w-full max-w-xs" />
      <p className="footer-copyright mt-4 text-[11px] text-white/40">
        © 2026 GKDI Tangerang. All rights reserved.
      </p>
    </footer>
  );
}

function SocialLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="footer-social transition-colors hover:text-accent-cyan"
    >
      {children}
    </a>
  );
}

function InstagramIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="17.2" cy="6.8" r="1" fill="currentColor" />
    </svg>
  );
}

function YoutubeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <rect x="2.5" y="6" width="19" height="12" rx="3" stroke="currentColor" strokeWidth="1.6" />
      <path d="M10.5 9.5 15 12l-4.5 2.5v-5Z" fill="currentColor" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M14 21v-7h2.5l.5-3H14V9.2c0-.9.3-1.5 1.6-1.5H17V5.1C16.7 5 15.8 5 14.8 5c-2.1 0-3.5 1.3-3.5 3.7V11H9v3h2.3v7H14Z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LinktreeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 3v18M12 3 7 8M12 3l5 5M6 12l6 4 6-4M8.5 19 12 16l3.5 3"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
