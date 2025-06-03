// uniform/frontend/src/App.tsx

// You might still want to keep the useState/useEffect for backend checks if needed
// import { useState, useEffect } from 'react';
// import axios from 'axios';

import './App.css'; // Global CSS, mostly for Tailwind base

// Import your custom components
import NavBar from '@/components/NavBar';
import HeroSection from '@/components/HeroSection';
import FeaturesSection from '@/components/FeaturesSection';
import ApplicationProcessSection from '@/components/ApplicationProcessSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import CallToActionSection from '@/components/CallToActionSection';
import Footer from '@/components/Footer';

function App() {
  // You can keep or remove the backend status checks based on your immediate need
  // For a static landing page, these might be removed from the main App.tsx
  // and placed in a dedicated status page if you have one.
  // const [backendMessage, setBackendMessage] = useState<string>('Connecting to backend...');
  // const [dbStatus, setDbStatus] = useState<string>('Checking database...');
  // const [error, setError] = useState<string | null>(null);

  // useEffect(() => {
  //   // ... (your axios calls from before)
  // }, []);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans dark:bg-gray-950 dark:text-gray-100">
      <NavBar />
      <main>
        <HeroSection />
        <FeaturesSection />
        <ApplicationProcessSection />
        <TestimonialsSection />
        <CallToActionSection />
      </main>
      <Footer />
    </div>
  );
}

export default App;