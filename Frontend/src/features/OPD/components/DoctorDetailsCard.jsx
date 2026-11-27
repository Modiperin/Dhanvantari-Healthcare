import { useEffect, useMemo, useState } from "react";
import DocUserIcon from "../../../assets/svg/user.svg?react";
import ClipboardCloseIcon from "../../../assets/svg/clipboard-close.svg?react";
import EditIcon from "../../../assets/svg/edit.svg?react";
import SearchableDropdown from "../../../components/SearchableDropdown";
import { useDispatch, useSelector } from "react-redux";
import { getDepartmentList } from "../../../slices/departmentSlice";
import { getDoctorList } from "../../../slices/doctorSlice";
import DoctorDetailsCardSkeleton from "../loader/DoctorDetailsCardSkeleton";
import CancelButton from "../../../components/Buttons/CancelButton";
import SaveButton from "../../../components/Buttons/SaveButton";

const DoctorDetailsCard = ({ doctorName, departmentName, onSave, isReady }) => {
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [localDoctor, setLocalDoctor] = useState(doctorName);
  const [localDept, setLocalDept] = useState(departmentName);

  const { getDepartmentListApi } = useSelector(
    (state) => state.departmentManagement
  );
  const departmentNameFromId = useMemo(() => {
    return (
      getDepartmentListApi.data?.response?.list.find(
        (dept) => dept._id === localDept?.value
      ) || {}
    );
  }, [getDepartmentListApi, localDept]);

  const { getDoctorListApi } = useSelector((state) => state.doctorManagement);

  useEffect(() => {
    if (!getDepartmentListApi?.data) {
      dispatch(getDepartmentList());
    }
    if (!getDoctorListApi?.data) {
      dispatch(getDoctorList());
    }
  }, []);

  const departmentOptions = useMemo(() => {
    return (
      getDepartmentListApi.data?.response?.list.map((dept) => ({
        name: dept.name,
        value: dept._id,
      })) || []
    );
  }, [getDepartmentListApi]);

  const doctorOptions = useMemo(() => {
    return (
      getDoctorListApi.data?.response?.list.map((doct) => ({
        name: "Dr. ".concat(doct.name),
        value: doct.userId,
      })) || []
    );
  }, [getDoctorListApi]);

  useEffect(() => {
    if (isReady) {
      setLocalDoctor(doctorName);
      setLocalDept(departmentName);

      // Only set edit mode if either doctor or department is missing
      if (!doctorName?.value || !departmentName?.value) {
        setIsEditing(true);
      }
    }
  }, [isReady]);

  const handleSave = () => {
    onSave(localDoctor, localDept);
    setIsEditing(false);
  };

  if (getDepartmentListApi.isLoading || getDoctorListApi.isLoading) {
    return <DoctorDetailsCardSkeleton />;
  }

  return (
    <div className="flex flex-col gap-3">
      {isEditing ? (
        <>
          <div>
            <div className="font-semibold text-blue text-lg mb-1">
              {doctorName?.value ? (
                "Edit Doctor Details"
              ) : (
                <span className="flex items-center gap-1">
                  <ClipboardCloseIcon />
                  No Doctor Assigned
                </span>
              )}
            </div>
            <p className="text-sm text-blue/70 mb-2">
              Assign doctor to save vitals
            </p>
          </div>

          <SearchableDropdown
            id={`department`}
            labelName="Department Name"
            value={localDept?.value}
            options={departmentOptions}
            onChange={setLocalDept}
          />

          <SearchableDropdown
            id={`doctor`}
            labelName="Doctor Name"
            value={localDoctor?.value}
            options={doctorOptions}
            onChange={setLocalDoctor}
          />

          <div className="flex justify-end gap-2 mt-2">
            {doctorName?.value && (
              <CancelButton onClick={() => setIsEditing(false)} />
            )}
            <SaveButton onClick={handleSave} />
          </div>
        </>
      ) : (
        <>
          <div className="flex items-center gap-2 mb-2">
            <DocUserIcon />
            <span className="font-semibold text-xl">{doctorName?.name}</span>
            <span
              className="ml-2 p-1 hover:bg-light-blue rounded-sm cursor-pointer"
              onClick={() => setIsEditing(true)}
            >
              <EditIcon />
            </span>
          </div>
          <div className="flex items-center gap-2 mb-2">
            <ClipboardCloseIcon />
            <span className="font-xs">{departmentNameFromId?.name}</span>
          </div>
        </>
      )}
    </div>
  );
};

export default DoctorDetailsCard;
