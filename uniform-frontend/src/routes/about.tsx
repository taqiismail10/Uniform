import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/about')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
      <h1 className="text-3xl font-bold underline">About Us</h1>
    </div>
  )
}
