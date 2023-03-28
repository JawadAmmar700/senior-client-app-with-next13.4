import { headers } from "next/headers";
import { getSession } from "@/lib/auth-session";
import Header from "@/components/header";
import Footer from "@/components/landing-page/footer";
import HeroSection from "@/components/landing-page/hero-section";
import InfoTitle from "@/components/landing-page/info-title";
import CallStart from "@/components/landing-page/call-start";

export default async function Home() {
  const session = await getSession(headers().get("cookie") ?? "");

  return (
    <main className="relative w-full gradient">
      <Header />
      <HeroSection />
      <div className="relative -mt-12 lg:-mt-24">
        <img
          src="/svgs/wave-up.svg"
          alt="Picture of the author"
          className="w-full"
        />
      </div>
      <InfoTitle />
      <img
        src="/svgs/wave-down.svg"
        alt="Picture of the author"
        className="w-full"
      />
      <CallStart />
      <Footer />
    </main>
  );
}
