import type { Metadata } from "next";
import { Archivo, Poppins } from "next/font/google";
import "./globals.css";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Forward — GKDI Tangerang 31st Anniversary",
  description:
    "Join GKDI Tangerang's 31st Anniversary — Forward: Same Purpose, Greater Impact. Senin, 4 Oktober 2026 di Serpong Convention Center.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="id"
      className={`${archivo.variable} ${poppins.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-ink text-white">
        {children}
      </body>
    </html>
  );
}
