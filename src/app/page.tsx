import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Calculator from "@/components/Calculator";
import Features from "@/components/Features";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import FloatingWA from "@/components/FloatingWA";
import Preloader from "@/components/Preloader";
import BubbleCanvas from "@/components/BubbleCanvas";
import VisitorTracker from "@/components/VisitorTracker";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-zinc-50 text-zinc-900 dark:bg-black dark:text-zinc-50 overflow-x-hidden">
      {/* Animated preloader entry */}
      <Preloader />
      {/* Invisible visitor tracking */}
      <VisitorTracker />

      {/* Background Grid Accent */}
      <div className="absolute inset-0 z-0 bg-grid-pattern dark:bg-grid-pattern-dark pointer-events-none opacity-65" />
      
      {/* Interactive 3D Bubble Canvas background */}
      <BubbleCanvas />

      {/* Navbar Section */}
      <Navbar />
      
      {/* Content Section */}
      <main className="relative z-10 flex flex-col">
        <Hero />
        <Services />
        <Calculator />
        <Features />
        <Contact />
      </main>
      
      {/* Footer Section */}
      <Footer />
      
      {/* Floating Action Elements */}
      <FloatingWA />
    </div>
  );
}
