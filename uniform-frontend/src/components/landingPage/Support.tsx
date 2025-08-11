// components/SupportFeatures.tsx
import { Clock, CheckCircle, HelpCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const supportFeatures = [
  {
    id: 1,
    title: "24/7 Availability",
    description: "Our support team is available round the clock to assist you with any issues.",
    icon: Clock
  },
  {
    id: 2,
    title: "Quick Response",
    description: "We pride ourselves on responding to all queries within 24 hours.",
    icon: CheckCircle
  },
  {
    id: 3,
    title: "Expert Assistance",
    description: "Our support team consists of experts familiar with university admission processes.",
    icon: HelpCircle
  }
]

export default function Support() {
  return (
    <div id='support' className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-semibold text-gray-900 sm:text-4xl">
            Why Choose Our Support?
          </h2>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
            Our support team is dedicated to making your university application process as smooth as possible.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {supportFeatures.map((feature) => (
            <Card key={feature.id} className="border border-gray-200 hover:shadow-md transition-shadow duration-300 h-full">
              <CardHeader className="text-center pb-4">
                <div className="flex justify-center mb-4">
                  <div className="flex items-center justify-center h-16 w-16 rounded-full bg-gray-100">
                    <feature.icon className="h-8 w-8 text-gray-900" />
                  </div>
                </div>
                <CardTitle className="text-xl text-gray-900">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent className="pt-0 text-center flex-1 flex items-center">
                <p className="text-gray-600">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}