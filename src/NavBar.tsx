import { Button } from "./components/ui/button"

const NavBar = () => {
  return (
    <div className="flex justify-between items-center p-4 bg-gray-200">
      <div>
        <h2 className="text-3xl font-bold">UniForm</h2>
      </div>
      <div>
        <ul className="flex space-x-16">
          <li className="text-lg font-semibold">Home</li>
          <li className="text-lg font-semibold">Feature</li>
        </ul>
      </div>
      <div className="flex space-x-4">

        <Button variant="outline" className="bg-black text-white">Login</Button>
        <Button variant="outline" className="bg-black text-white">Sign Up</Button>
      </div>
    </div>
  )
}

export default NavBar