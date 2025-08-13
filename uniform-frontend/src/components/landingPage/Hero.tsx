import { Link, useNavigate } from "@tanstack/react-router";
import { Button } from "../ui/button"

interface HeroSectionProps {
  loginStatus: boolean;
}

const Hero = (props: HeroSectionProps) => {
  const navigate = useNavigate();
  const { loginStatus } = props;
  return (
    <div id="hero" className="flex flex-col md:flex-row m-2 p-2 sm:pt-4 md:px-4">
      <div className="w-full p-4 flex flex-col justify-center gap-4 sm:gap-5 md:gap-6">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold text-start">Simplify Your University Application Journey</h1>
        <h3 className="text-lg sm:text-xl md:text-2xl text-start pb-2 w-fit">Apply once. Reach all.</h3>
        <div className="flex gap-4 mt-4 sm:mt-6 md:mt-8">
          {
            loginStatus ?
              <>
                <Button
                  onClick={() => navigate({ to: '/student/dashboard' })}
                >Go to Dashboard</Button>
                <Button variant={"outline"} >Your Profile</Button>
              </>
              :
              <>
                <Button>
                  <Link to="/registration">
                    Start Applying
                  </Link>
                </Button>
                <Button variant={"outline"}>Explore Features</Button>
              </>
          }
        </div>
      </div>
      <div className="hidden md:w-[65%] md:flex items-center justify-center mt-2 md:mt-0">
        <img
          src="/src/assets/student_using_laptop.svg"
          alt="student using laptop"
          className="w-full max-w-lg"
        />
      </div>
    </div>
  )
}

export default Hero
