import { FileText, Bell, Users, Shield, Globe, Clock, ChevronLeft, ChevronRight } from 'lucide-react'
import { useEffect, useState, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const features = [
  {
    name: "Unified Application Form",
    description: "Apply to multiple universities with a single form, saving time and effort.",
    icon: FileText,
  },
  {
    name: "Real-Time Tracking",
    description: "Monitor your application status in real-time and stay updated throughout the process.",
    icon: Bell,
  },
  {
    name: "Deadline Reminders",
    description: "Never miss important application deadlines with our smart notification system.",
    icon: Clock,
  },
  {
    name: "Centralized Profile",
    description: "Create one academic profile that can be used for all university applications.",
    icon: Users,
  },
  {
    name: "Secure Platform",
    description: "Your data is protected with industry-standard security measures.",
    icon: Shield,
  },
  {
    name: "Wide Coverage",
    description: "Access universities from across Bangladesh in one centralized platform.",
    icon: Globe,
  },
]

export default function FeatureSection() {
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
  const maxIndex = features.length - visibleCards

  const nextSlide = () => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setCurrentIndex((prevIndex) => (prevIndex >= maxIndex ? 0 : prevIndex + 1))
    setTimeout(() => setIsTransitioning(false), 500) // Match transition duration

    // Reset the auto-slide timer
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
    intervalRef.current = setInterval(nextSlide, 3000)
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
    intervalRef.current = setInterval(nextSlide, 3000)
  }

  // Auto-slide functionality
  useEffect(() => {
    intervalRef.current = setInterval(nextSlide, 3000) // Change slide every 3 seconds

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
      const newMaxIndex = features.length - newVisibleCards
      if (currentIndex > newMaxIndex) {
        setCurrentIndex(0)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [currentIndex])

  // Clone features for infinite scrolling effect
  const clonedFeatures = [...features, ...features.slice(0, visibleCards)]

  return (
    <div id='features' className="py-12 bg-gray-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-semibold text-gray-900 sm:text-4xl">
            Streamline Your University Admission Process
          </h2>
        </div>

        <div className="relative">
          {/* Navigation buttons */}
          <Button
            variant="outline"
            size="icon"
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 rounded-full bg-white/80 backdrop-blur-sm shadow-md hover:bg-white"
            onClick={prevSlide}
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 rounded-full bg-white/80 backdrop-blur-sm shadow-md hover:bg-white"
            onClick={nextSlide}
            aria-label="Next slide"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>

          {/* Carousel container */}
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * (100 / visibleCards)}%)` }}
            >
              {clonedFeatures.map((feature, index) => (
                <div
                  key={`${feature.name}-${index}`}
                  className="flex-shrink-0 w-full sm:w-1/2 lg:w-1/3 px-2"
                >
                  <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                    <CardHeader className="text-center pb-4">
                      <div className="flex justify-center mb-4">
                        <div className="flex items-center justify-center h-12 w-12 rounded-md bg-gray-900 text-white">
                          <feature.icon className="h-6 w-6" aria-hidden="true" />
                        </div>
                      </div>
                      <CardTitle className="text-xl">{feature.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center pt-0">
                      <CardDescription className="text-base">
                        {feature.description}
                      </CardDescription>
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
                    intervalRef.current = setInterval(nextSlide, 3000)
                  }
                }}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}