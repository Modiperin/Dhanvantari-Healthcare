import SmartDurationSelector from "../../../components/AntDesign/SmartDurationSelector";
import SearchBox from "../../../components/Searchbox";
import { diagnosisStatusOptions, timeUnits } from "../helper";
import AntSearchableSelector from "../../../components/AntDesign/AntSearchableSelector";
import CommonInput from "../../../components/CommonInput";
import TrashIcon from "../../../assets/svg/trash.svg?react";
import { useCallback, useEffect, useMemo, useState } from "react";
import useDebounce from "../../../hooks/useDebounce";
import { cn } from "../../../lib/utils";
import { useKeyboardNavigation } from "../../../hooks/useKeyboardNavigation";
import TooltipWrapper from "../../../components/ReactTooltip";
import {
  createDiagnosis,
  getDiagnosisList,
  resetApiState,
} from "../../../slices/consultationSlice";
import { useDispatch, useSelector } from "react-redux";
import Skeleton from "../../../components/Skeleton";
import { useFieldArray, useFormContext } from "react-hook-form";
import useApiResponseHandler from "../../../hooks/useApiResponseHandler";
import { pickKeys } from "../../../utils/common";

const DiagnosisCard = () => {
  const { register, control, formState } = useFormContext();
  const diagnosisMethods = useFieldArray({
    control,
    name: "diagnosis",
  });
  const { errors } = formState;
  const { fields, append, remove } = diagnosisMethods;
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500, true);
  const dispatch = useDispatch();
  const { getDiagnosisListApi, createDiagnosisApi } = useSelector(
    (state) => state.consultation
  );
  const { data, isLoading } = getDiagnosisListApi;
  const { userInfo } = useSelector((state) => state.user);
  const hospitalId = userInfo?.response?.hospitalId;

  const diagnosis = useMemo(() => {
    const oldDiagnosis = data?.response || [];
    debouncedSearch.trim() ? [...oldDiagnosis] : oldDiagnosis;

    if (debouncedSearch.trim()) {
      return [
        ...oldDiagnosis,
        {
          name: debouncedSearch,
          new: true,
          _id: `new-${debouncedSearch}`,
        },
      ];
    }
    return oldDiagnosis;
  }, [data, debouncedSearch]);

  // Handle diagnosis selection
  const handleSelectDiagnosis = useCallback(
    (diagnosis) => {
      if (diagnosis.new) {
        addNew(diagnosis.name);
      } else {
        append({
          _id: diagnosis._id,
          name: diagnosis.name,
          since: "",
          status: "confirm",
          note: "",
        });
      }
      setSearch("");
    },
    [append]
  );

  const { cursor, setCursor, handleKeyDown } = useKeyboardNavigation(
    diagnosis,
    handleSelectDiagnosis
  );

  const addNew = useCallback(
    (diagnosis) => {
      if (hospitalId && diagnosis) {
        dispatch(createDiagnosis({ data: { name: diagnosis }, hospitalId }));
      }
    },
    [hospitalId]
  );

  // Render search results
  const renderDiagnosisResults = useCallback(() => {
    if (isLoading) {
      return (
        <div className="cursor-pointer flex flex-col gap-1">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="w-full h-10" />
          ))}
        </div>
      );
    } else {
      return diagnosis.map((diagnosis, i) => (
        <div
          key={diagnosis._id}
          className={cn(
            "p-2 cursor-pointer hover:bg-gray-100 rounded-sm",
            i === cursor && "bg-blue-50"
          )}
          onClick={() => handleSelectDiagnosis(diagnosis)}
          onMouseEnter={() => setCursor(i)}
        >
          <div className="font-medium">
            {diagnosis.new && <span className="text-blue/50">Add new:</span>}
            {diagnosis.name}
          </div>
        </div>
      ));
    }
  }, [diagnosis, isLoading, cursor, setCursor, handleSelectDiagnosis]);

  useApiResponseHandler({
    status: createDiagnosisApi.status,
    data: createDiagnosisApi.data,
    error: createDiagnosisApi.error,
    sideAction: () =>
      handleSelectDiagnosis(
        pickKeys(createDiagnosisApi.data.response, ["_id", "name"])
      ),
    resetReduxStatus: () => dispatch(resetApiState("createDiagnosisApi")),
  });

  useEffect(() => {
    if (debouncedSearch.trim()) {
      dispatch(getDiagnosisList({ query: debouncedSearch.trim() }));
      setCursor(0);
    } else {
      dispatch(resetApiState("getDiagnosisListApi"));
    }
  }, [debouncedSearch]);

  return (
    <div>
      <h2 className="title bg-[#6100AC]/10 block w-fit px-5 py-2 rounded-t-xl ml-5 my-0 !text-[16px] ">
        Diagnosis
      </h2>
      <div className="border border-light-blue rounded-lg min-h-28 p-5 flex flex-col gap-4">
        <SearchBox
          search={search}
          setSearch={setSearch}
          onKeyDown={(e) => {
            if (e.key === "Enter" && search.trim() && diagnosis.length === 0) {
              e.preventDefault();
              addNew(search);
            } else {
              handleKeyDown(e);
            }
          }}
          showData={!!search.trim()}
          dataJSX={renderDiagnosisResults()}
          placeholder="Search Patients"
        />

        {fields.map((field, index) => (
          <div
            key={field.id}
            className={cn(
              "relative grid gap-5 border-light-blue items-center rounded-lg justify-items-stretch grid-cols-9"
            )}
          >
            <span className="text-blue text-sm block col-span-2">
              {field.name}
            </span>
            <div className="col-span-2 w-full">
              <SmartDurationSelector
                name={`diagnosis.${index}.since`}
                control={control}
                Units={timeUnits}
                labelName="Since"
                errors={errors}
                defaultValue={field?.since || ""}
              />
            </div>

            <div className="col-span-2">
              {/* Status Selector - Controlled component integrated with RHF */}
              <AntSearchableSelector
                showSearch={false}
                name={`diagnosis.${index}.status`}
                control={control}
                options={diagnosisStatusOptions}
                labelName="Diagnosis Status"
                filterSort={false}
                errors={errors}
              />
            </div>

            <div className="col-span-2">
              {/* Note Input - Non-controlled component with register */}
              <CommonInput
                id={`diagnosis.${index}.note`}
                name={`diagnosis.${index}.note`}
                labelName="Note"
                type="text"
                register={register}
                errors={errors}
              />
            </div>

            <TooltipWrapper
              id={`medications.${index}.remove-diagnosis`}
              content="Remove Medicine"
              className="p-2 rounded-full hover:bg-red-100 cursor-pointer w-fit"
            >
              <TrashIcon onClick={() => remove(index)} />
            </TooltipWrapper>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DiagnosisCard;
