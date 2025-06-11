import { Button } from "@radix-ui/themes"
import { useNavigate } from "react-router";

interface HeroSectionProps {
  loginStatus: boolean;
}

const HeroSection = (props: HeroSectionProps) => {
  const navigate = useNavigate();

  const { loginStatus } = props;

  return (
    <div className="flex flex-col sm:flex-row m-4 p-2 pt-8 sm:px-6 md:px-8">
      <div className="w-full p-4 flex flex-col justify-center gap-4 sm:gap-5 md:gap-6">
        <h1 className="">Simplify Your University Application Journey</h1>
        <h3 className="border-b-1 border-gray-300 pb-3 w-fit">Apply once. Reach all.</h3>
        <div className="flex flex-col sm:flex-row gap-4 mt-12 sm:mt-6 md:mt-14">
          {
            loginStatus ?
              <>
                <Button
                  size='4'
                  className="button-primary"
                  onClick={() => navigate('/dashboard')}
                >Go to Dashboard</Button>
                <Button size='4' className="button-secondary">Your Profile</Button>
              </>
              :
              <>
                <Button size='4' className="button-primary">Start Applying</Button>
                <Button size='4' className="button-secondary">Explore Features</Button>
              </>
          }
        </div>
      </div>
      <div className="hidden sm:w-[60%] sm:flex items-center justify-center">
        <img
          src="/src/assets/student_using_laptop.svg"
          alt="student using laptop"
        />
      </div>
    </div>
  )
}

export default HeroSection