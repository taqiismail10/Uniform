// uniform/frontend/src/components/HeroSection.tsx

import { Button } from '@/components/ui/button';

const HeroSection: React.FC = () => {
  return (
    <section className="relative flex flex-col md:flex-row items-center justify-center min-h-[70vh] md:min-h-[75vh] section-padding bg-gray-50 dark:bg-gray-950">
      {/* Content Block */}
      <div className="flex-1 max-w-xl text-center md:text-left mb-12 md:mb-0 md:mr-16 lg:mr-24">
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight text-gray-900 dark:text-gray-100 mb-4 md:mb-6">
          Simplify Your University Application Journey
        </h1>
        <p className="text-lg sm:text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 md:mb-10">
          Apply once. Reach all.
        </p>
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center md:justify-start">
          <Button className="btn-primary-custom">
            Start Applying
          </Button>
          <Button variant="outline" className="btn-secondary-custom">
            Explore Features
          </Button>
        </div>
      </div>

      {/* Illustration Placeholder (unchanged) */}
      <div className="flex-1 w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl h-48 sm:h-64 md:h-80 lg:h-96 bg-gray-200 dark:bg-gray-800 rounded-xl border border-gray-300 dark:border-gray-700 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 animate-pulse"></div>
        <div className="relative text-gray-500 dark:text-gray-400 text-center text-sm p-4">
          <svg className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-2 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1l-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
          <p>Illustration Placeholder: Student using laptop</p>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;