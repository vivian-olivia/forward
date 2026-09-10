"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { FaWhatsapp } from "react-icons/fa";
import { gsap, useGSAP } from "@/lib/gsap";

type Status = "idle" | "loading" | "success" | "error";

export default function KeepInTouch() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [showToast, setShowToast] = useState(false);
  const rootRef = useRef<HTMLElement>(null);
  const toastRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.from(".touch-heading", {
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

      gsap.from(".touch-field", {
        y: 20,
        opacity: 0,
        duration: 0.55,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: {
          trigger: rootRef.current,
          toggleActions: "play reverse play reverse",
          start: "top 65%",
        },
      });
    },
    { scope: rootRef },
  );

  useGSAP(
    () => {
      if (!showToast || !toastRef.current) return;
      gsap.fromTo(
        toastRef.current,
        { y: 16, opacity: 0, scale: 0.96 },
        { y: 0, opacity: 1, scale: 1, duration: 0.45, ease: "power3.out" },
      );
    },
    { scope: rootRef, dependencies: [showToast] },
  );

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? "Terjadi kesalahan, silakan coba lagi.");
      }

      setStatus("idle");
      setName("");
      setPhone("");
      setShowToast(true);
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Terjadi kesalahan.");
    }
  }

  return (
    <section ref={rootRef} id="keep-in-touch" className="px-5 py-10">
      <p className="touch-heading text-xs font-semibold tracking-[0.3em] text-accent-cyan">
        GET IN TOUCH
      </p>
      <h2 className="touch-heading mt-3 font-display text-3xl font-bold">
        Keep in Touch
      </h2>
      <p className="touch-heading mt-3 text-sm leading-relaxed text-white/70">
        Mari tetap terhubung! Isi data di bawah ini agar kami bisa
        menghubungi Anda untuk informasi terbaru seputar acara dan pelayanan
        GKDI.
      </p>

      <form onSubmit={handleSubmit} className="mt-6">
        <div className="space-y-4">
          <Field
            icon={<UserIcon />}
            label="Nama Lengkap*"
            placeholder="Contoh: John Doe"
            value={name}
            onChange={setName}
            required
          />
          <Field
            icon={<FaWhatsapp size={15} />}
            label="No. WhatsApp*"
            placeholder="Contoh: 081234567890"
            value={phone}
            onChange={setPhone}
            type="tel"
            required
          />

          {status === "error" && (
            <p className="text-sm text-red-400">{errorMsg}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={status === "loading"}
          className="touch-field gradient-btn my-4 flex w-full items-center justify-center gap-2 rounded-full py-3 text-sm font-semibold text-white shadow-lg shadow-purple-900/30 transition-transform active:scale-95 disabled:opacity-60"
        >
          {status === "loading" ? "Mengirim..." : "SUBMIT"}
          {status !== "loading" && <span aria-hidden>→</span>}
        </button>
      </form>

      {showToast && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-5 backdrop-blur-sm"
          role="status"
          aria-live="polite"
        >
          <div
            ref={toastRef}
            className="relative w-full max-w-md rounded-3xl border border-accent-cyan/40 bg-ink-panel/95 p-8 text-center shadow-2xl shadow-black/50"
          >
            <button
              type="button"
              onClick={() => setShowToast(false)}
              aria-label="Tutup notifikasi"
              className="absolute right-4 top-4 text-white/50 transition-colors hover:text-white"
            >
              ✕
            </button>
            <span
              className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-accent-cyan/15 text-2xl text-accent-cyan"
              aria-hidden
            >
              ✓
            </span>
            <p className="mt-5 text-base leading-relaxed text-white/80">
              Terima kasih! Data Anda sudah tersimpan — kami akan mengirim
              pengingat lewat WhatsApp menjelang acara.
            </p>
            <button
              type="button"
              onClick={() => setShowToast(false)}
              className="gradient-btn mt-6 w-full rounded-full py-3 text-sm font-semibold text-white shadow-lg shadow-purple-900/30 transition-transform active:scale-95"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

function Field({
  icon,
  label,
  placeholder,
  value,
  onChange,
  type = "text",
  required,
}: {
  icon: React.ReactNode;
  label: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="touch-field block rounded-2xl border border-ink-panel-border bg-ink-panel/70 px-4 py-3">
      <span className="flex items-center gap-2 text-sm font-medium text-white">
        <span className="text-accent-cyan">{icon}</span>
        {label}
      </span>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-1.5 w-full bg-transparent text-sm text-white placeholder:text-white/30 focus:outline-none"
      />
    </label>
  );
}

function UserIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M4.5 20a7.5 7.5 0 0 1 15 0" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
