import { RouterProvider } from '@tanstack/react-router'
import router from './router'
import { AuthProvider } from '@/context/student/AuthProvider'
import { AuthProvider as AdminAuthProvider } from '@/context/admin/authProvider'
import { Toaster } from 'sonner'

function App() {

  return (
    <>
      <AuthProvider>
        <AdminAuthProvider>
          <RouterProvider router={router} />
        </AdminAuthProvider>
      </AuthProvider>
      <Toaster />
    </>
  )
}

export default App
