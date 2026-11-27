import SearchBox from "../../../components/Searchbox";
import { useEffect, useState } from "react";
import useDebounce from "../../../hooks/useDebounce";
import { useDispatch, useSelector } from "react-redux";
import { getPatientList } from "../../../slices/patientSlice";
import { dobToAge } from "../../../utils/common";
import Skeleton from "../../../components/Skeleton";
import ProfileIcon from "../../../assets/svg/profile.svg?react";
import { searchTypeOptions } from "../helper";
import AntSearchableSelector from "../../../components/AntDesign/AntSearchableSelector";
import { cn } from "../../../lib/utils";
import Button from "../../../components/Buttons/Button";

const SearchBoxForPatient = ({
  setSelectedPatient = () => {},
  setSelectPatientDetails = () => {},
  showDataOnDropDown = false,
  setSearchForParent = () => {},
}) => {
  const [search, setSearch] = useState("");
  const [cursor, setCursor] = useState(0);
  const debouncedSearch = useDebounce(search, 500, true);
  const [searchBy, setSearchBy] = useState("all");
  const dispatch = useDispatch();
  const { getPatientListApi } = useSelector((state) => state.patientManagement);
  const { data: patientListData, isLoading: patientListLoading } =
    getPatientListApi;

  const patients =
    patientListData?.response?.list?.map((patient) => ({
      id: patient._id,
      ...patient,
    })) || [];

  const handleSelectPatient = (data) => {
    setSelectPatientDetails(data);
    setSelectedPatient(data.id);
    setSearch("");
  };

  let JSXForSearchBox;

  switch (true) {
    case patientListLoading:
      JSXForSearchBox = [...Array(5)].map((_, i) => (
        <div key={i} className="cursor-pointer flex flex-col gap-2 my-2">
          <Skeleton className="w-48 h-5" />
          <Skeleton className="w-64 h-3" />
        </div>
      ));
      break;

    case patients.length === 0:
      JSXForSearchBox = <div className="text-xl p-2">No results found</div>;
      break;

    default:
      JSXForSearchBox = patients.map((ele, i) => (
        <div
          key={ele.id}
          className={cn(
            "p-2 cursor-pointer hover:bg-gray-100",
            i === cursor && "bg-blue-50"
          )}
          onMouseEnter={() => setCursor(i)}
          onClick={() => handleSelectPatient(ele)}
        >
          <div className="flex items-center gap-1">
            <ProfileIcon className="h-6 w-6" />
            {
              <div className="flex capitalize gap-2 text-justify">
                <span className="text-blue-500 capitalize cursor-pointer break-all">
                  {ele.name}
                </span>
                <span className="text-blue/50">|</span>
                <span> {ele.gender},</span>
                <span className="text-blue/90">
                  {ele?.dateOfBirth &&
                    dobToAge(ele?.dateOfBirth).toString().concat("y")}
                </span>
              </div>
            }
          </div>
          <div>
            {
              <div className="flex text-xs text-zinc-500 gap-2">
                <span>+91{ele.phoneNo}</span>
                <span>/</span>
                <span className="break-all">{ele?.email || ``}</span>
              </div>
            }
          </div>
        </div>
      ));
      break;
  }

  const handleKeyType = (e) => {
    // Arrow down
    if (e.key === "ArrowDown" && cursor < patients.length - 1) {
      setCursor(cursor + 1);
    }
    // Arrow up
    else if (e.key === "ArrowUp" && cursor > 0) {
      setCursor(cursor - 1);
    }
    // Enter
    else if (
      e.key === "Enter" &&
      debouncedSearch.trim() &&
      patients.length > 0 &&
      patients[cursor]?.id
    ) {
      handleSelectPatient(patients[cursor]);
    }
  };

  useEffect(() => {
    if (debouncedSearch.trim()) {
      setSearchForParent(debouncedSearch.trim());
      dispatch(
        getPatientList({
          query: debouncedSearch.trim(),
          searchBy,
        })
      );
      setCursor(0);
    }
  }, [debouncedSearch, searchBy]);

  return (
    <div className="h-full w-full mt-2">
      <div className="flex gap-2 w-full justify-between">
        <AntSearchableSelector
          showSearch={false}
          name="searchby"
          value={searchBy}
          onChange={setSearchBy}
          options={searchTypeOptions}
          labelName="Search By"
          isCompressed
        />
        <SearchBox
          search={search}
          setSearch={setSearch}
          onKeyDown={handleKeyType}
          showData={!!search && showDataOnDropDown}
          dataJSX={JSXForSearchBox}
          placeholder="Search Patients"
          extraClass="w-[75%]"
          isCompressed
        />
        <Button
          variant="light"
          className="rounded-lg h-10 2xl:h-10"
          onClick={() => {
            setSearchBy("all");
            setSearch("");
          }}
        >
          Reset
        </Button>
      </div>
    </div>
  );
};

export default SearchBoxForPatient;
