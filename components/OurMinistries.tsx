"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { FaArrowLeft, FaXmark } from "react-icons/fa6";
import { gsap, useGSAP } from "@/lib/gsap";

const SLIDES = [
  {
    label: "Kids Kingdom",
    subtitle: "Kerajaan Kanak-Kanak",
    description:
      "Sekolah Minggu sebagai tempat anak-anak mengenal kasih dan Firman Tuhan lewat berbagai aktivitas menyenangkan.",
    tag: "#FunFaithJourney",
  },
  {
    label: "SuperTeens",
    slug: "superteens",
    photoCount: 6,
    description:
      "Komunitas seru untuk remaja usia SMP–SMA (12–18 tahun) yang ingin membangun pertemanan positif di dalam Kristus.",
    tag: "#FaithAndFriendship",
  },
  {
    label: "YouthConnect",
    slug: "youth-connect",
    photoCount: 12,
    description:
      "Ruang kumpul anak muda yang berkuliah atau bekerja, dan young professionals. Tempat terbaik memaksimalkan talenta dan membawa dampak nyata bagi sesama.",
    tag: "#LiveImpactfully",
  },
  {
    label: "GEM",
    slug: "gem",
    photoCount: 6,
    subtitle: "GKDI English Ministry",
    description:
      "Komunitas berbahasa Inggris yang terbuka untuk segala usia, bagi siapa saja yang nyaman dengan komunikasi bilingual.",
    tag: "#BilingualCommunity",
  },
  {
    label: "Married Ministry",
    slug: "married",
    photoCount: 10,
    description:
      "Wadah bagi para pasangan untuk bertumbuh bersama, membangun keluarga yang kokoh di atas dasar kasih dan kebenaran Tuhan.",
    tag: "#StrongerTogether",
  },
  {
    label: "PIWA",
    slug: "piwa",
    photoCount: 3,
    subtitle: "Pria Ilahi Wanita Allah",
    description:
      "Komunitas hangat bagi para senior di usia senja untuk terus menikmati dan membagikan kasih Tuhan.",
    tag: "#GracefulAging",
  },
  {
    label: "Personal Bible Study",
    slug: "bible-study",
    photoCount: 3,
    description:
      "Perjalanan personal untuk lebih mengenal Kristus melalui Firman-Nya, didampingi oleh fasilitator yang siap membimbingmu langkah demi langkah.",
    tag: "#DiscoverTheWord",
  },
  {
    label: "Bible Talk",
    slug: "bible-talk",
    photoCount: 7,
    description:
      "Diskusi Alkitab interaktif dalam ruang yang aman dan hangat di setiap komunitas. Tempat terbaik untuk mulai mengenal Tuhan dan terhubung dengan sesama.",
    tag: "#SafeSpaceToConnect",
  },
  {
    label: "Dan Masih Banyak Lagi!",
    slug: "others",
    photoCount: 10,
    subtitle: "Ibadah & Special Events",
    description: "Ingin tahu keseruan aktivitas kami lainnya?",
    tag: "#MoreToExplore",
    ctaLabel: "Hubungi Kami",
  },
].map((slide, i) => ({
  ...slide,
  gallery: slide.slug
    ? Array.from(
        { length: slide.photoCount ?? 6 },
        (_, g) => `/ministries/${slide.slug}/${g + 1}.jpg`,
      )
    : Array.from({ length: 6 }, (_, g) => `https://picsum.photos/seed/ministry-${i}-${g}/700/900`),
}));

