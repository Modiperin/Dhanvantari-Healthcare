import { useDispatch, useSelector } from "react-redux";
import FormStepperButtons from "../FormStepperButtons";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import {
  getDataFromCookies,
  removeDataFromCookies,
} from "../../../../services/cookies";
import {
  fetchBasicDetails,
  fetchDepartments,
  fetchDoctors,
  resetApiState,
  welcomeToHospital,
} from "../../../../slices/hospitalOnboardingSlice";
import { dobToAge } from "../../../../utils/common";
import { removeSessionData } from "../../../../services/sessionStorage";
import { apiResponseType } from "../../../../utils/types";
import { ConfirmationModal } from "../../../../components/ConfirmationModal";

const ReviewSubmit = ({ previousStepHandler }) => {
  const dispatch = useDispatch();
  const curStep = useSelector((state) => state.hospitalOnboarding.currentStep);
  const hospitalId = useSelector(
    (state) => state.hospitalOnboarding.signUpHospitalApi.hospitalId
  );
  const { basicDetails, departments, doctors } = useSelector(
    (state) => state.hospitalOnboarding.formData
  );
  const { welcomeToHospitalApi } = useSelector(
    (state) => state.hospitalOnboarding
  );
  const { status, data, error, isLoading } = welcomeToHospitalApi;
  const [modalOpen, setModalOpen] = useState(false);

  // console.log({ hospitalId });
  const nextStepHandler = async () => {
    // if (window.confirm("Are you sure ?")) {
    //   console.log("Your Form filled successfully...🎉");
    //   console.log("your data is here ", { basicDetails, departments, doctors });
    //   dispatch(welcomeToHospital(hospitalId));
    // }
    setModalOpen(true);
  };

  useEffect(() => {
    const token = getDataFromCookies("hospitalToken");
    if (token) {
      dispatch(fetchBasicDetails());
      dispatch(fetchDepartments());
      dispatch(fetchDoctors());
    }
  }, []);

  useEffect(() => {
    if (status === apiResponseType.success) {
      toast.success(data.message);
      removeDataFromCookies(["hospitalToken"]);
      removeSessionData(["cs", "state"]);
    } else if (status === apiResponseType.failed) {
      error.map((error) => {
        toast.error(error.message);
      });
    }
  }, [status]);

  const handleConfirmDelete = async () => {
    setModalOpen(false);
    dispatch(welcomeToHospital(hospitalId));
  };

  const handleCancelDelete = () => {
    setModalOpen(false);
  };

  useEffect(() => {
    return () => {
      dispatch(resetApiState("welcomeToHospitalApi"));
    };
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl lg:text-2xl font-medium text-blue">
        Review & Submit
      </h2>

      {/* 🏥 Basic Details */}
      <section className="bg-extra-light-blue p-4 rounded-lg shadow-sm">
        <h3 className="text-lg font-medium mb-2 text-medium-blue">
          Hospital Details
        </h3>
        <div className="grid md:grid-cols-2 gap-6 text-sm">
          <div>
            <div className="text-gray-500">Name</div>
            <div className="text-base font-medium">
              {basicDetails.name || "-"}
            </div>
          </div>
          <div>
            <div className="text-gray-500">Pincode</div>
            <div className="text-base font-semibold">
              {basicDetails.pincode || "-"}
            </div>
          </div>
          <div>
            <div className="text-gray-500">Digi Pin</div>
            <div className="text-base font-semibold">
              {basicDetails.digiPin || "-"}
            </div>
          </div>
          <div>
            <div className="text-gray-500">Address</div>
            <div className="text-base font-semibold">
              {basicDetails.address || "-"}
            </div>
          </div>
          <div>
            <div className="text-gray-500">Email</div>
            <div className="text-base font-semibold">
              {basicDetails.email || "-"}
            </div>
          </div>
          <div>
            <div className="text-gray-500">Optional Email</div>
            <div className="text-base font-semibold">
              {basicDetails.optionalEmail || "-"}
            </div>
          </div>
          <div>
            <div className="text-gray-500">Phone No</div>
            <div className="text-base font-semibold">
              {basicDetails.phoneNo || "-"}
            </div>
          </div>
          <div>
            <div className="text-gray-500">Optional Phone No</div>
            <div className="text-base font-semibold">
              {basicDetails.optionalPhoneNo || "-"}
            </div>
          </div>
        </div>
      </section>

      {/* 🏢 Departments */}
      <section className="bg-extra-light-blue p-4 rounded-lg shadow-sm">
        <h3 className="text-lg font-medium mb-2 text-medium-blue">
          Departments
        </h3>
        <div className="space-y-3">
          {departments.map((dept, idx) => (
            <div
              key={dept.name + idx}
              className="border border-light-blue rounded-lg p-3 flex flex-col sm:flex-row justify-between sm:items-center text-sm bg-white"
            >
              <div>
                <p>
                  <strong>Name:</strong> {dept.name}
                </p>
                <p>
                  <strong>Code:</strong> {dept.code}
                </p>
              </div>
              <div className="mt-2 sm:mt-0">
                <span
                  className={`inline-block px-2 py-1 text-xs rounded-full ${
                    dept.active
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {dept.active ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 🧑‍⚕️ Doctors */}
      <section className="bg-extra-light-blue p-4 rounded-lg shadow-sm">
        <h3 className="text-lg font-medium mb-2 text-medium-blue">Doctors</h3>
        <div className="space-y-4">
          {doctors.map((doc, idx) => (
            <div
              key={doc.name + idx}
              className="border border-light-blue rounded-lg p-4 bg-white text-sm space-y-2"
            >
              <div className="grid md:grid-cols-3 gap-2">
                <p>
                  <strong>Name:</strong> {doc.name}
                </p>
                <p>
                  <strong>Department:</strong> {doc.departmentName}
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  <span
                    className={`font-semibold ${
                      doc.active ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {doc.active ? "Active" : "Inactive"}
                  </span>
                </p>
                <p>
                  <strong>Gender:</strong> {doc.gender}
                </p>
                <p>
                  <strong>Age:</strong> {dobToAge(doc.dateOfBirth)}
                </p>
                <p>
                  <strong>Date of Birth:</strong> {doc.dateOfBirth}
                </p>
                <p>
                  <strong>Email:</strong> {doc.email}
                </p>
                <p>
                  <strong>Mobile:</strong> {doc.phoneNo}
                </p>
              </div>
              <div>
                <strong>Qualifications:</strong>
                <ul className="list-disc list-inside pl-3 mt-1">
                  {doc.qualifications.map((qual, qIdx) => (
                    <li key={`${doc.name}-qual-${qIdx}`}>{qual}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Stepper Buttons */}
      <div className="pt-4">
        <FormStepperButtons
          curStep={curStep}
          previousStepHandler={previousStepHandler}
          currentStepHandler={nextStepHandler}
          isLoading={isLoading}
        />
      </div>

      {modalOpen && (
        <ConfirmationModal
          onClose={handleCancelDelete}
          onConfirm={handleConfirmDelete}
          title={<span className="text-blue text-xl">Are you sure</span>}
          primaryButtonName={"Create Hospital"}
          // primaryButtonColor={"green"}
          content={
            <span className="text-gray-600 mb-6">
              Please make sure all the details are correct. If any descrepencies
              are found contact the technical team immediately
            </span>
          }
        />
      )}
    </div>
  );
};

export default ReviewSubmit;
