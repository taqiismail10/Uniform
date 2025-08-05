import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/studentLogin')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_auth/studentLogin"!</div>
}
