import { useCallback, useEffect, useMemo, useState } from "react";
import AddIconfrom from "../../../assets/svg/add-circle.svg?react";
import DeleteIcon from "../../../assets/svg/trash.svg?react";
import CommonInput from "../../../components/CommonInput";
import SearchableDropdown from "../../../components/SearchableDropdown";
import SearchBox from "../../../components/Searchbox";
import useDebounce from "../../../hooks/useDebounce";
import { useDispatch, useSelector } from "react-redux";
import {
  getSymptomsList,
  resetApiState,
} from "../../../slices/consultationSlice";
import { useKeyboardNavigation } from "../../../hooks/useKeyboardNavigation";
import { cn } from "../../../lib/utils";
import Skeleton from "../../../components/Skeleton";
import { SeverityOptions } from "../helper";

const ComplaintsSection = ({
  complaints,
  handleComplaintChange,
  addComplaint,
  removeComplaint,
}) => {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500, true);
  const dispatch = useDispatch();
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
      addComplaint({
        chief: symptom.name,
        severity: null,
        region: null,
        days: null,
      });
      setSearch("");
    },
    [addComplaint]
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
    <div className="flex flex-col gap-3">
      <h2 className="text-[16px] text-blue">Complaints</h2>
      <SearchBox
        search={search}
        setSearch={setSearch}
        onKeyDown={(e) => {
          if (e.key === "Enter" && search.trim() && symptoms.length === 0) {
            e.preventDefault();
            addComplaint({
              chief: search.trim(),
              severity: null,
              region: null,
              days: null,
            });
          } else {
            handleKeyDown(e);
          }
        }}
        showData={!!search.trim()}
        dataJSX={renderResults()}
        placeholder="Search Complaints & Add New"
      />
      <div className="flex flex-col gap-2 mt-2">
        {complaints.map((complaint, idx) => (
          <div
            key={idx}
            className="flex gap-4 items-center justify-center mb-2"
          >
            <CommonInput
              labelName="Chief Complaints"
              value={complaint["chief"]}
              onChange={(value) => {
                handleComplaintChange(idx, "chief", value);
              }}
            />
            <SearchableDropdown
              id={`complaint-${idx}-severity`}
              key={`complaint-${idx}-severity`}
              labelName="Severity"
              value={complaint["severity"]}
              onChange={(selectedOption) => {
                handleComplaintChange(idx, "severity", selectedOption.value);
              }}
              options={SeverityOptions}
              maxTags={1}
            />
            <CommonInput
              labelName="Region"
              value={complaint["region"]}
              onChange={(value) => {
                handleComplaintChange(idx, "region", value);
              }}
            />
            <CommonInput
              labelName="Days"
              value={complaint["days"]}
              onChange={(value) => {
                // console.log({ idx, value, key: "days" });
                handleComplaintChange(idx, "days", +value);
              }}
              type="number"
            />
            <button
              type="button"
              onClick={addComplaint}
              className="p-2 mx-1 hover:bg-light-blue rounded-md cursor-pointer max-w-fit"
              aria-label="Add complaint"
            >
              <AddIconfrom />
            </button>
            {complaints.length > 1 && (
              <button
                type="button"
                onClick={() => removeComplaint(idx)}
                className="p-2 mx-1 hover:bg-red-100 rounded-md cursor-pointer max-w-fit"
                aria-label="Remove complaint"
              >
                <DeleteIcon />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ComplaintsSection;
