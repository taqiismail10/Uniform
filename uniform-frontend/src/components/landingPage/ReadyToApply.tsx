// components/ReadyToApply.tsx
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Link } from '@tanstack/react-router'

export default function ReadyToApply() {

  return (
    <div className="py-16 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center text-center">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            Ready to Apply?
          </h2>
          <p className="mt-4 max-w-2xl text-xl text-gray-300 mx-auto">
            Take the first step towards your university admission journey with UniForm.
          </p>
          <Button
            className="mt-10 w-[30%] flex items-center justify-center px-4 py-6 border border-transparent text-base font-medium rounded-md shadow-sm text-gray-900 bg-white hover:bg-gray-300"
          >
            <Link to='/registration'>
              Create Profile
            </Link>
            <ArrowRight className="ml-2 -mr-1 h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}