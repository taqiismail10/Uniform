import { Button } from "./components/ui/button";
import { LuNotebookPen } from "react-icons/lu";
import { LiaMapMarkedAltSolid } from "react-icons/lia";

const Home = () => {
  return (
    <div className="flex items-center p-4 space-x-4">
      <div className="flex-1 p-4">
        <h2 className="text-2xl">SteamLining</h2>
        <h2 className="text-5xl font-bold">University Application</h2>
        <h2 className="text-2xl">Process</h2>
        <div className="flex flex-col space-y-2 my-8">
          <Button variant="outline" className="w-fit bg-blue-500 text-white p-6">Explore Features</Button>
          <Button variant="outline" className="w-fit bg-black text-white p-6">Signup</Button>
        </div>
        <div className="mt-8">
          <div className="flex items-center space-x-2">
            <LuNotebookPen size="24" />
            <h2 className="text-2xl">Unified Application Form</h2>
          </div>
          <p className="text-justify mt-2">
            UniForm is a platform designed to simplify the university application process by providing a unified application form that can be used across multiple universities. It aims to streamline the application process, making it easier for students to apply to various institutions without having to fill out separate forms for each one.
          </p>
        </div>
      </div>
      <div className="flex-[0.7]">
        <img
          src="https://img.freepik.com/free-photo/side-view-employee-working-laptop_23-2150152247.jpg?ga=GA1.1.36440501.1748377785&semt=ais_hybrid&w=740"
          alt="University"
          className="w-full object-cover rounded"
        />
        <div className="mt-4">
          <div className="flex items-center space-x-2">
            <LiaMapMarkedAltSolid size="26" />
            <h2 className="text-2xl">Real-Time Tracking</h2>
          </div>
          <p className="text-justify mt-2">
            The platform provides real-time tracking of application status, allowing students to monitor their applications and receive updates on their progress.  This feature helps students stay informed about their application status and reduces the anxiety associated with waiting for responses from universities.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;