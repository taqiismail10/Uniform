import { createFileRoute, Navigate } from '@tanstack/react-router'

export const Route = createFileRoute('/student/')({
  component: () => <Navigate to="/student/dashboard" />,
})

export default Route
