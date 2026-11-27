import { useParams } from "react-router-dom";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import TableHeader from "../../../components/table/TableHeader";
import TabSwitcher from "../../../components/TabSwitcher";
import VerticalLine from "../../../components/lines/VerticalLine";
import LineChart from "../../../components/chart/LineChart";
import VitalTrendsSkeleton from "../loader/VitalTrendsSkeleton";
import { EmptyData } from "../../../components/EmptyData";

import { tabs } from "../helper";
import { getPatientVitalsList } from "../../../slices/patientSlice";
import { formatDate } from "../../../utils/dateAndTime";
import Pagination from "../../../components/Pagination";
import AntSearchableSelector from "../../../components/AntDesign/AntSearchableSelector";
import { ROUTES } from "../../../routes/helper";

// Table header data
const headerData = [
  "Date",
  "Temperature",
  "Height",
  "Weight",
  "BMI",
  "Pulse",
  "BP",
  "BS PP",
  "SPO2",
  "BSF",
  "RBS",
  "Respiration Rate",
].map((name) => ({ name, value: name }));

const vitalFields = [
  "temperature",
  "height",
  "weight",
  "bmi",
  "pulse",
  "bp",
  "bspp",
  "spo2",
  "bsf",
  "rbs",
  "respirationRate",
];

const options = [
  { value: "temperature", label: "Temperature", unit: "°F" },
  { value: "height", label: "Height", unit: "cm" },
  { value: "weight", label: "Weight", unit: "kg" },
  { value: "bmi", label: "BMI", unit: "kg/m²" },
  { value: "pulse", label: "Pulse", unit: "bpm" },
  { value: "bp", label: "Blood Pressure", unit: "mmHg" },
  { value: "bspp", label: "Blood Sugar PP", unit: "mg/dL" },
  { value: "spo2", label: "SPO2", unit: "%" },
  { value: "bsf", label: "BSF", unit: "mg/dL" },
  { value: "rbs", label: "RBS", unit: "mg/dL" },
  { value: "respirationRate", label: "Respiration Rate", unit: "breaths/min" },
];

const VitalTrends = () => {
  const { patientId } = useParams();
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [trend, setTrend] = useState("temperature");

  const { data, isLoading } = useSelector(
    (state) => state.patientManagement.patientVitalsListApi
  );

  const {
    list = [],
    totalPages = 1,
    totalRecords = 0,
    pageLimit = 1,
  } = data?.response || {};
  console.log({ headerData });

  const filteredList = useMemo(
    () =>
      list.filter((vital) =>
        vitalFields.some((field) => {
          const value = vital[field];
          // For BP (blood pressure), which may be a string like "120/80", you may want to check differently.
          if (field === "bp") return value && value !== "0" && value !== "-";
          return Number(value) > 0;
        })
      ),
    [list]
  );

  // Fetch vitals on mount or patientId change
  useEffect(() => {
    if (patientId)
      dispatch(getPatientVitalsList({ patientId, page: currentPage }));
  }, [dispatch, patientId, currentPage]);

  const tableRows = useMemo(() => {
    return filteredList.map((vital, index) => (
      <div
        key={index}
        className="grid grid-cols-12 items-center justify-between py-2 px-4 border-b border-light-blue"
      >
        {[
          formatDate(vital.createdAt, "MMMM do yyyy h:mm a"),
          vital.temperature,
          vital.height,
          vital.weight,
          vital.bmi,
          vital.pulse,
          vital.bp,
          vital.bspp,
          vital.spo2,
          vital.bsf,
          vital.rbs,
          vital.respirationRate,
        ].map((val, i) => (
          <div key={i} className="col-span-1 flex items-center gap-2">
            <span className="text-center w-full text-sm">{val || "-"}</span>
            {i < 11 && <VerticalLine />}
          </div>
        ))}
      </div>
    ));
  }, [filteredList]);

  const chartData = useMemo(
    () =>
      filteredList.map((item) => ({
        date: formatDate(item.createdAt, "MMMM do, HH:mm"),
        trend: item[trend] || 0,
      })),
    [filteredList, trend]
  );

  const currentSelectOption = useMemo(
    () => options.find((opt) => opt.value === trend),
    [trend]
  );

  const formatChartData = useCallback(
    (value) => `${value}${currentSelectOption?.unit || ""}`,
    [currentSelectOption]
  );

  if (isLoading) {
    return (
      <div className="page">
        <TabSwitcher tabs={tabs} selected={3} id={patientId} />
        <VitalTrendsSkeleton />
      </div>
    );
  }

  if (!list.length) {
    return (
      <div className="page">
        <TabSwitcher tabs={tabs} selected={3} id={patientId} />
        <EmptyData
          from="vitalTrends"
          redirectTo={`${ROUTES.PATIENT_BASIC_DETAIL}/${patientId}`}
        />
      </div>
    );
  }

  // --- Main content ---
  return (
    <div className="page">
      <TabSwitcher tabs={tabs} selected={3} id={patientId} />
      {/* Table */}
      <div className="border border-light-blue rounded-lg">
        <TableHeader
          data={headerData}
          isCompressView
          extraClass="text-xs text-center"
        />
        <div className="overflow-x-scroll text-blue text-xs border-t border-light-blue">
          {tableRows}
        </div>
      </div>

      <div>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalRecords={totalRecords}
          pageLimit={pageLimit}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>
      {/* Chart */}
      <div className="max-w-64">
        <AntSearchableSelector
          id="temperature-trends"
          showSearch={true}
          name="Select Trend"
          labelName="Select Trend"
          options={options}
          defaultValue="temperature"
          value={trend}
          onChange={(value) => setTrend(value)}
        />
      </div>
      <div className="border border-light-blue rounded-lg px-4">
        <h3 className="m-4 text-xl text-blue">
          {currentSelectOption?.label} Trends
        </h3>

        <LineChart
          data={chartData}
          XAxisDataKey="date"
          AreaDataKey="trend"
          formatter={formatChartData}
          tickFormatter={formatChartData}
        />
      </div>
    </div>
  );
};

export default VitalTrends;
