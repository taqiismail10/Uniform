import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/help')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
      <h1 className="text-3xl font-bold underline">Help Center</h1>
    </div>
  )
}