export default function OurMinistries() {
  const rootRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const dragState = useRef({
    startX: 0,
    scrollLeft: 0,
    dragging: false,
    moved: false,
    lastX: 0,
    lastTime: 0,
    velocity: 0,
  });
  const rafRef = useRef<number | null>(null);
  const settleRafRef = useRef<number | null>(null);
  const snapTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [mounted, setMounted] = useState(false);
  const [activeSlide, setActiveSlide] = useState<number | null>(null);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const lightboxImgRef = useRef<HTMLImageElement>(null);
  const lightboxOriginRef = useRef<DOMRect | null>(null);
  const detailRootRef = useRef<HTMLDivElement>(null);
  const activeOriginRef = useRef<DOMRect | null>(null);
  const galleryTrackRef = useRef<HTMLDivElement>(null);
  const galleryRafRef = useRef<number | null>(null);
  const galleryPausedRef = useRef(false);
  const galleryResumeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const galleryDragState = useRef({ dragging: false, startX: 0, scrollLeft: 0, moved: false });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    document.body.style.overflow = activeSlide !== null ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [activeSlide]);

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
    },
    { scope: rootRef },
  );

  const updateScales = () => {
    const track = trackRef.current;
    if (!track) return;
    // Use layout position (offsetLeft), not getBoundingClientRect, since the
    // transform applied below would otherwise feed back into the next
    // measurement and make the "centered" card drift off-center over time.
    const trackCenter = track.scrollLeft + track.clientWidth / 2;

    itemRefs.current.forEach((item) => {
      if (!item) return;
      const itemCenter = item.offsetLeft + item.offsetWidth / 2;
      const dist = itemCenter - trackCenter;
      const factor = Math.min(Math.abs(dist) / (track.clientWidth / 2.2), 1);
      const scale = 1 - factor * 0.24;
      const opacity = 1 - factor * 0.45;
      // Anchor the shrink to the edge closest to the viewport center so it
      // never eats into the sliver of the card that's still peeking into view.
      item.style.transformOrigin = dist > 0 ? "left center" : dist < 0 ? "right center" : "center";
      item.style.transform = `scale(${scale})`;
      item.style.opacity = String(opacity);
      item.style.zIndex = String(Math.round((1 - factor) * 100));
    });
  };

  const scheduleUpdate = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      updateScales();
    });
  };

  // Native touch/trackpad momentum can keep scrolling the track after our own
  // drag handlers have let go, leaving it stopped between two cards with
  // neither centered. Any "scroll" event restarts this debounce; once
  // scrolling has been quiet for a beat (and no finger is actively dragging),
  // snap to whichever card is nearest the center.
  const scheduleSnap = () => {
    if (snapTimeoutRef.current) clearTimeout(snapTimeoutRef.current);
    snapTimeoutRef.current = setTimeout(() => {
      if (dragState.current.dragging) return;
      const idx = findNearestIndex();
      if (idx >= 0) centerItem(idx);
    }, 140);
  };

  const onScroll = () => {
    scheduleUpdate();
    scheduleSnap();
  };

  useEffect(() => {
    const track = trackRef.current;
    const startItem = itemRefs.current[0];
    if (track && startItem) {
      track.scrollLeft =
        startItem.offsetLeft - track.clientWidth / 2 + startItem.offsetWidth / 2;
    }
    updateScales();

    const handleResize = () => {
      scheduleUpdate();
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (settleRafRef.current) cancelAnimationFrame(settleRafRef.current);
      if (snapTimeoutRef.current) clearTimeout(snapTimeoutRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Drives the settle animation ourselves (instead of native scrollTo({behavior:
  // "smooth"}) or CSS scroll-snap) so it always plays as a real, consistently-
  // timed slide, and so it can't fight the loop-wrap correction mid-flight.
  const animateScrollTo = (target: number, duration = 420) => {
    const track = trackRef.current;
    if (!track) return;
    if (settleRafRef.current) cancelAnimationFrame(settleRafRef.current);
    const start = track.scrollLeft;
    const change = target - start;
    if (Math.abs(change) < 1) return;
    const startTime = performance.now();
    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

    const step = (now: number) => {
      const t = Math.min((now - startTime) / duration, 1);
      track.scrollLeft = start + change * easeOutCubic(t);
      if (t < 1) {
        settleRafRef.current = requestAnimationFrame(step);
      } else {
        settleRafRef.current = null;
      }
    };
    settleRafRef.current = requestAnimationFrame(step);
  };

  const findNearestIndex = (scrollLeftOverride?: number) => {
    const track = trackRef.current;
    if (!track) return -1;
    const scrollLeft = scrollLeftOverride ?? track.scrollLeft;
    const trackCenter = scrollLeft + track.clientWidth / 2;
    let bestIdx = -1;
    let bestDist = Infinity;
    itemRefs.current.forEach((item, idx) => {
      if (!item) return;
      const itemCenter = item.offsetLeft + item.offsetWidth / 2;
      const dist = Math.abs(itemCenter - trackCenter);
      if (dist < bestDist) {
        bestDist = dist;
        bestIdx = idx;
      }
    });
    return bestIdx;
  };

  const centerItem = (index: number) => {
    const track = trackRef.current;
    const item = itemRefs.current[index];
    if (!track || !item) return;
    const target =
      item.offsetLeft - track.clientWidth / 2 + item.offsetWidth / 2;
    animateScrollTo(target);
  };

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const track = trackRef.current;
    if (!track) return;
    if (settleRafRef.current) {
      cancelAnimationFrame(settleRafRef.current);
      settleRafRef.current = null;
    }
    dragState.current = {
      startX: e.clientX,
      scrollLeft: track.scrollLeft,
      dragging: true,
      moved: false,
      lastX: e.clientX,
      lastTime: performance.now(),
      velocity: 0,
    };
    track.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const track = trackRef.current;
    if (!track || !dragState.current.dragging) return;
    const delta = e.clientX - dragState.current.startX;
    if (Math.abs(delta) > 4) dragState.current.moved = true;
    track.scrollLeft = dragState.current.scrollLeft - delta;

    // Track instantaneous finger speed (px/ms) so a quick short flick can
    // still advance a card at release, even though it barely moved scrollLeft.
    const now = performance.now();
    const dt = now - dragState.current.lastTime;
    if (dt > 0) {
      dragState.current.velocity = (e.clientX - dragState.current.lastX) / dt;
    }
    dragState.current.lastX = e.clientX;
    dragState.current.lastTime = now;

    scheduleUpdate();
  };

  const endDrag = () => {
    if (!dragState.current.dragging) return;
    dragState.current.dragging = false;
    if (!dragState.current.moved) return;

    const track = trackRef.current;
    let idx = -1;
    if (track) {
      // Project a bit past where the finger actually let go, in the direction
      // it was moving, so a fast short flick still lands on the next/prev
      // card instead of snapping back to the one you started on.
      const first = itemRefs.current[0];
      const second = itemRefs.current[1];
      const spacing = first && second ? second.offsetLeft - first.offsetLeft : track.clientWidth;
      const maxOffset = spacing * 0.9;
      const rawOffset = -dragState.current.velocity * 180;
      const offset = Math.max(-maxOffset, Math.min(maxOffset, rawOffset));
      idx = findNearestIndex(track.scrollLeft + offset);
    }
    if (idx < 0) idx = findNearestIndex();
    if (idx >= 0) centerItem(idx);
  };

  const onItemClick = (index: number) => {
    if (dragState.current.moved) return;
    if (findNearestIndex() === index) {
      activeOriginRef.current = itemRefs.current[index]?.getBoundingClientRect() ?? null;
      setActiveSlide(index);
      return;
    }
    centerItem(index);
  };

  // Zooms the clicked card up from its own position/size until it fills the
  // whole page, instead of the detail view just popping in at full size.
  useEffect(() => {
    if (activeSlide === null) return;
    const root = detailRootRef.current;
    const origin = activeOriginRef.current;
    if (!root) return;

    gsap.set(".ministry-detail-content", { opacity: 0, y: 16 });

    if (origin) {
      gsap.fromTo(
        root,
        {
          position: "fixed",
          top: origin.top,
          left: origin.left,
          width: origin.width,
          height: origin.height,
          borderRadius: 24,
        },
        {
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight,
          borderRadius: 0,
          duration: 0.45,
          ease: "power2.out",
          onComplete: () => {
            gsap.to(".ministry-detail-content", { opacity: 1, y: 0, duration: 0.25, ease: "power2.out" });
          },
        },
      );
    } else {
      gsap.fromTo(root, { opacity: 0 }, { opacity: 1, duration: 0.25 });
      gsap.to(".ministry-detail-content", { opacity: 1, y: 0, duration: 0.25, delay: 0.05 });
    }
  }, [activeSlide]);

  // Zooms the clicked thumbnail up to fill the screen, instead of the
  // lightbox just popping in at full size.
  useEffect(() => {
    if (!lightboxImage) return;
    const img = lightboxImgRef.current;
    const origin = lightboxOriginRef.current;
    if (!img) return;

    gsap.set(".lightbox-overlay-bg", { opacity: 0 });
    gsap.to(".lightbox-overlay-bg", { opacity: 1, duration: 0.35, ease: "power1.out" });

    // Fit the image to its own aspect ratio within the viewport (like
    // object-fit: contain would render it) and animate to that exact box —
    // not a full-viewport box — so the <img> element's clickable area
    // matches the visible photo. Otherwise the element would cover the
    // whole screen (letterboxed via object-fit) and swallow clicks in the
    // letterbox padding that are meant to close the lightbox.
    const fitToViewport = () => {
      const maxW = window.innerWidth * 0.92;
      const maxH = window.innerHeight * 0.92;
      const naturalW = img.naturalWidth || maxW;
      const naturalH = img.naturalHeight || maxH;
      const scale = Math.min(maxW / naturalW, maxH / naturalH, 1) || 1;
      const width = naturalW * scale;
      const height = naturalH * scale;
      return {
        width,
        height,
        top: (window.innerHeight - height) / 2,
        left: (window.innerWidth - width) / 2,
      };
    };

    const runAnimation = () => {
      const target = fitToViewport();
      if (origin) {
        gsap.fromTo(
          img,
          {
            position: "fixed",
            top: origin.top,
            left: origin.left,
            width: origin.width,
            height: origin.height,
            maxWidth: "none",
            maxHeight: "none",
            borderRadius: 16,
            objectFit: "cover",
          },
          {
            top: target.top,
            left: target.left,
            width: target.width,
            height: target.height,
            borderRadius: 0,
            objectFit: "contain",
            duration: 0.5,
            ease: "power3.out",
          },
        );
      } else {
        gsap.set(img, {
          position: "fixed",
          top: target.top,
          left: target.left,
          width: target.width,
          height: target.height,
          maxWidth: "none",
          maxHeight: "none",
          objectFit: "contain",
        });
        gsap.fromTo(img, { scale: 0.85, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.35, ease: "power2.out" });
      }
    };

    if (img.complete && img.naturalWidth > 0) {
      runAnimation();
    } else {
      img.addEventListener("load", runAnimation, { once: true });
      return () => img.removeEventListener("load", runAnimation);
    }
  }, [lightboxImage]);

  const closeLightbox = () => {
    const img = lightboxImgRef.current;
    const origin = lightboxOriginRef.current;
    gsap.to(".lightbox-overlay-bg", { opacity: 0, duration: 0.35, ease: "power1.in" });
    if (img && origin) {
      gsap.to(img, {
        top: origin.top,
        left: origin.left,
        width: origin.width,
        height: origin.height,
        borderRadius: 16,
        objectFit: "cover",
        duration: 0.4,
        ease: "power3.in",
        onComplete: () => setLightboxImage(null),
      });
    } else {
      setLightboxImage(null);
    }
  };

  const closeDetail = () => {
    const root = detailRootRef.current;
    const origin = activeOriginRef.current;
    if (root && origin) {
      gsap.to(".ministry-detail-content", { opacity: 0, y: 16, duration: 0.15, ease: "power1.in" });
      gsap.to(root, {
        top: origin.top,
        left: origin.left,
        width: origin.width,
        height: origin.height,
        borderRadius: 24,
        duration: 0.4,
        ease: "power2.in",
        delay: 0.08,
        onComplete: () => setActiveSlide(null),
      });
    } else {
      setActiveSlide(null);
    }
  };

  // Auto-scrolls the ministry photo strip while letting the visitor take over
  // at any time (drag, touch-scroll, wheel) — a manual interaction pauses the
  // auto-scroll and it quietly resumes once the visitor stops touching it.
  useEffect(() => {
    if (activeSlide === null) return;
    const track = galleryTrackRef.current;
    if (!track) return;
    track.scrollLeft = 0;
    galleryPausedRef.current = false;

    const GALLERY_SCROLL_SPEED = 0.4; // px per frame, ~24px/s

    const step = () => {
      const half = track.scrollWidth / 2;
      if (!galleryPausedRef.current) {
        track.scrollLeft += GALLERY_SCROLL_SPEED;
      }
      if (half > 0) {
        if (track.scrollLeft >= half) track.scrollLeft -= half;
        else if (track.scrollLeft < 0) track.scrollLeft += half;
      }
      galleryRafRef.current = requestAnimationFrame(step);
    };
    galleryRafRef.current = requestAnimationFrame(step);

    return () => {
      if (galleryRafRef.current) cancelAnimationFrame(galleryRafRef.current);
      if (galleryResumeTimeoutRef.current) clearTimeout(galleryResumeTimeoutRef.current);
    };
  }, [activeSlide]);

  const pauseGalleryAutoScroll = () => {
    galleryPausedRef.current = true;
    if (galleryResumeTimeoutRef.current) clearTimeout(galleryResumeTimeoutRef.current);
  };

  const resumeGalleryAutoScrollSoon = () => {
    if (galleryResumeTimeoutRef.current) clearTimeout(galleryResumeTimeoutRef.current);
    galleryResumeTimeoutRef.current = setTimeout(() => {
      galleryPausedRef.current = false;
    }, 1500);
  };

  const onGalleryPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const track = galleryTrackRef.current;
    if (!track) return;
    pauseGalleryAutoScroll();
    galleryDragState.current = {
      dragging: true,
      startX: e.clientX,
      scrollLeft: track.scrollLeft,
      moved: false,
    };
    track.setPointerCapture(e.pointerId);
  };

  const onGalleryPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const track = galleryTrackRef.current;
    if (!track || !galleryDragState.current.dragging) return;
    const delta = e.clientX - galleryDragState.current.startX;
    if (Math.abs(delta) > 4) galleryDragState.current.moved = true;
    track.scrollLeft = galleryDragState.current.scrollLeft - delta;
  };

  const endGalleryDrag = () => {
    if (!galleryDragState.current.dragging) return;
    galleryDragState.current.dragging = false;
    resumeGalleryAutoScrollSoon();
  };

  const onGalleryWheel = () => {
    pauseGalleryAutoScroll();
    resumeGalleryAutoScrollSoon();
  };

  const handleConnectClick = () => {
    setActiveSlide(null);
    window.setTimeout(() => {
      document.getElementById("keep-in-touch")?.scrollIntoView({ behavior: "smooth" });
    }, 350);
  };

  const activeMinistry = activeSlide !== null ? SLIDES[activeSlide] : null;

  return (
    <>
    <section
      ref={rootRef}
      className="flex flex-col overflow-hidden py-10 md:py-14"
    >
      <div className="px-5 md:px-8">
        <p className="ministries-heading text-xs font-semibold tracking-[0.3em] text-accent-cyan md:text-sm">
          WHAT WE DO
        </p>
        <h2 className="ministries-heading mt-3 font-display text-3xl font-bold leading-tight md:text-4xl">
          Our Ministries
        </h2>
      </div>

      <div
        ref={trackRef}
        onScroll={onScroll}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerLeave={endDrag}
        className="ministries-gallery mt-6 flex touch-pan-y cursor-grab items-center gap-4 overflow-x-auto select-none active:cursor-grabbing md:mt-8 md:gap-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        <div aria-hidden className="w-[13%] flex-none sm:w-[14%] md:w-[18%] lg:w-[21%]" />
        {SLIDES.map((slide, i) => (
          <div
            key={`${slide.label}-${i}`}
            ref={(el) => {
              itemRefs.current[i] = el;
            }}
            onClick={() => onItemClick(i)}
            className="relative aspect-[9/16] w-[74%] flex-none cursor-pointer overflow-hidden rounded-2xl border border-ink-panel-border bg-gradient-to-br from-ink-panel to-[#132347] shadow-2xl shadow-black/40 transition-[transform,opacity] duration-100 ease-out sm:w-[72%] md:w-[64%] lg:w-[58%]"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={slide.gallery[0]}
              alt=""
              loading="lazy"
              draggable={false}
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-4 pt-12 text-center">
              <p className="font-display text-lg font-bold text-white drop-shadow-lg md:text-xl">
                {slide.label}
              </p>
            </div>
          </div>
        ))}
        <div aria-hidden className="w-[13%] flex-none sm:w-[14%] md:w-[18%] lg:w-[21%]" />
      </div>

      <div className="px-5 md:px-8">
        <a
          href="https://gkdi.org/"
          target="_blank"
          rel="noopener noreferrer"
          className="ministries-heading mt-6 inline-flex items-center gap-2 text-sm font-semibold text-accent-cyan transition-colors hover:text-white md:mt-8 md:text-base"
        >
          Get to Know Our Church
          <span aria-hidden>→</span>
        </a>
      </div>
    </section>

    {mounted &&
      activeMinistry &&
      createPortal(
        <div ref={detailRootRef} className="fixed z-[200] flex flex-col overflow-hidden bg-ink text-white">
          <div className="absolute inset-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={activeMinistry.gallery[0]}
              alt=""
              draggable={false}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-black/55" />
            <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-ink/10" />
          </div>

          <div className="ministry-detail-content relative flex items-center px-5 pt-5 md:px-8 md:pt-8">
            <button
              type="button"
              onClick={closeDetail}
              aria-label="Back"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-black/40 backdrop-blur-sm transition-colors hover:bg-black/60"
            >
              <FaArrowLeft className="h-4 w-4" />
            </button>
          </div>

          <div className="ministry-detail-content relative flex flex-1 flex-col justify-center px-6 md:px-10">
            <h3 className="font-display text-3xl font-bold leading-tight drop-shadow-lg md:text-5xl">
              {activeMinistry.label}
            </h3>
            {activeMinistry.subtitle && (
              <p className="mt-1 text-sm font-semibold text-accent-cyan md:text-base">
                {activeMinistry.subtitle}
              </p>
            )}
            <p className="mt-4 max-w-md text-sm text-white/80 md:text-base">
              {activeMinistry.description}
            </p>
            <p className="mt-3 text-sm font-semibold text-accent-cyan md:text-base">
              {activeMinistry.tag}
            </p>
            <button
              type="button"
              onClick={handleConnectClick}
              className="mt-6 inline-flex w-fit items-center gap-2 rounded-full bg-accent-cyan px-6 py-3 text-sm font-semibold text-ink transition-colors hover:bg-accent-cyan/85 md:text-base"
            >
              {activeMinistry.ctaLabel ?? "Connect with us"}
              <span aria-hidden>→</span>
            </button>
          </div>

          <div className="ministry-detail-content relative pb-6 pt-4 md:pb-10">
            <div
              ref={galleryTrackRef}
              onWheel={onGalleryWheel}
              onPointerDown={onGalleryPointerDown}
              onPointerMove={onGalleryPointerMove}
              onPointerUp={endGalleryDrag}
              onPointerLeave={endGalleryDrag}
              onMouseEnter={pauseGalleryAutoScroll}
              onMouseLeave={resumeGalleryAutoScrollSoon}
              className="flex touch-pan-x cursor-grab gap-3 overflow-x-auto px-6 select-none active:cursor-grabbing md:gap-4 md:px-10 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {[...activeMinistry.gallery, ...activeMinistry.gallery].map((src, i) => (
                <button
                  type="button"
                  key={`${src}-${i}`}
                  onClick={(e) => {
                    if (galleryDragState.current.moved) return;
                    lightboxOriginRef.current = e.currentTarget.getBoundingClientRect();
                    setLightboxImage(src);
                  }}
                  className="h-24 w-20 flex-none overflow-hidden rounded-xl border border-white/20 shadow-lg shadow-black/40 md:h-32 md:w-28"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt="" draggable={false} className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        </div>,
        document.body,
      )}

    {mounted &&
      lightboxImage &&
      createPortal(
        <div
          className="lightbox-overlay-bg fixed inset-0 z-[300] flex items-center justify-center bg-black/90 p-4"
          onClick={closeLightbox}
        >
          <button
            type="button"
            onClick={closeLightbox}
            aria-label="Close"
            className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20"
          >
            <FaXmark className="h-4 w-4" />
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            ref={lightboxImgRef}
            src={lightboxImage}
            alt=""
            draggable={false}
            className="rounded-lg object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>,
        document.body,
      )}
    </>
  );
}
