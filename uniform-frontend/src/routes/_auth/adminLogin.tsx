import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/adminLogin')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
      <h1 className="text-3xl font-bold underline">Admin Login</h1>
    </div>
  )
}
