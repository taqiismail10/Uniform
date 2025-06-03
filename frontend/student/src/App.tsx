// uniform/frontend/src/App.tsx
import './App.css'; // Global CSS, mostly for Tailwind base
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './LoginPage';

// Import your custom components
import NavBar from '@/components/NavBar';
import HeroSection from '@/components/HeroSection';
import FeaturesSection from '@/components/FeaturesSection';
import ApplicationProcessSection from '@/components/ApplicationProcessSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import CallToActionSection from '@/components/CallToActionSection';
import Footer from '@/components/Footer';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={
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
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;