"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { FaWhatsapp } from "react-icons/fa";
import { gsap, useGSAP } from "@/lib/gsap";

type Status = "idle" | "loading" | "success" | "error";

const AGE_GROUPS = [
  { value: "teenagers", label: "Remaja" },
  { value: "uni_students", label: "Mahasiswa" },
  { value: "young_professional", label: "Profesional Muda" },
  { value: "married", label: "Menikah" },
  { value: "golden_age", label: "Golden Age (65+)" },
];

export default function KeepInTouch() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [ageGroup, setAgeGroup] = useState("");
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
        body: JSON.stringify({ name, phone, ageGroup }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? "Terjadi kesalahan, silakan coba lagi.");
      }

      setStatus("idle");
      setName("");
      setPhone("");
      setAgeGroup("");
      setShowToast(true);
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Terjadi kesalahan.");
    }
  }

  return (
    <section ref={rootRef} id="keep-in-touch" className="px-5 py-10 md:px-8 md:py-14">
      <p className="touch-heading text-xs font-semibold tracking-[0.3em] text-accent-cyan md:text-sm">
        STAY CONNECTED
      </p>
      <h2 className="touch-heading mt-3 font-display text-3xl font-bold md:text-4xl">
        Keep in Touch
      </h2>
      <p className="touch-heading mt-3 text-sm leading-relaxed text-white/70 md:text-base">
        Mari tetap terhubung! Isi data di bawah ini agar kami bisa
        menghubungi Anda untuk informasi terbaru seputar acara dan pelayanan
        GKDI.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 md:mt-8 md:max-w-md" suppressHydrationWarning>
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
          <SelectField
            icon={<UsersIcon />}
            label="Kategori Usia*"
            value={ageGroup}
            onChange={setAgeGroup}
            options={AGE_GROUPS}
            placeholder="Pilih kategori Anda"
            required
          />

          {status === "error" && (
            <p className="text-sm text-red-400">{errorMsg}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={status === "loading"}
          className="touch-field gradient-btn relative z-0 my-4 flex w-full items-center justify-center gap-2 rounded-full py-3 text-sm font-semibold text-white shadow-lg shadow-purple-900/30 transition-transform active:scale-95 disabled:opacity-60"
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
        suppressHydrationWarning
      />
    </label>
  );
}

function SelectField({
  icon,
  label,
  value,
  onChange,
  options,
  placeholder,
  required,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  placeholder: string;
  required?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [menuRect, setMenuRect] = useState<{ top: number; left: number; width: number } | null>(
    null,
  );
  const wrapperRef = useRef<HTMLDivElement>(null);
  const selected = options.find((opt) => opt.value === value);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!open) return;

    function updateRect() {
      const rect = wrapperRef.current?.getBoundingClientRect();
      if (!rect) return;
      setMenuRect({ top: rect.bottom + 12, left: rect.left, width: rect.width });
    }

    updateRect();
    window.addEventListener("resize", updateRect);
    window.addEventListener("scroll", updateRect, true);
    return () => {
      window.removeEventListener("resize", updateRect);
      window.removeEventListener("scroll", updateRect, true);
    };
  }, [open]);

  return (
    <div
      ref={wrapperRef}
      className="touch-field relative rounded-2xl border border-ink-panel-border bg-ink-panel/70 px-4 py-3"
    >
      <span className="flex items-center gap-2 text-sm font-medium text-white">
        <span className="text-accent-cyan">{icon}</span>
        {label}
      </span>

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="mt-1.5 flex w-full items-center justify-between text-sm focus:outline-none"
      >
        <span className={selected ? "text-white" : "text-white/30"}>
          {selected ? selected.label : placeholder}
        </span>
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          className={`text-white/50 transition-transform ${open ? "rotate-180" : ""}`}
        >
          <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {required && (
        <input
          tabIndex={-1}
          aria-hidden
          value={value}
          required
          onChange={() => {}}
          className="pointer-events-none absolute h-0 w-0 opacity-0"
          suppressHydrationWarning
        />
      )}

      {mounted && open && menuRect &&
        createPortal(
          <ul
            role="listbox"
            style={{ top: menuRect.top, left: menuRect.left, width: menuRect.width }}
            className="fixed z-[100] overflow-hidden rounded-2xl border border-ink-panel-border bg-ink-panel shadow-xl shadow-black/40"
          >
            {options.map((opt) => (
              <li key={opt.value}>
                <button
                  type="button"
                  role="option"
                  aria-selected={opt.value === value}
                  onClick={() => {
                    onChange(opt.value);
                    setOpen(false);
                  }}
                  className={`block w-full px-4 py-2.5 text-left text-sm transition-colors hover:bg-accent-cyan/10 ${
                    opt.value === value ? "text-accent-cyan" : "text-white"
                  }`}
                >
                  {opt.label}
                </button>
              </li>
            ))}
          </ul>,
          document.body,
        )}
    </div>
  );
}

function UsersIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
      <circle cx="9" cy="8" r="3" stroke="currentColor" strokeWidth="1.6" />
      <path d="M2.5 19.5a6.5 6.5 0 0 1 13 0" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M15.5 6a3 3 0 1 1 0 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M17.5 12.5a5.5 5.5 0 0 1 4 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
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
