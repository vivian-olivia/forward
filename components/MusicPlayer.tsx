"use client";

import { useEffect, useRef, useState } from "react";

const VIDEO_ID = "EjfzKHoEkso";
const YT_SCRIPT_ID = "youtube-iframe-api";

declare global {
  interface Window {
    onYouTubeIframeAPIReady?: () => void;
    YT?: any;
  }
}

export default function MusicPlayer() {
  const playerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const wantsPlayRef = useRef(false);
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    let cancelled = false;

    function createPlayer() {
      if (cancelled || !containerRef.current || playerRef.current) return;
      // YT.Player replaces its target element with an iframe. Give it a plain
      // node React never rendered, so React's own container div (and its
      // sibling bookkeeping elsewhere in the tree) is never invalidated.
      const mount = document.createElement("div");
      containerRef.current.appendChild(mount);
      playerRef.current = new window.YT!.Player(mount, {
        width: "1",
        height: "1",
        videoId: VIDEO_ID,
        playerVars: {
          autoplay: 1,
          mute: 1,
          loop: 1,
          playlist: VIDEO_ID,
          controls: 0,
          playsinline: 1,
          origin: window.location.origin,
        },
        events: {
          onReady: (e: any) => {
            e.target.setVolume(12);
            setReady(true);
            // Browsers only allow autoplay when muted, so start muted and
            // unmute as soon as the visitor does anything (see the gesture
            // listeners below) — unmuting already-playing media doesn't
            // require a fresh user gesture the way starting audible
            // playback does.
            if (wantsPlayRef.current) {
              e.target.unMute();
            }
            e.target.playVideo();
          },
          onStateChange: (e: any) => {
            setPlaying(e.data === window.YT!.PlayerState.PLAYING);
          },
          onError: (e: any) => {
            console.error("YouTube player error", e.data);
          },
        },
      });
    }

    if (window.YT && window.YT.Player) {
      createPlayer();
    } else if (!document.getElementById(YT_SCRIPT_ID)) {
      const tag = document.createElement("script");
      tag.id = YT_SCRIPT_ID;
      tag.src = "https://www.youtube.com/iframe_api";
      document.head.appendChild(tag);
      window.onYouTubeIframeAPIReady = createPlayer;
    } else {
      const prev = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        prev?.();
        createPlayer();
      };
    }

    // scroll/wheel are not "activation-triggering" input events per the HTML
    // spec, so browsers never count them toward the autoplay-with-sound
    // gesture requirement — only real activation events do.
    const events = ["pointerdown", "keydown", "touchstart"] as const;
    const startOnGesture = () => {
      wantsPlayRef.current = true;
      if (typeof playerRef.current?.unMute === "function") {
        playerRef.current.unMute();
      }
    };
    events.forEach((event) =>
      window.addEventListener(event, startOnGesture, { once: true, passive: true }),
    );

    return () => {
      cancelled = true;
      events.forEach((event) => window.removeEventListener(event, startOnGesture));
    };
  }, []);

  const toggle = () => {
    wantsPlayRef.current = true;
    const player = playerRef.current;
    if (!player) return;

    if (!playing) {
      player.playVideo();
    } else {
      player.pauseVideo();
    }
  };

  return (
    <>
      <div
        ref={containerRef}
        aria-hidden
        className="pointer-events-none fixed bottom-0 right-0 h-px w-px overflow-hidden opacity-0"
      />
      <button
        type="button"
        onClick={toggle}
        disabled={!ready}
        aria-label={playing ? "Mute music" : "Play music"}
        aria-pressed={playing}
        className="fixed bottom-5 right-5 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white shadow-lg backdrop-blur-md ring-1 ring-white/20 transition hover:bg-white/20 disabled:cursor-wait disabled:opacity-50"
      >
        {playing ? (
          <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
            <rect x="6" y="5" width="4" height="14" rx="1" fill="currentColor" />
            <rect x="14" y="5" width="4" height="14" rx="1" fill="currentColor" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
            <path d="M8 5v14l11-7L8 5z" fill="currentColor" />
          </svg>
        )}
        {playing && (
          <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-white/10" />
        )}
      </button>
    </>
  );
}
