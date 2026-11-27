import { useCallback, useEffect, useMemo, useState } from "react";
import SearchBox from "../../../components/Searchbox";
import { useKeyboardNavigation } from "../../../hooks/useKeyboardNavigation";
import useDebounce from "../../../hooks/useDebounce";
import { cn } from "../../../lib/utils";
import CommonInput from "../../../components/CommonInput";
import TooltipWrapper from "../../../components/ReactTooltip";
import TrashIcon from "../../../assets/svg/trash.svg?react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import {
  getSymptomsList,
  resetApiState,
} from "../../../slices/consultationSlice";
import Skeleton from "../../../components/Skeleton";

const ClinicalFindings = () => {
  const { register, formState, control } = useFormContext();
  const clinicalFindingsMethods = useFieldArray({
    control,
    name: "clinicalFindings",
  });
  const dispatch = useDispatch();
  const { errors } = formState;
  const { fields, append, remove } = clinicalFindingsMethods;
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500, true);
  const { getSymptomsListApi } = useSelector((state) => state.consultation);
  const { data, isLoading } = getSymptomsListApi;

  const symptoms = useMemo(() => {
    const oldSymptoms = data?.response || [];

    // Only add the "add new" option if we have a search term and results
    if (debouncedSearch.trim()) {
      return [
        ...oldSymptoms,
        {
          name: debouncedSearch,
          new: true,
          _id: `new-${debouncedSearch}`,
        },
      ];
    }
    return oldSymptoms;
  }, [data, debouncedSearch]);

  const handleSelect = useCallback(
    (symptom) => {
      append({
        name: symptom.name,
        instruction: "",
      });
      setSearch("");
    },
    [append]
  );

  const { cursor, setCursor, handleKeyDown } = useKeyboardNavigation(
    symptoms,
    handleSelect
  );

  // Render search results
  const renderResults = useCallback(() => {
    if (isLoading) {
      return (
        <div className="cursor-pointer flex flex-col gap-1">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="w-full h-10" />
          ))}
        </div>
      );
    }
    return symptoms.map((symptom, i) => (
      <div
        key={symptom._id}
        className={cn(
          "p-2 cursor-pointer hover:bg-gray-100 rounded-sm",
          i === cursor && "bg-blue-50"
        )}
        onClick={() => handleSelect(symptom)}
        onMouseEnter={() => setCursor(i)}
      >
        <div className="font-medium">
          {symptom.new && <span className="text-blue/50">Add new:</span>}
          {symptom.name}
        </div>
      </div>
    ));
  }, [symptoms, isLoading, cursor, setCursor, handleSelect]);

  useEffect(() => {
    if (debouncedSearch.trim()) {
      dispatch(getSymptomsList({ query: debouncedSearch.trim() }));
      setCursor(0);
    } else {
      dispatch(resetApiState("getSymptomsListApi"));
    }
  }, [debouncedSearch]);

  return (
    <div>
      <h2 className="title bg-[#AC0003]/10 block w-fit px-5 py-2 rounded-t-xl ml-5 my-0 !text-[16px]">
        Clinical Findings
      </h2>
      <div className="border border-light-blue rounded-lg min-h-28 p-5 flex flex-col gap-4">
        <SearchBox
          search={search}
          setSearch={setSearch}
          onKeyDown={handleKeyDown}
          showData={!!search.trim()}
          dataJSX={renderResults()}
          placeholder="Search Patients"
        />

        {fields.map((field, index) => (
          <div
            key={field.id}
            className={cn(
              "relative grid gap-5 border-light-blue items-center rounded-lg justify-items-stretch grid-cols-9"
            )}
          >
            <span className="text-blue text-sm block font-medium col-span-2">
              {field.name}
            </span>
            <div className="col-span-6">
              <CommonInput
                id={`clinicalFindings.${index}.instruction`}
                name={`clinicalFindings.${index}.instruction`}
                labelName="Instruction"
                type="text"
                register={register}
                errors={errors}
              />
            </div>

            <TooltipWrapper
              id={`clinicalFindings.${index}.remove-medicine`}
              content="Remove Clinical Findings"
              className="col-span-1 w-fit p-2 rounded-full hover:bg-red-100 cursor-pointer"
            >
              <TrashIcon onClick={() => remove(index)} />
            </TooltipWrapper>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClinicalFindings;
