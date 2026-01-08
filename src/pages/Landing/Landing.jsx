import React from 'react';
// import './Landing.css'; // Removed CSS file

import Navbar from './components/Navbar';
import Hero from './components/Hero';
import IntegrationBar from './components/IntegrationBar';
import FeaturesGrid from './components/FeaturesGrid';
import CTA from './components/CTA';
import Footer from './components/Footer';

function Landing() {
  return (
    <div className="bg-[var(--dark-bg)] -mt-[80px] text-[var(--primary-text-color)] font-[var(--main-font-family)] min-h-screen w-full">
      <Navbar />
      <main>
        <Hero />
        <IntegrationBar />
        <FeaturesGrid />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}

export default Landing;