"use client";

import Hero from "@/components/Hero";

import FeaturesSection from "@/components/FeaturesSection";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <main className="bg-black p-1">
      <Navbar />
      <Hero />
      <div id="features" className="flex flex-col gap-4 items-center justify-center mt-10 md:mt-10 lg:mt-10">
        <p className="font-spacegrotesksemibold text-center text-white text-3xl md:text-4xl lg:text-5xl">
          Features of CodeSync
        </p>
        <FeaturesSection />
      </div>
      <Footer />
    </main>
  );
}
