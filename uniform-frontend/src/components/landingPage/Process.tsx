// components/Process.tsx
import { User, FileText, Building, CheckCircle, ArrowBigRight, ArrowBigDown } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const processSteps = [
  {
    id: 1,
    title: "Create Your Profile",
    description: "Sign up and create your academic profile with all necessary information.",
    icon: User,
  },
  {
    id: 2,
    title: "Fill Application Form",
    description: "Complete the unified application form that can be used for multiple universities.",
    icon: FileText,
  },
  {
    id: 3,
    title: "Select Universities",
    description: "Choose the universities and units you want to apply to from our comprehensive list.",
    icon: Building,
  },
  {
    id: 4,
    title: "Submit & Track",
    description: "Submit your applications and track their status in real-time through our dashboard.",
    icon: CheckCircle,
  },
]

export default function Process() {
  return (
    <div id='process' className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-semibold text-gray-900 sm:text-4xl">
            Streamline Your University Admission Process
          </h2>
        </div>

        {/* Desktop View */}
        <div className="hidden md:block">
          <div className="flex justify-center items-center p-2">
            {processSteps.map((step, index) => (
              <div key={step.id} className="flex gap-2 md:gap-1 lg:gap-4 xl:gap-6 items-center">
                {/* Card with responsive width */}
                <Card className="w-32 md:w-40 md:h-94 lg:w-52 lg:h-72 xl:w-64 border border-gray-200 flex flex-col">
                  <CardHeader>
                    <div className="flex justify-center mb-2">
                      <div className="flex items-center justify-center h-12 w-12 rounded-full bg-gray-100">
                        <step.icon className="h-6 w-6 text-gray-900" />
                      </div>
                    </div>
                    <div className="text-center">
                      <CardTitle className="text-lg text-gray-900">{step.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0 flex-1 flex items-center">
                    <p className="text-gray-600 text-center">{step.description}</p>
                  </CardContent>
                </Card>

                {/* Arrow between cards (except after the last card) */}
                {index < processSteps.length - 1 && (
                  <div className="mx-0">
                    <ArrowBigRight className="h-6 w-6 mr-0 md:mr-1 lg:mr-4 xl:mr-6 text-gray-400" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Mobile View */}
        <div className="md:hidden">
          <div className="flex flex-col items-center space-y-6">
            {processSteps.map((step, index) => (
              <div key={step.id} className="flex flex-col gap-4 items-center w-full max-w-xs">
                <Card className="w-full border border-gray-200 flex flex-col">
                  <CardHeader className="pb-4">
                    <div className="flex justify-center mb-2">
                      <div className="flex items-center justify-center h-12 w-12 rounded-full bg-gray-100">
                        <step.icon className="h-6 w-6 text-gray-900" />
                      </div>
                    </div>
                    <div className="text-center">
                      <CardTitle className="text-lg text-gray-900">{step.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0 flex-1 flex items-center">
                    <p className="text-gray-600 text-center">{step.description}</p>
                  </CardContent>
                </Card>

                {/* Arrow between cards (except after the last card) */}
                {index < processSteps.length - 1 && (
                  <div className="my-0">
                    <ArrowBigDown className="h-6 w-6 text-gray-400" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}