import NavBar from "../NavBar"
import Feature from "./Feature"
import Hero from "./Hero"
import Process from "./Process"
import ReadyToApply from "./ReadyToApply"
import Support from "./Support"
import Testimonial from "./Testimonial"

const LandingPage = () => {
  return (
    <div>
      <NavBar />
      <div className="px-2">
        <Hero loginStatus={false} />
        <Feature />
        <Process />
        <Testimonial />
        <Support />
        <ReadyToApply />
      </div>
    </div>
  )
}

export default LandingPage