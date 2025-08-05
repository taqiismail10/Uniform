import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/registration')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_auth/registration"!</div>
}
