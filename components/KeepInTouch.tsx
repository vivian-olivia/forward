"use client";

import { FormEvent, useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

type Status = "idle" | "loading" | "success" | "error";

export default function KeepInTouch() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const rootRef = useRef<HTMLElement>(null);
  const successRef = useRef<HTMLDivElement>(null);

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
      if (status !== "success") return;
      gsap.from(successRef.current, {
        y: 16,
        opacity: 0,
        scale: 0.96,
        duration: 0.6,
        ease: "power3.out",
      });
    },
    { scope: rootRef, dependencies: [status] },
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

      setStatus("success");
      setName("");
      setPhone("");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Terjadi kesalahan.");
    }
  }

  return (
    <section ref={rootRef} id="keep-in-touch" className="px-5 py-14">
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

      {status === "success" ? (
        <div
          ref={successRef}
          className="mt-6 rounded-2xl border border-accent-cyan/40 bg-ink-panel/70 p-5 text-sm text-white/80"
        >
          Terima kasih! Data Anda sudah tersimpan — kami akan mengirim
          pengingat lewat WhatsApp menjelang acara.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <Field
            icon={<UserIcon />}
            label="Nama Lengkap *"
            placeholder="Contoh: John Doe"
            value={name}
            onChange={setName}
            required
          />
          <Field
            icon={<WhatsAppIcon />}
            label="No. WhatsApp *"
            placeholder="Contoh: 0812 3456 7890"
            value={phone}
            onChange={setPhone}
            type="tel"
            required
          />

          {status === "error" && (
            <p className="text-sm text-red-400">{errorMsg}</p>
          )}

          <button
            type="submit"
            disabled={status === "loading"}
            className="touch-field gradient-btn flex w-full items-center justify-center gap-2 rounded-full py-3 text-sm font-semibold text-white shadow-lg shadow-purple-900/30 transition-transform active:scale-95 disabled:opacity-60"
          >
            {status === "loading" ? "Mengirim..." : "SUBMIT"}
            {status !== "loading" && <span aria-hidden>→</span>}
          </button>
        </form>
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

function WhatsAppIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
      <path
        d="M20 12a8 8 0 1 1-3.6-6.7L20 4l-1 3.3A7.9 7.9 0 0 1 20 12Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M9 9.5c0 3 2.5 5.5 5.5 5.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}
