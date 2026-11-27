import { useEffect, useState } from "react";
import SearchBox from "../../../components/Searchbox";
import { useKeyboardNavigation } from "../../../hooks/useKeyboardNavigation";
import useDebounce from "../../../hooks/useDebounce";
import { cn } from "../../../lib/utils";
import CommonInput from "../../../components/CommonInput";
import TooltipWrapper from "../../../components/ReactTooltip";
import TrashIcon from "../../../assets/svg/trash.svg?react";
import { useDispatch, useSelector } from "react-redux";
import { getDoctorList } from "../../../slices/doctorSlice";
import Skeleton from "../../../components/Skeleton";
import { useFieldArray, useFormContext } from "react-hook-form";

const ReferToDoctor = () => {
  const { register, formState, control } = useFormContext();
  const referToDoctorMethods = useFieldArray({
    control,
    name: "referToDoctor",
  });

  const { errors } = formState;
  const { fields, append, remove } = referToDoctorMethods;
  const dispatch = useDispatch();
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500, true);
  const { getDoctorListApi } = useSelector((state) => state.doctorManagement);
  const { data, isLoading } = getDoctorListApi;

  const doctors =
    data?.response?.list?.map((doctor) => ({
      id: doctor.userId,
      titleName: doctor.titleName,
      name: doctor.name,
    })) || [];

  const handleSelect = (doctor) => {
    append({
      _id: doctor.id,
      name: doctor.name,
      notesForPatient: "",
      notesForDoctor: "",
    });
    setSearch("");
  };

  const { cursor, setCursor, handleKeyDown } = useKeyboardNavigation(
    doctors,
    handleSelect
  );

  // Render search results
  const renderResults = () => {
    if (isLoading) {
      return (
        <div className="cursor-pointer flex flex-col gap-1">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="w-full h-10" />
          ))}
        </div>
      );
    } else if (doctors.length > 0 && !!search) {
      return (
        <div>
          {doctors.map((result, i) => (
            <div
              key={result.id}
              className={cn(
                "p-2 cursor-pointer hover:bg-gray-100 rounded-sm",
                i === cursor && "bg-blue-50"
              )}
              onClick={() => handleSelect(result)}
              onMouseEnter={() => setCursor(i)}
            >
              <div className="font-medium">{result.name}</div>
            </div>
          ))}
        </div>
      );
    } else {
      return <div className="p-2">No Doctor found</div>;
    }
  };

  useEffect(() => {
      dispatch(getDoctorList({ query: debouncedSearch.trim() }));
      setCursor(0);
  }, [debouncedSearch]);

  return (
    <div>
      <h2 className="title bg-[#AC9E00]/10 block w-fit px-5 py-2 rounded-t-xl ml-5 my-0 !text-[16px]">
        Refer To Doctor
      </h2>
      <div className="border border-light-blue rounded-lg min-h-28 p-5 flex flex-col gap-4">
        <SearchBox
          search={search}
          setSearch={setSearch}
          onKeyDown={handleKeyDown}
          showData={!!search.trim()}
          dataJSX={renderResults()}
          placeholder="Search Patients"
          disabled={fields.length > 0}
        />

        {fields.map((field, index) => (
          <div
            key={field.id}
            className={cn(
              "relative grid gap-5 border-light-blue items-center rounded-lg justify-items-stretch grid-cols-9"
              // fields.length > 0 ? "grid-cols-9" : "grid-cols-8"
            )}
          >
            <span className="text-blue text-sm block font-medium col-span-2">
              {field.name}
            </span>
            <div className="col-span-3">
              <CommonInput
                id={`referToDoctor.${index}.notesForPatient`}
                name={`referToDoctor.${index}.notesForPatient`}
                labelName="Notes For Patient"
                type="text"
                register={register}
                errors={errors}
              />
            </div>
            <div className="col-span-3">
              <CommonInput
                id={`referToDoctor.${index}.notesForDoctor`}
                name={`referToDoctor.${index}.notesForDoctor`}
                labelName="Notes for Doctor"
                type="text"
                register={register}
                errors={errors}
              />
            </div>

            {/* Remove button - Only show if more than one diagnosis */}
            {/* {fields.length > 0 && ( */}
            <TooltipWrapper
              id={`referToDoctor.${index}.remove-medicine`}
              content="Remove Patient"
              className="col-span-1 w-fit p-2 rounded-full hover:bg-red-100 cursor-pointer"
            >
              <TrashIcon onClick={() => remove(index)} />
            </TooltipWrapper>
            {/* )} */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReferToDoctor;
