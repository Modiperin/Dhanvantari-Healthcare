import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Buttons/Button";
import { ROUTES } from "../../routes/helper";

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-[80vh] text-center">
      <h1 className="text-4xl font-bold text-red-600 mb-4">
        Unauthorized Access
      </h1>
      <p className="text-lg text-gray-700 mb-2">
        You don&apos;t have access to view this page.
      </p>
      <p className="text-md text-gray-500 mb-6">
        If you think you should have access, please contact your hospital's
        administrator who has the necessary permissions on Alliedge Healthcare
        Platform.
      </p>
      <Button onClick={() => navigate(ROUTES.DASHBOARD)}>
        Go to Dashboard
      </Button>
    </div>
  );
};

export default Unauthorized;
