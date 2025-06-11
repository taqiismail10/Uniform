import React from 'react';
import './Testimonial.css';

interface TestimonialData {
  id: number;
  name: string;
  role: string;
  testimonial: string;
  avatarUrl?: string;
}

const testimonials: TestimonialData[] = [
  {
    id: 1,
    name: 'Jane Doe',
    role: 'Alumni, Stanford University',
    testimonial:
      "UniForm made my university application process incredibly smooth and stress-free. I could track all my applications in one place!",
    avatarUrl: 'https://media.gettyimages.com/id/1414997119/photo/university-professor-holding-a-tablet-in-front-of-class.jpg?s=612x612&w=0&k=20&c=u9uwGAtyBdBP7p15jIwLzvxna-76UsRoHZn2nd7LlWQ=',
  },
  {
    id: 2,
    name: 'John Smith',
    role: 'Prospective Student',
    testimonial:
      "Finding the right universities and managing deadlines was overwhelming until I found UniForm. The features are a lifesaver.",
    // avatarUrl: '/path/to/avatar2.jpg',
  },
  {
    id: 3,
    name: 'Alice Brown',
    role: 'High School Counselor',
    testimonial:
      "I recommend UniForm to all my students. It simplifies the complex application journey and keeps them organized.",
    avatarUrl: 'https://media.gettyimages.com/id/1455112396/photo/portrait-of-a-mid-adult-teacher-in-university-library.jpg?s=612x612&w=0&k=20&c=kDmanXcPYkyiHDzNsIdsurB1GcUHuosZYAZtYLPLabg=',
  },
];

const Testimonial: React.FC = () => {
  return (
    <section className="testimonial-section">
      <h2 className="testimonial-heading">What Our Users Say</h2>
      <div className="testimonial-grid">
        {testimonials.map((item) => (
          <div key={item.id} className="testimonial-card">
            {item.avatarUrl && (
              <img
                src={item.avatarUrl}
                alt={`${item.name}'s avatar`}
                className="testimonial-avatar"
              />
            )}
            <p className="testimonial-text">"{item.testimonial}"</p>
            <h4 className="testimonial-name">{item.name}</h4>
            <p className="testimonial-role">{item.role}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Testimonial;
