import Image from "next/image";
import Hero from "@/components/Hero";
import EventDetail from "@/components/EventDetail";
import OurStory from "@/components/OurStory";
import KeepInTouch from "@/components/KeepInTouch";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <main className="mx-auto w-full max-w-lg">
        <Hero />
        <div className="relative">
          <div className="absolute inset-0 -z-20">
            <Image
              src="/other-bg.png"
              alt=""
              fill
              className="object-cover object-top"
            />
            <div className="absolute inset-0 bg-ink/60" />
          </div>

          <div className="border-t border-ink-panel-border/60">
            <EventDetail />
          </div>
          <div className="border-t border-ink-panel-border/60">
            <OurStory />
          </div>
          <div className="border-t border-ink-panel-border/60">
            <KeepInTouch />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
