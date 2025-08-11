import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/contact')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
      <h1 className="text-3xl font-bold underline">Contact Us</h1>
    </div>
  )
}
