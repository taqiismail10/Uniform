import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/cookies')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/cookies"!</div>
}
