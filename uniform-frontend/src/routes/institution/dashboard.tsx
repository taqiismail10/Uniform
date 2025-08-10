import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/institution/dashboard')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
      <h1 className="text-3xl font-bold underline">Institution Dashboard</h1>
    </div>
  )
}
