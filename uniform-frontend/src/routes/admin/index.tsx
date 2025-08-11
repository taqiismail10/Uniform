import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
      <h1 className="text-3xl font-bold underline">Admin Home Page</h1>
    </div>
  )
}