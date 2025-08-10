// components/Testimonial.tsx
import { useEffect, useState, useRef } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react'
import { Button } from '@/components/ui/button'

const testimonials = [
  {
    id: 1,
    name: "Sarah Rahman",
    role: "Student at Dhaka University",
    content: "UniForm made applying to multiple universities so much easier. I saved countless hours by filling out just one form instead of dozens. The real-time tracking feature helped me stay updated on all my applications.",
    avatar: "SR",
  },
  {
    id: 2,
    name: "Ahmed Khan",
    role: "Student at BUET",
    content: "The deadline reminders were a lifesaver! I never missed an important date and could track all my applications in one place. UniForm truly simplified the entire admission process for me.",
    avatar: "AK",
  },
  {
    id: 3,
    name: "Nusrat Jahan",
    role: "Student at Rajshahi University",
    content: "I was able to apply to universities I never would have considered before. UniForm opened up so many opportunities for me. The centralized profile system is brilliant!",
    avatar: "NJ",
  },
  {
    id: 4,
    name: "Rifat Hossain",
    role: "Student at Chittagong University",
    content: "The application process used to be so stressful, but UniForm made it seamless. I could focus on my studies instead of worrying about paperwork and deadlines.",
    avatar: "RH",
  },
  {
    id: 5,
    name: "Fatema Akter",
    role: "Student at Jahangirnagar University",
    content: "I love how UniForm provides all the information I need in one place. From university details to application status, everything is just a click away. Highly recommended!",
    avatar: "FA",
  },
  {
    id: 6,
    name: "Tanvir Ahmed",
    role: "Student at Khulna University",
    content: "The user interface is so intuitive and clean. I had no trouble navigating through the application process. UniForm is definitely the future of university admissions.",
    avatar: "TA",
  },
]

export default function Testimonial() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Calculate how many cards are visible at once based on screen size
  const getVisibleCards = () => {
    if (typeof window === 'undefined') return 3 // Default value for SSR
    if (window.innerWidth >= 1024) return 3 // lg breakpoint
    if (window.innerWidth >= 640) return 2 // sm breakpoint
    return 1 // mobile
  }

  const visibleCards = getVisibleCards()
  const maxIndex = testimonials.length - visibleCards

  const nextSlide = () => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setCurrentIndex((prevIndex) => (prevIndex >= maxIndex ? 0 : prevIndex + 1))
    setTimeout(() => setIsTransitioning(false), 500) // Match transition duration

    // Reset the auto-slide timer
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
    intervalRef.current = setInterval(nextSlide, 4000)
  }

  const prevSlide = () => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setCurrentIndex((prevIndex) => (prevIndex <= 0 ? maxIndex : prevIndex - 1))
    setTimeout(() => setIsTransitioning(false), 500) // Match transition duration

    // Reset the auto-slide timer
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
    intervalRef.current = setInterval(nextSlide, 4000)
  }

  // Auto-slide functionality
  useEffect(() => {
    intervalRef.current = setInterval(nextSlide, 4000) // Change slide every 4 seconds

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      // Reset current index if it's out of bounds after resize
      const newVisibleCards = getVisibleCards()
      const newMaxIndex = testimonials.length - newVisibleCards
      if (currentIndex > newMaxIndex) {
        setCurrentIndex(0)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [currentIndex])

  // Clone testimonials for infinite scrolling effect
  const clonedTestimonials = [...testimonials, ...testimonials.slice(0, visibleCards)]

  return (
    <div id='testimonial' className="py-16 bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-semibold text-gray-900 sm:text-4xl">
            What Students Say
          </h2>
        </div>

        <div className="relative">
          {/* Navigation buttons */}
          <Button
            variant="outline"
            size="icon"
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 rounded-full bg-white/80 backdrop-blur-sm shadow-md hover:bg-white"
            onClick={prevSlide}
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 rounded-full bg-white/80 backdrop-blur-sm shadow-md hover:bg-white"
            onClick={nextSlide}
            aria-label="Next testimonial"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>

          {/* Carousel container */}
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * (100 / visibleCards)}%)` }}
            >
              {clonedTestimonials.map((testimonial, index) => (
                <div
                  key={`${testimonial.id}-${index}`}
                  className="flex-shrink-0 w-full sm:w-1/2 lg:w-1/3 px-2"
                >
                  <Card className="h-full bg-white shadow-sm hover:shadow-md transition-shadow duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-start mb-4">
                        <Quote className="h-8 w-8 text-gray-400 flex-shrink-0 mt-1" />
                        <p className="ml-3 text-gray-600 italic">
                          {testimonial.content}
                        </p>
                      </div>

                      <div className="flex items-center mt-6">
                        <div className="h-12 w-12 rounded-full bg-gray-300 flex items-center justify-center">
                          <span className="font-medium text-gray-700">{testimonial.avatar}</span>
                        </div>
                        <div className="ml-4">
                          <h4 className="text-lg font-medium text-gray-900">{testimonial.name}</h4>
                          <p className="text-sm text-gray-500">{testimonial.role}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>

          {/* Indicators */}
          <div className="flex justify-center mt-6 space-x-2">
            {Array.from({ length: maxIndex + 1 }).map((_, index) => (
              <button
                key={index}
                className={`h-2 w-2 rounded-full transition-colors ${index === currentIndex ? 'bg-gray-900' : 'bg-gray-300'
                  }`}
                onClick={() => {
                  if (!isTransitioning) {
                    setIsTransitioning(true)
                    setCurrentIndex(index)
                    setTimeout(() => setIsTransitioning(false), 500)

                    // Reset the auto-slide timer
                    if (intervalRef.current) {
                      clearInterval(intervalRef.current)
                    }
                    intervalRef.current = setInterval(nextSlide, 4000)
                  }
                }}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}