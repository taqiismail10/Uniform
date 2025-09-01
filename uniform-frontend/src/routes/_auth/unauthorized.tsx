import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/unauthorized')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className='p-10'>
      <h1 className='text-2xl font-bold mb-2'>Unauthorized Access</h1>
      <p className='text-gray-800'>You do not have permisson to access this page.</p>
      <Link className='text-blue-500 hover:underline' to={'/'}>Back to Home</Link>
      <br />
      <Link className='text-blue-500 hover:underline' to={'/student/studentLogin'}>Login</Link>
    </div>
  )
}
