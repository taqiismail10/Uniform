import NavBar from '@/components/NavBar'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/hello')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
      <NavBar />
    </div>
  )
}
