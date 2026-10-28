import Navbar from "../components/landing/Navbar";
import Hero from "../components/landing/Hero";
import Features from "../components/landing/Features";
import HowItWorks from "../components/landing/HowItWorks";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#FFF7F1] text-[#423744]">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
      </main>
      <footer className="border-t border-[#E8DDE7] px-6 py-7 text-center text-sm text-[#5F5263]">
        © {new Date().getFullYear()} CareerPilot · Your job search, organized.
      </footer>
    </div>
  );
}
