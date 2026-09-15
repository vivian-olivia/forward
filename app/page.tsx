import Image from "next/image";
import Hero from "@/components/Hero";
import EventDetail from "@/components/EventDetail";
import OurMinistries from "@/components/OurMinistries";
import UpcomingEvents from "@/components/UpcomingEvents";
import KeepInTouch from "@/components/KeepInTouch";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <main className="mx-auto w-full max-w-lg md:max-w-2xl lg:max-w-4xl">
        <Hero />
        <div className="relative isolate">
          <div className="absolute inset-0 -z-20">
            <Image
              src="/other-bg.png"
              alt=""
              fill
              sizes="100vw"
              className="object-cover object-top"
            />
            <div className="absolute inset-0 bg-ink/60" />
          </div>

          <div>
            <EventDetail />
          </div>
          <div>
            <OurMinistries />
          </div>
          <div>
            <UpcomingEvents />
          </div>
          <div>
            <KeepInTouch />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
