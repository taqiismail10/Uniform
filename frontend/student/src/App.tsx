
import { Outlet, Route, Routes } from 'react-router'
import './App.css'
import NavBar from './components/NavBar/NavBar'
import TestComp from './components/TestComp'
import HeroSection from './components/HeroSection/HeroSection'
import Features from './components/Features/Features'
import { useState } from 'react'
import Dashboard from './components/Dashboard/Dashboard'
import Steps from './components/Steps/Steps'
import Footer from './components/Footer/Footer'
import Testimonial from './components/Testimonial/Testimonial'

function App() {

  const [loginStatus, setLoginStatus] = useState<boolean>(false);

  const handleLogout = () => {
    setLoginStatus(false);
  };

  const handleLogin = () => {
    setLoginStatus(true);
  };

  return (
    <Routes>
      <Route
        element={
          <>
            <div className="flex flex-col min-h-screen"> {/* Wrapper for sticky footer */}
              <NavBar loginStatus={loginStatus} handleLogin={handleLogin} handleLogout={handleLogout} />
              <main className='flex-grow p-4'>
                <Outlet />
              </main>
              <Footer />
            </div>
          </>
        }
      >
        <Route
          path='/'
          element={
            <div className='flex flex-col gap-4'>
              <HeroSection loginStatus={loginStatus} />
              <Features />
              <Steps />
              <Testimonial />
            </div>
          }
        />
        <Route path='dashboard' element={<Dashboard />} />
      </Route>

      <Route path='/test-component' element={<TestComp />} />
    </Routes>
  )
}

export default App
