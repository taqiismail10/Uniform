import { createFileRoute } from '@tanstack/react-router'
import UniversitiesSection from '@/components/student/UniversitiesSection'

export const Route = createFileRoute('/student/institutions/')({
  component: () => <UniversitiesSection />,
})

export default Route

