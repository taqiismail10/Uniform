import NavBar from "../NavBar"
import Hero from "./Hero"

const LandingPage = () => {
  return (
    <div>
      <NavBar />
      <div className="px-2">
        <Hero loginStatus={false} />
      </div>
    </div>
  )
}

export default LandingPage