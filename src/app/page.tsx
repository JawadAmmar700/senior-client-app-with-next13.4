import Header from "@/components/landing-page/header";
import Footer from "@/components/landing-page/footer";
import HeroSection from "@/components/landing-page/hero-section";
import InfoTitle from "@/components/landing-page/info-title";
import CallStart from "@/components/landing-page/call-start";
import Recordings from "@/components/landing-page/Recordings";

export default async function Home() {
  return (
    <main className="relative w-full gradient">
      <Header />
      <HeroSection />
      <InfoTitle />
      <CallStart />
      {/* @ts-expect-error Server Component */}
      <Recordings />
      <Footer />
    </main>
  );
}
