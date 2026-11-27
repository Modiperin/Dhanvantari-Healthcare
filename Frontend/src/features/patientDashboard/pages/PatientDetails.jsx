import { useEffect, useState } from "react";
import {
  getPatientMedicalHistory,
  resetUpdatePatientStatus,
  resetViewPatientByIdStatus,
  viewPatientById,
} from "../../../slices/patientSlice";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { apiResponseType } from "../../../utils/types";
import { multipleErrorToastMessage } from "../../../utils/toastMessage";
import useNavigateTo from "../../../hooks/useNavigateTo";
import TabSwitcher from "../../../components/TabSwitcher";
import { tabs } from "../helper";
import BasicDetails from "../components/BasicDetails";
import EditPatientDetails from "../components/EditPatientDetails";
import { ROUTES } from "../../../routes/helper";

const PatientDetails = () => {
  const { patientId } = useParams();
  const dispatch = useDispatch();
  const goTo = useNavigateTo();
  const [mode, setMode] = useState(false);

  const { viewPatientByIdApi } = useSelector(
    (state) => state.patientManagement
  );
  const { data, status } = viewPatientByIdApi;
  useEffect(() => {
    dispatch(viewPatientById({ id: patientId }));
    dispatch(getPatientMedicalHistory(patientId));
  }, [patientId]);

  const updateData = () => {
    dispatch(viewPatientById({ id: patientId }));
    dispatch(getPatientMedicalHistory(patientId));
  };

  useEffect(() => {
    if (status === apiResponseType.failed) {
      multipleErrorToastMessage(viewPatientByIdApi);
      // dispatch(resetViewPatientByIdStatus());
      goTo(ROUTES.PATIENTS);
    }
  }, [viewPatientByIdApi, dispatch]);

  useEffect(() => {
    return () => {
      dispatch(resetViewPatientByIdStatus());
      dispatch(resetUpdatePatientStatus());
    };
  }, []);

  return (
    <>
      <div className="page">
        {/* NEED TO CHANGE THE REDIRECTION LOGIC WRITE NOW IT ONLY WORK FOR SINGLE DATA*/}
        <TabSwitcher tabs={tabs} selected={1} id={data?.response?._id} />
        {!mode ? (
          <BasicDetails setMode={setMode} />
        ) : (
          <EditPatientDetails setMode={setMode} updateData={updateData} />
        )}
      </div>
    </>
  );
};

export default PatientDetails;
