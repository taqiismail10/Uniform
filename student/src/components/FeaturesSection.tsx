// uniform/frontend/src/components/FeaturesSection.tsx

import { FileText, Clock, Bell } from 'lucide-react';

interface FeatureCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon: Icon, title, description }) => {
  return (
    <div className="card-custom flex flex-col items-center">
      <div className="p-3 sm:p-4 mb-4 sm:mb-5 rounded-full bg-gray-100 dark:bg-gray-700">
        <Icon className="w-8 h-8 sm:w-9 sm:h-9 text-gray-700 dark:text-gray-200" /> {/* Dark gray icon color */}
      </div>
      <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2 text-center dark:text-gray-100">{title}</h3>
      <p className="text-base sm:text-lg text-gray-600 text-center dark:text-gray-300">{description}</p>
    </div>
  );
};

const FeaturesSection: React.FC = () => {
  return (
    <section className="p-2 section-padding bg-gray-50 dark:bg-gray-900 my-12 sm:my-16 md:my-20 lg:my-24">
      <div className="container mx-auto max-w-5xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-10">
        <FeatureCard
          icon={FileText}
          title="Unified Application Form"
          description="One form to apply to multiple universities seamlessly."
        />
        <FeatureCard
          icon={Clock}
          title="Real-Time Tracking"
          description="Monitor your applications status in real-time."
        />
        <FeatureCard
          icon={Bell}
          title="Deadline Reminders"
          description="Never miss important application deadlines."
        />
      </div>
    </section>
  );
};

export default FeaturesSection;