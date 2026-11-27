import { useCallback, useEffect, useMemo, useState } from "react";
import SmartDurationSelector from "../../../components/AntDesign/SmartDurationSelector";
import SearchBox from "../../../components/Searchbox";
import { useKeyboardNavigation } from "../../../hooks/useKeyboardNavigation";
import { timeUnits } from "../helper";
import useDebounce from "../../../hooks/useDebounce";
import { cn } from "../../../lib/utils";
import CommonInput from "../../../components/CommonInput";
import TooltipWrapper from "../../../components/ReactTooltip";
import TrashIcon from "../../../assets/svg/trash.svg?react";
import { useDispatch, useSelector } from "react-redux";
import {
  createLabTest,
  getLabTestList,
  resetApiState,
} from "../../../slices/consultationSlice";
import Skeleton from "../../../components/Skeleton";
import { useFieldArray, useFormContext } from "react-hook-form";
import useApiResponseHandler from "../../../hooks/useApiResponseHandler";
import { pickKeys } from "../../../utils/common";

const Labs = () => {
  const { register, control, formState } = useFormContext();
  const labsMethods = useFieldArray({
    control,
    name: "labs",
  });
  const { errors } = formState;
  const { fields, append, remove } = labsMethods;
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500, true);
  const dispatch = useDispatch();
  const { getLabTestListApi, createLabTestApi } = useSelector(
    (state) => state.consultation
  );
  const { data, isLoading } = getLabTestListApi;
  const { userInfo } = useSelector((state) => state.user);
  const hospitalId = userInfo?.response?.hospitalId;

  // Memoize the labs list to prevent unnecessary recalculations
  const labs = useMemo(() => {
    const oldLabs = data?.response || [];

    // Only add the "add new" option if we have a search term and results
    if (debouncedSearch.trim()) {
      return [
        ...oldLabs,
        {
          name: debouncedSearch,
          new: true,
          _id: `new-${debouncedSearch}`,
        },
      ];
    }
    return oldLabs;
  }, [data, debouncedSearch]);

  const handleSelect = useCallback(
    (lab) => {
      if (lab.new) {
        addNew(lab.name);
      } else {
        append({
          _id: lab._id,
          name: lab.name,
          since: "",
          instruction: "",
        });
      }
      setSearch("");
    },
    [append]
  );

  const { cursor, setCursor, handleKeyDown } = useKeyboardNavigation(
    labs,
    handleSelect
  );

  const addNew = useCallback(
    (labName) => {
      if (hospitalId && labName.trim()) {
        dispatch(createLabTest({ data: { name: labName.trim() }, hospitalId }));
      }
    },
    [hospitalId]
  );

  // Render search results
  const renderlabResults = useCallback(() => {
    if (isLoading) {
      return (
        <div className="cursor-pointer flex flex-col gap-1">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="w-full h-10" />
          ))}
        </div>
      );
    }
    return labs.map((lab, i) => (
      <div
        key={lab._id}
        className={cn(
          "p-2 cursor-pointer hover:bg-gray-100 rounded-sm",
          i === cursor && "bg-blue-50"
        )}
        onClick={() => handleSelect(lab)}
        onMouseEnter={() => setCursor(i)}
      >
        <div className="font-medium">
          {lab.new && <span className="text-blue/50">Add new:</span>}
          {lab.name}
        </div>
      </div>
    ));
  }, [labs, isLoading, cursor, setCursor, handleSelect]);

  useApiResponseHandler({
    status: createLabTestApi.status,
    data: createLabTestApi.data,
    error: createLabTestApi.error,
    sideAction: () =>
      handleSelect(pickKeys(createLabTestApi.data.response, ["_id", "name"])),
    resetReduxStatus: () => dispatch(resetApiState("createLabTestApi")),
  });

  useEffect(() => {
    if (debouncedSearch.trim()) {
      dispatch(getLabTestList({ query: debouncedSearch.trim() }));
      setCursor(0);
    } else {
      dispatch(resetApiState("getLabTestListApi"));
    }
  }, [debouncedSearch]);

  return (
    <div>
      <h2 className="title bg-[#0F3E69]/10 block w-fit px-5 py-2 rounded-t-xl ml-5 my-0 !text-[16px]">
        Lab Investigations
      </h2>
      <div className="border border-light-blue rounded-lg min-h-28 p-5 flex flex-col gap-4">
        <SearchBox
          search={search}
          setSearch={setSearch}
          onKeyDown={(e) => {
            if (e.key === "Enter" && search.trim() && labs.length === 0) {
              e.preventDefault();
              addNew(search);
            } else {
              handleKeyDown(e);
            }
          }}
          showData={!!search.trim()}
          dataJSX={renderlabResults()}
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
            <div className="col-span-2 w-full">
              <SmartDurationSelector
                name={`labs.${index}.since`}
                control={control}
                Units={timeUnits}
                labelName="When"
                errors={errors}
                defaultValue={field?.since || ""}
              />
            </div>
            <div className="col-span-4">
              <CommonInput
                id={`labs.${index}.instruction`}
                name={`labs.${index}.instruction`}
                labelName="Instruction"
                type="text"
                register={register}
                errors={errors}
              />
            </div>

            <TooltipWrapper
              id={`labs.${index}.remove-medicine`}
              content="Remove Lab Investigations"
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

export default Labs;
