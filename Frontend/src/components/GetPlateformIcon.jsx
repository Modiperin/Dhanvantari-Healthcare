import { socialPlateform } from "../utils/types";

import FaceBook from "../assets/svg/facebook.svg?react";
import Quora from "../assets/svg/quora.svg?react";
import Reddit from "../assets/svg/reddit.svg?react";
import Twitter from "../assets/svg/twitter.svg?react";
import Linkedin from "../assets/svg/linkedin.svg?react";
import Youtube from "../assets/svg/youtube.svg?react";
import Instagram from "../assets/svg/ig.svg?react";

const getPlatformIcon = (platform) => {
  const commonProps = {
    className: "h-10 w-10 cursor-pointer bg-light-blue rounded-full p-2",
  };
  switch (platform) {
    case socialPlateform.f:
      return <FaceBook {...commonProps} />;
    case socialPlateform.l:
      return <Linkedin {...commonProps} />;
    case socialPlateform.t:
      return <Twitter {...commonProps} />;
    case socialPlateform.q:
      return <Quora {...commonProps} />;
    case socialPlateform.r:
      return <Reddit {...commonProps} />;
    case socialPlateform.y:
      return <Youtube {...commonProps} />;
    case socialPlateform.i:
      return <Instagram {...commonProps} />;
    default:
      return null;
  }
};

export default getPlatformIcon;
