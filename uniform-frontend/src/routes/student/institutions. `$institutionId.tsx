import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/student/institutions/ `$institutionId')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/student/institutions/ `$institutionId"!</div>
}

