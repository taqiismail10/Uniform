// uniform/frontend/src/components/CallToActionSection.tsx

import { Button } from '@/components/ui/button';
import { CheckCircle, Shield, Headset } from 'lucide-react'; // Icons for stats

const CallToActionSection: React.FC = () => {
  return (
    <section className="bg-gray-900 text-white dark:bg-gray-950">
      {/* Stats Bar above CTA */}
      <div className="py-8 px-6 md:px-8 bg-white border-t border-gray-100 dark:bg-gray-800 dark:border-gray-700">
        <div className="container mx-auto max-w-4xl flex flex-col md:flex-row justify-around items-center space-y-6 md:space-y-0 text-gray-700 dark:text-gray-300">
          <div className="flex items-center space-x-2 text-base sm:text-lg font-medium">
            <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600 dark:text-gray-400" /> {/* Neutral icon color */}
            <span>Trusted by 1000+ Universities</span>
          </div>
          <div className="flex items-center space-x-2 text-base sm:text-lg font-medium">
            <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600 dark:text-gray-400" />
            <span>99.9% Application Success Rate</span>
          </div>
          <div className="flex items-center space-x-2 text-base sm:text-lg font-medium">
            <Headset className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600 dark:text-gray-400" />
            <span>24/7 Support Available</span>
          </div>
        </div>
      </div>

      {/* Main CTA Section */}
      <div className="py-16 md:py-20 px-6 md:px-8 bg-gray-900 text-white dark:bg-gray-950"> {/* Dark background */}
        <div className="container mx-auto max-w-2xl text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-6 md:mb-8 leading-tight">
            Ready to Start Your Journey?
          </h2>
          <Button className="btn-secondary-custom mb-4 md:mb-6">
            Create My Profile
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CallToActionSection;