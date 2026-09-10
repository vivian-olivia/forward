import { EVENT_DATE_LABEL, EVENT_LOCATION, EVENT_TIME_LABEL } from "./event";

// Each milestone fires once per registrant, `daysBefore` days before the
// event date. Edit the `message` copy freely — church staff can update
// wording here without touching any other logic.
export const REMINDER_MILESTONES = [
  {
    key: "h-7",
    daysBefore: 7,
    message: (name: string) =>
      `Halo ${name}! 🙏 Jangan lupa, GKDI Tangerang 31st Anniversary "Forward" akan berlangsung ${EVENT_DATE_LABEL} di ${EVENT_LOCATION}. Sampai jumpa minggu depan!`,
  },
  {
    key: "h-1",
    daysBefore: 1,
    message: (name: string) =>
      `Halo ${name}! Besok acaranya! 🎉 GKDI Tangerang 31st Anniversary "Forward", ${EVENT_DATE_LABEL} pukul ${EVENT_TIME_LABEL} di ${EVENT_LOCATION}. Sampai jumpa besok!`,
  },
  {
    key: "h-0",
    daysBefore: 0,
    message: (name: string) =>
      `Selamat pagi ${name}! Hari ini acaranya 🎊 Lokasi: ${EVENT_LOCATION}, mulai pukul ${EVENT_TIME_LABEL}. Ditunggu kehadirannya!`,
  },
] as const;

export type ReminderMilestoneKey = (typeof REMINDER_MILESTONES)[number]["key"];

// Immediate thank-you sent right after form submission.
export const buildThankYouMessage = (name: string) =>
  `Halo ${name}! 🙏 Terima kasih sudah mendaftar untuk GKDI Tangerang 31st Anniversary "Forward". Kami akan mengirimkan pengingat lewat WhatsApp menjelang harinya. Sampai jumpa!`;

// Sent ~1 minute after signup to preview the h-5 reminder copy.
export const buildH5TestMessage = (name: string) =>
  `Halo ${name}! 🙏 5 hari lagi menuju GKDI Tangerang 31st Anniversary "Forward", ${EVENT_DATE_LABEL} di ${EVENT_LOCATION}. Sampai jumpa!`;
