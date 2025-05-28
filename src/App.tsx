
import './App.css'
import { Button } from "@/components/ui/button"
import NavBar from './NavBar'
import Home from './Home'


function App() {

  return (
    <>
      <NavBar />
      <Home />
      <h2>Hello World</h2>
      <Button variant="outline" className='bg-black text-white'>Button</Button>
    </>
  )
}

export default App
