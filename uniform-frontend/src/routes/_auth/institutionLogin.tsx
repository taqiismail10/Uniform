import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/institutionLogin')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
      <h1 className="text-3xl font-bold underline">Institution Login</h1>
    </div>
  )
}
