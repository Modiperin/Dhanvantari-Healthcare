import { useNavigate } from "react-router-dom";
import MedicalPluseIcon from "../../assets/svg/medicalPluseIcon.svg?react";
import Button from "../../components/Buttons/Button";
import { ROUTES } from "../../routes/helper";

export default function NotFound() {
  const goto = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-200 px-4">
      <div className="bg-white rounded-full shadow-xl p-8 mb-8 border-4 border-blue-200 flex items-center justify-center">
        {/* Hospital/medical icon */}
        <MedicalPluseIcon />
      </div>
      {/* <h1 className="text-7xl font-extrabold text-blue-700 mb-2 drop-shadow-lg">
        404
      </h1> */}
      <h2 className="text-2xl font-bold  text-blue mb-4">
        Oops! Page Not Found
      </h2>
      <p className="text-lg text-blue mb-8 text-center max-w-lg">
        The page you are looking for doesn&apos;t exist or has been moved.
        <br />
        If you need help, please contact your hospital support team.
      </p>
      <Button variant="light" onClick={() => goto(ROUTES.DASHBOARD)}>
        Back to Dashboard
      </Button>
    </div>
  );
}
