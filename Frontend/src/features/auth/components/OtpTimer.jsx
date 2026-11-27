import React from "react";
import { useCountdown } from "@/hooks/useCountdown";

const OtpTimer = React.memo(function OtpTimer() {
  const { formatted } = useCountdown(300, true);

  return (
    <p className="text-sm text-gray-600">
      ⏰ Expires in <span className="font-bold text-red-600">{formatted}</span>
    </p>
  );
});

export default OtpTimer;
