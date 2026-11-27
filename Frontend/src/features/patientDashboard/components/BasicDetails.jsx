import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import useNavigateTo from "../../../hooks/useNavigateTo";
import { apiResponseType } from "../../../utils/types";
import { multipleErrorToastMessage } from "../../../utils/toastMessage";
import Button from "../../../components/Buttons/Button";
import { dobToAge } from "../../../utils/common";
import PatientBasicDetailsSkeleton from "../loader/PatientBasicDetailsSkeleton";
import EditUserIcon from "../../../assets/svg/user-edit.svg?react";
import NormalTableView from "../../../components/table/NormalTableView";
import { ROUTES } from "../../../routes/helper";
import { usePermission } from "../../../hooks/usePermission";
import ViewOnly from "../../../components/ViewOnly";
import PatientInfo from "./PatientInfo";

const BasicDetails = ({ setMode }) => {
  const isViewOnly = !usePermission("patient", "modify");
  const dispatch = useDispatch();
  const goTo = useNavigateTo();

  const { viewPatientByIdApi } = useSelector(
    (state) => state.patientManagement
  );

  const { data, status } = viewPatientByIdApi;

  useEffect(() => {
    if (status === apiResponseType.failed) {
      multipleErrorToastMessage(viewPatientByIdApi);
      goTo(ROUTES.PATIENTS);
    }
  }, [viewPatientByIdApi, dispatch]);

  const patient = data?.response || {};
  const emergency = patient?.emergencyContact || {};
  const address = patient?.address || {};
  const history = patient?.medicalHistory || {};

  return (
    <>
      {!data?.response ? (
        <PatientBasicDetailsSkeleton />
      ) : (
        <div className="w-full min-h-screen bg-white p-8 rounded-lg flex flex-col gap-10 text-sm text-gray-700 ">
          {/* Header */}
          <div className="flex justify-between items-center">
            <PatientInfo patientData={patient} />

            {isViewOnly ? (
              <ViewOnly />
            ) : (
              <Button
                onClick={() => {
                  setMode(true);
                }}
                variant="light"
              >
                <EditUserIcon className="mr-2" /> Edit Details
              </Button>
            )}
          </div>

          {/* Grid Sections */}
          <div className="grid grid-cols-2 gap-8">
            {/* Patient Details */}
            <div className="text-blue">
              <h3 className="text-xl mb-2">Patient Details</h3>
              {
                <NormalTableView
                  data={{
                    Gender: patient?.gender,
                    "Blood Group": patient?.bloodGroup,
                    "Date of Birth": patient?.dateOfBirth,
                    Age: `${dobToAge(patient?.dateOfBirth)} years`,
                    Phone: patient?.phoneNo,
                    Email: patient?.email,
                  }}
                />
              }
            </div>

            {/* Address Details */}
            {
              <div className="text-blue capitalize">
                <h3 className="text-xl mb-2">Address Details</h3>
                {
                  <NormalTableView
                    data={{
                      "House Name": address?.houseName,
                      Locality: address?.locality,
                      Area: address?.area,
                      Pincode: address?.pincode,
                      Digipin: address?.digipin,
                      State: address?.state,
                      Country: address?.country,
                    }}
                  />
                }
              </div>
            }

            {/* Emergency Contact Details */}
            <div className="text-blue capitalize">
              <h3 className="text-xl mb-2">Emergency Contact Details</h3>
              {
                <NormalTableView
                  data={{
                    Name: emergency?.name || "N/A",
                    Relationship: emergency?.relationship || "N/A",
                    Phone: emergency?.phoneNo || "N/A",
                    Email: emergency?.email || "N/A",
                  }}
                />
              }
            </div>

            {/* Patient History */}
            <div className="text-blue capitalize">
              <h3 className="text-xl mb-2">Patient History</h3>
              {/* {console.log(history)} */}
              {
                <NormalTableView
                  data={{
                    // "Lifestyle Habits": history?.habits
                    //   ? history?.habits?.join(", ")
                    //   : "N/A",
                    Habbits: Object.keys(history)
                      ?.filter((obj) => history[obj] === true)
                      .join(", "),
                    "Food Allergy": history?.foodAllergy
                      ? history?.foodAllergy?.join(", ")
                      : "N/A",
                    "Drug Allergy": history?.drugAllergy
                      ? history?.drugAllergy?.join(", ")
                      : "N/A",
                    Procedure: history?.procedure
                      ? history?.procedure?.join(", ")
                      : "N/A",
                    "Taking Medicines": history?.currentlyTakingMedicines
                      ? history?.currentlyTakingMedicines?.join(", ")
                      : "N/A",
                  }}
                />
              }
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BasicDetails;
