// uniform/frontend/src/components/TestimonialsSection.tsx

interface TestimonialCardProps {
  quote: string;
  author: string;
  details: string; // e.g., "University, Year"
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ quote, author, details }) => {
  return (
    // Replaced multiple Tailwind classes with the single 'card-custom' class
    // Retained specific layout classes: 'flex flex-col items-center text-center'
    <div className="card-custom flex flex-col items-center text-center">
      <p className="text-base sm:text-lg italic text-gray-700 mb-4 dark:text-gray-300">"{quote}"</p>
      <p className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100">{author}</p>
      <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">{details}</p>
    </div>
  );
};

const TestimonialsSection: React.FC = () => {
  return (
    // Background color set to a very light gray.
    // Consider adding a 'section-padding' class if you created one in common.css for consistency.
    <section className="py-16 md:py-20 px-6 md:px-8 bg-gray-100 dark:bg-gray-900">
      <div className="container mx-auto max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 lg:gap-12">
        <TestimonialCard
          quote="UniForm made my application process so much easier. I saved countless hours!"
          author="Sarah Johnson"
          details="Harvard University, 2025"
        />
        <TestimonialCard
          quote="The tracking feature helped me stay on top of all my applications."
          author="Michael Chen"
          details="Stanford University, 2025"
        />
      </div>
    </section>
  );
};

export default TestimonialsSection;