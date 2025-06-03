// uniform/frontend/src/components/ApplicationProcessSection.tsx

import { User, Building, Send, BarChart, ArrowRight } from 'lucide-react';

interface ProcessStepProps {
  icon: React.ElementType;
  title: string;
}

const ProcessStep: React.FC<ProcessStepProps> = ({ icon: Icon, title }) => (
  <div className="flex flex-col items-center text-center">
    <div className="p-4 mb-3 rounded-full bg-gray-100 dark:bg-gray-700">
      <Icon className="w-10 h-10 text-gray-700 dark:text-gray-200" />
    </div>
    <span className="text-lg font-medium text-gray-900 dark:text-gray-100">{title}</span>
  </div>
);

const ApplicationProcessSection: React.FC = () => {
  return (
    <section className="section-padding bg-white dark:bg-gray-950 my-8 sm:my-12 md:my-16 lg:my-20">
      <div className="container mx-auto max-w-6xl flex flex-col items-center">
        <div className="flex flex-col md:flex-row items-center justify-center w-full space-x-8 md:space-x-8 my-12 md:my-16 lg:my-20">
          <ProcessStep icon={User} title="Profile" />
          <Arrow className="hidden md:block" />
          <ProcessStep icon={Building} title="Select Uni" />
          <Arrow className="hidden md:block" />
          <ProcessStep icon={Send} title="Apply" />
          <Arrow className="hidden md:block" />
          <ProcessStep icon={BarChart} title="Track" />
        </div>
      </div>
    </section>
  );
};

interface ArrowProps {
  className?: string;
}

const Arrow: React.FC<ArrowProps> = ({ className }) => (
  <div className={`flex items-center justify-center text-gray-400 mx-4 ${className}`}>
    <ArrowRight className="w-8 h-8" />
  </div>
);

export default ApplicationProcessSection;
