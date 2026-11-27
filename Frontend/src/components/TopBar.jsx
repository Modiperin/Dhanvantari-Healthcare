import BackIcon from "../assets/svg/back.svg?react";
import ProfileIcon from "../assets/svg/profile2.svg?react";
import useNavigateTo from "../hooks/useNavigateTo";
import { useSelector } from "react-redux";
import { removeAuthToken } from "../services/cookies";
import { useCallback, useMemo, useState } from "react";
import ActionDropdown from "./ActionDropdown";
import HospitalDetailsModal from "./HospitalDetailsModal";
import { useBreadcrumbs } from "../hooks/useBreadcrumbs";
import DoctorPad from "./DoctorPad";
import RequestNewFeaturesModal from "./RequestNewFeaturesModal";

const TopBar = () => {
  const goTo = useNavigateTo();
  const user = useSelector((state) => state.user?.userInfo?.response);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showDoctorPad, setShowDoctorPad] = useState(false);
  const [showFeatureReqModal, setShowFeatureReqModal] = useState(false);

  const breadcrumbItems = useBreadcrumbs();

  const Logout = useCallback(() => {
    removeAuthToken();
    setTimeout(() => {
      goTo("/login");
    }, 1000);
  }, [goTo]); // goTo is likely stable, but include it as dependency

  const viewProfile = useCallback(() => {
    setShowProfileModal((prev) => !prev);
  }, []);

  const options = useMemo(() => {
    const actions = [
      {
        label: "View Profile",
        onClick: viewProfile,
      },
    ];

    if (["S", "D"].includes(user?.role)) {
      actions.push({
        label: "Configure Doctor Pad",
        onClick: () => setShowDoctorPad(true),
      });
    }

    actions.push({
      label: "Logout",
      onClick: Logout,
    });

    return actions;
  }, [Logout, viewProfile]);

  return (
    <>
      <div className="sticky top-0 z-[39] text-blue px-4 py-1 w-full rounded-lg bg-white flex items-center justify-between mb-2 border border-light-blue">
        <div className="flex items-center">
          <button
            type="button"
            onClick={() => goTo(-1)}
            className="p-2 mr-3 cursor-pointer rounded-lg hover:bg-blue-100 transition-colors"
            aria-label="Go back"
          >
            <BackIcon />
          </button>
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="flex items-center">
              {breadcrumbItems.map((item, index) => (
                <li key={index} className="flex items-center">
                  {index > 0 && <span className="mx-2 text-blue/40">/</span>}
                  <button
                    type="button"
                    // onClick={() =>
                    //   index < breadcrumbItems.length - 1 &&
                    //   item.path &&
                    //   goTo(item.path)
                    // }
                    disabled={
                      index === breadcrumbItems.length - 1 || !item.path
                    }
                    className={`text-xs lg:text-sm ${
                      index < breadcrumbItems.length - 1 && item.path
                        ? "text-blue/90 hover:text-blue cursor-pointer"
                        : "text-blue/50font-medium cursor-default"
                    } transition-colors duration-200`}
                  >
                    {item.title}
                  </button>
                </li>
              ))}
            </ol>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <span className="font-medium text-xs lg:text-sm">{user?.name}</span>
          <div className="cursor-pointer hover:bg-blue-50 rounded-md p-1">
            <ActionDropdown
              actions={options}
              open={dropdownOpen}
              onOpenChange={setDropdownOpen}
            >
              <ProfileIcon
                onClick={(e) => {
                  e.stopPropagation();
                  setDropdownOpen((open) => !open);
                }}
              />
            </ActionDropdown>
          </div>
          <button
            className="text-xs text-blue-500 cursor-pointer font-medium px-3 py-1 border border-blue-100 rounded-lg hover:bg-blue-50 hover:border-blue-200 transition-colors duration-200"
            onClick={() => setShowFeatureReqModal(true)}
          >
            Request New Features
          </button>
        </div>
      </div>
      {showProfileModal && (
        <HospitalDetailsModal
          open={showProfileModal}
          onClose={() => {
            setShowProfileModal(false);
          }}
        />
      )}
      {showDoctorPad && (
        <DoctorPad
          open={showDoctorPad}
          onClose={() => setShowDoctorPad(false)}
        />
      )}
      {showFeatureReqModal && (
        <RequestNewFeaturesModal
          open={showFeatureReqModal}
          onClose={() => setShowFeatureReqModal(false)}
        />
      )}
    </>
  );
};

export default TopBar;
