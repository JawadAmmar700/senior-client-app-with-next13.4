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
      <div className="relative -mt-12 lg:-mt-24">
        <img
          src="/svgs/wave-up.svg"
          alt="Picture of the author"
          className="w-full h-auto"
        />
      </div>
      <InfoTitle />
      <CallStart />
      <div className="relative -mt-12 lg:-mt-24 " id="recordings">
        <img
          src="/svgs/wave-up.svg"
          alt="Picture of the author"
          className="w-full h-auto"
        />
      </div>
    
        {/* @ts-expect-error Server Component */}
        <Recordings />
    

      <Footer />
    </main>
  );
}
