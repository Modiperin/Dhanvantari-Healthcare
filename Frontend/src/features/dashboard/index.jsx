import { useEffect, useState } from "react";
import ArrowUpIcon from "../../assets/svg/arrow-up.svg?react";
import MaleSybolIcon from "../../assets/svg/male.svg?react";
import PieChartComponent from "../../components/chart/PieChart";
import FemaleSymbolIcon from "../../components/svgs/Female";
import { useDispatch, useSelector } from "react-redux";
import {
  getDashboardCard,
  getRecentPatientList,
} from "../../slices/dashboardSlice";
import { formatDate } from "../../utils/dateAndTime";
import DashboardCardSkeleton from "./loader/DashboardCardSkeleton";
import DashboardChartListSkeleton from "./loader/DashboardChartListSkeleton";
import { EmptyData } from "../../components/EmptyData";
import DateRangeFilter from "../../components/DateRangeFilter";
import useCooldown from "../../hooks/useCooldown";
import RefreshButton from "../../components/Buttons/RefreshButton";

const Dashboard = () => {
  const dispatch = useDispatch();
  const [dateRange, setDateRange] = useState([
    new Date().toLocaleDateString("en-GB"),
    new Date().toLocaleDateString("en-GB"),
  ]);
  const [refreshCooldown, triggerRefreshCooldown] = useCooldown(2000);
  // console.log("dateRange", dateRange);

  const handleRefreshQueue = () => {
    dispatch(
      getDashboardCard({ startDate: dateRange?.[0], endDate: dateRange?.[1] })
    );
    triggerRefreshCooldown();
    dispatch(getRecentPatientList());
  };

  useEffect(() => {
    dispatch(
      getDashboardCard({ startDate: dateRange?.[0], endDate: dateRange?.[1] })
    );
  }, [dateRange]);
  useEffect(() => {
    dispatch(getRecentPatientList());
  }, []);

  const dashboardData = useSelector((state) => state.dashboard.dashboardCart);
  const recentPatientsData = useSelector(
    (state) => state.dashboard.recentPatientsApi
  );
  const isCardsLoading = dashboardData?.isLoading;
  const isRecentPatientsLoading = recentPatientsData?.isLoading;

  const {
    totalRegisteredPatient = 0,
    emergencyCase = 0,
    normalCase = 0,
    VIPCase = 0,
    femaleVitalRate = "0.00",
    maleVitalRate = "0.00",
    vitalRate = "0.00",
    appointmentCount = [],
  } = dashboardData?.data?.response || {};

  const recentPatientList =
    recentPatientsData?.data?.response?.recentPatient || [];
  const topDiagnosis = recentPatientsData?.data?.response?.topDiagnosis || [];
  const topMedications =
    recentPatientsData?.data?.response?.topMedications || [];
  const topChiefComplaints =
    recentPatientsData?.data?.response?.topChiefComplaints || [];

  return (
    <div className="page">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold text-blue">Dashboard</h1>
        <div className="flex items-center gap-2">
          <RefreshButton
            onClick={handleRefreshQueue}
            loading={
              isCardsLoading || isRecentPatientsLoading || refreshCooldown
            }
            cooldown={3000}
            disabled={
              isCardsLoading || isRecentPatientsLoading || refreshCooldown
            }
            content="Refresh Dashboard"
          />
          <DateRangeFilter handleDateSelection={(date) => setDateRange(date)} />
        </div>
      </div>
      {/* Dashboard Carts */}
      {isCardsLoading ? (
        <DashboardCardSkeleton />
      ) : (
        <>
          <div className="grid text-blue grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Registrations */}
            <div className="border flex flex-col justify-between border-light-blue p-6 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-2">
                  <p>
                    {dateRange.length && dateRange[0] === dateRange[1]
                      ? "Today's Registrations"
                      : "Registrations"}
                  </p>
                  <p className="text-5xl font-semibold">
                    {totalRegisteredPatient}
                  </p>
                </div>
                <div>
                  <div className="p-2 bg-light-blue rounded-full">
                    <ArrowUpIcon />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 xl:grid-cols-3 gap-2 place-items-center items-center justify-between mt-4">
                <div className="text-xs bg-red-200 rounded-lg px-2 py-1 text-red-800 w-full text-center text-nowrap">
                  Emergency Case: {emergencyCase}
                </div>
                <div className="text-xs bg-green-200 rounded-lg px-2 py-1 text-green-800 w-full text-center text-nowrap">
                  Normal Case: {normalCase}
                </div>
                <div className="text-xs bg-purple-200 rounded-lg px-2 py-1 text-purple-800 w-full text-center flex-nowrap">
                  VIP Case: {VIPCase}
                </div>
              </div>
            </div>

            {/* Vital Record */}
            <div className="border  border-light-blue p-6 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-2">
                  <p>
                    {dateRange.length && dateRange[0] === dateRange[1]
                      ? "Today's Vital Records"
                      : "Vital Records"}
                  </p>
                  <p className="text-5xl font-semibold">{vitalRate} %</p>
                  <p>of patients recorded</p>
                </div>
                <div>
                  <div className="p-2 bg-light-blue rounded-full">
                    <ArrowUpIcon />
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <p className="text-sm font-semibold mb-1">Vitals by Gender</p>
                <div className="grid grid-cols-2 xl:grid-cols-3 gap-2">
                  <div className="flex text-xs items-center gap-1 bg-blue-100 rounded-lg px-2 py-1 w-full justify-center text-nowrap">
                    <MaleSybolIcon />
                    <div>Male: {maleVitalRate} %</div>
                  </div>
                  <div className="flex text-xs items-center gap-1 bg-pink-200 rounded-lg px-2 py-1 w-full justify-center text-nowrap">
                    <FemaleSymbolIcon className="w-2 h-2" color="#B73377" />
                    <div>Female: {femaleVitalRate} %</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Appointments */}
            <div className="border flex flex-col justify-between border-light-blue p-6 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-2">
                  <p>
                    {dateRange.length && dateRange[0] === dateRange[1]
                      ? "Today's Appointments"
                      : "Appointments"}
                  </p>
                  <p className="text-5xl font-semibold">
                    {appointmentCount?.total || 0}
                  </p>
                </div>
                <div>
                  <div className="p-2 bg-light-blue rounded-full">
                    <ArrowUpIcon />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 xl:grid-cols-3 gap-2 mt-4">
                <div className="text-xs bg-yellow-200 rounded-lg px-2 py-1 text-yellow-800 w-full text-center">
                  Booked: {appointmentCount?.booked || 0}
                </div>
                <div className="text-xs bg-green-200 rounded-lg px-2 py-1 text-green-800 w-full text-center">
                  Completed: {appointmentCount?.completed || 0}
                </div>
                <div className="text-xs bg-red-200 rounded-lg px-1 py-1 text-red-800 w-full text-center">
                  Cancelled: {appointmentCount?.cancelled || 0}
                </div>
                <div className="text-xs bg-yellow-200 rounded-lg px-1 py-1 text-yellow-800 w-full text-center">
                  Rescheduled: {appointmentCount?.rescheduled || 0}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* CHART AND LIST */}
      {isRecentPatientsLoading ? (
        <DashboardChartListSkeleton />
      ) : (
        <div className="grid grid-cols-12 justify-between gap-4">
          <div className="text-blue col-span-6 flex flex-col gap-2 p-4 border border-light-blue rounded-lg">
            <p>Most Dispensed Medicines</p>
            <div className="flex flex-col xl:flex-row items-center">
              <PieChartComponent data={topMedications} />
              <div className="space-y-3">
                {topMedications.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-[#0b3558] font-medium break-words whitespace-normal max-w-[200px]">
                      {item.name}
                    </span>
                    <span className="ml-auto text-[#0b3558] font-semibold">
                      {item.value}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="text-blue col-span-6 flex flex-col gap-2 p-4 border border-light-blue rounded-lg">
            <p>Recent Returning Patients</p>
            <div className="flex text-sm p-2 flex-col gap-2">
              {recentPatientList.length ? (
                recentPatientList.map((patient, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-3 gap-1 p-2 border border-light-blue rounded-lg"
                  >
                    <span>{patient.name}</span>
                    <span>Department</span>
                    <span>{patient.phoneNo || "-"}</span>
                    <span>Last Visit: {formatDate(patient.lastVisit)}</span>
                    <span className="text-sm">
                      {patient?.departmentDetails?.name || "-"}
                    </span>
                    <div className="flex">
                      <span className="bg-light-blue px-2 flex py-1 text-xs rounded-lg">
                        {patient.totalVisitCount} Visits
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <EmptyData from="dashboardPatient" />
              )}
            </div>
          </div>

          <div className="text-blue col-span-6 flex flex-col gap-2 p-4 border border-light-blue rounded-lg">
            <p>Most Common Diagnoses</p>
            <div className="flex flex-col xl:flex-row items-center">
              <PieChartComponent data={topDiagnosis} />
              <div className="space-y-3">
                {topDiagnosis.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <div className="text-[#0b3558] font-medium break-words whitespace-normal max-w-[200px]">
                      <p>{item.name}</p>
                    </div>
                    <span className="ml-auto justify-center items-center text-[#0b3558] font-semibold">
                      {item.value}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="text-blue col-span-6 flex flex-col gap-2 p-4 border border-light-blue rounded-lg">
            <p>Most Common Chief Complaints</p>
            <div className="flex flex-col xl:flex-row text-sm items-center">
              <PieChartComponent data={topChiefComplaints} />
              <div className="space-y-3">
                {topChiefComplaints?.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-[#0b3558] font-medium">
                      {item.name}
                    </span>
                    <span className="ml-auto text-[#0b3558] font-semibold">
                      {item.value}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
