import TableHeader from "../../../components/table/TableHeader";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Forbidden from "../../../assets/svg/forbidden.svg?react";
import SelectTimeButton from "./SelectTimeButton";
import TimePopup from "./TimePopup";
import {
  addRoasterTiming,
  resetLeaveCreation,
  resetScheduleCreation,
  scheduleBreak,
} from "../../../slices/roasterSlice";
import {
  multipleErrorToastMessage,
  toastMessage,
} from "../../../utils/toastMessage";
import { formatTimeToAMPM } from "../../../utils/dateAndTime";
import ScheduleBreakModal from "./ScheduleBreakModal";
import WeekyCalenderLoader from "../loader/WeekyCalenderLoader";

const headerData = [
  {
    name: "Doctor Name",
    value: "name",
    _class: "col-span-3",
  },
  {
    name: "Monday",
    value: "Monday",
  },
  {
    name: "Tuesday",
    value: "Tuesday",
  },
  {
    name: "Wednesday",
    value: "wednesday",
  },
  {
    name: "Thursday",
    value: "Thursday",
  },
  {
    name: "Friday",
    value: "Friday",
  },
  {
    name: "Saturday",
    value: "Saturday",
  },
  {
    name: "Sunday",
    value: "Sunday",
  },
];

const WeeklyCalendar = ({
  roasterList,
  isListLoading,
  getRoasterList,
  isViewOnly,
}) => {
  const [popupOpen, setPopupOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [initialTiming, setInitialTiming] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const [breakPopupOpen, setBreakPopupOpen] = useState(false);

  const { addRoasterTimingApi, scheduleBreakApi } = useSelector(
    (state) => state.roaster
  );

  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const dispatch = useDispatch();

  useEffect(() => {
    if (addRoasterTimingApi && addRoasterTimingApi.status === "success") {
      getRoasterList();
      toastMessage(addRoasterTimingApi);
      handleClosePopup();
      dispatch(resetScheduleCreation());
    } else if (addRoasterTimingApi && addRoasterTimingApi.status === "failed") {
      multipleErrorToastMessage(addRoasterTimingApi);
    }
  }, [addRoasterTimingApi, dispatch]);

  const handleSelectTime = (doctor, day, initialTiming) => {
    setSelectedDoctor(doctor);
    setSelectedDay(day);
    setInitialTiming(initialTiming);
    setPopupOpen(true);
  };

  const handleClosePopup = () => {
    setPopupOpen(false);
    setSelectedDoctor(null);
    setInitialTiming(null);
    setSelectedDay(null);
    setBreakPopupOpen(false);
  };

  const handleSubmitTime = async (timing) => {
    dispatch(
      addRoasterTiming({
        staffId: selectedDoctor.userId,
        day: selectedDay,
        timing,
        onLeave: false,
      })
    );
  };

  const handleScheduleBreak = (doctor) => {
    setSelectedDoctor(doctor);
    setBreakPopupOpen(true);
  };

  const handleBreakSubmit = async (data) => {
    dispatch(
      scheduleBreak({
        staffId: selectedDoctor.userId,
        onLeave: data.onLeave,
        date: data.date,
        timing: data.timing,
      })
    );
  };

  useEffect(() => {
    if (scheduleBreakApi && scheduleBreakApi.status === "success") {
      getRoasterList();
      toastMessage(scheduleBreakApi);
      handleClosePopup();
      dispatch(resetLeaveCreation());
    } else if (scheduleBreakApi && scheduleBreakApi.status === "failed") {
      multipleErrorToastMessage(scheduleBreakApi);
    }
  }, [scheduleBreakApi, dispatch]);

  return (
    <div className="overflow-x-auto border border-light-blue rounded-lg">
      <TableHeader data={headerData} />
      {isListLoading ? (
        <WeekyCalenderLoader />
      ) : (
        roasterList?.map((doctor) => {
          const scheduleMap = {};
          doctor.roasterData.forEach((item) => {
            scheduleMap[item.day] = item;
          });

          return (
            <div
              key={doctor.userId}
              className="grid grid-cols-12 border-b border-light-blue hover:bg-gray-50 transition"
            >
              {/* Doctor info */}
              <div className="col-span-3 p-4 flex flex-col justify-center">
                <span className="font-medium text-blue">
                  {doctor.name || "Unknown Doctor"}
                </span>
                {!isViewOnly ? (
                  <button
                    disabled={isViewOnly}
                    className="text-xs text-[#0B4B81] hover:underline mt-1 text-left inline-flex hover:cursor-pointer"
                    onClick={() => handleScheduleBreak(doctor)}
                  >
                    <Forbidden /> <span className="ml-1">Schedule Break</span>
                  </button>
                ) : null}
              </div>

              {/* Weekly day cells */}
              {days.map((day) => {
                const dayData = scheduleMap[day];
                const isWeekend = day === "Saturday" || day === "Sunday";
                let leaveDataForDay = null;
                if (doctor.leaveData && doctor.leaveData.length > 0) {
                  leaveDataForDay = doctor.leaveData.find((ld) => {
                    const leaveDate = new Date(ld.date);
                    const weekDay = [
                      "Sunday",
                      "Monday",
                      "Tuesday",
                      "Wednesday",
                      "Thursday",
                      "Friday",
                      "Saturday",
                    ][leaveDate.getDay()];
                    return weekDay === day;
                  });
                }

                // Helper to pair timings
                const pairTimings = (timingArr) =>
                  timingArr.reduce((acc, time, idx, arr) => {
                    if (idx % 2 === 0 && arr[idx + 1])
                      acc.push([time, arr[idx + 1]]);
                    return acc;
                  }, []);

                // If leaveData exists and has timing, show both leave and available
                if (
                  leaveDataForDay &&
                  leaveDataForDay.timing.length &&
                  dayData &&
                  dayData.timing.length
                ) {
                  const leavePairs = pairTimings(leaveDataForDay.timing);
                  const availablePairs = [];

                  // Find available slots by subtracting leave from roaster
                  // let lastEnd = "00:00";
                  leavePairs.forEach(([leaveStart, leaveEnd], idx) => {
                    // Find available before leave
                    if (idx === 0 && leaveStart > dayData.timing[0]) {
                      availablePairs.push([dayData.timing[0], leaveStart]);
                    }
                    // Find available after leave
                    if (
                      idx === leavePairs.length - 1 &&
                      leaveEnd < dayData.timing[dayData.timing.length - 1]
                    ) {
                      availablePairs.push([
                        leaveEnd,
                        dayData.timing[dayData.timing.length - 1],
                      ]);
                    }
                  });

                  return (
                    <div
                      key={day}
                      className="p-2 flex flex-col items-center justify-center text-center last:border-r-0 min-h-[56px]"
                      style={{ flex: `0 0 ${100 / 7}%` }}
                    >
                      {/* Leave timings in red */}
                      {leavePairs.map(([start, end], idx) => (
                        <div
                          key={`leave-${idx}`}
                          className="bg-red-100 text-red-700 rounded p-1 text-sm w-full mb-1 last:mb-0 inline-flex"
                        >
                          {formatTimeToAMPM(start)} - {formatTimeToAMPM(end)}
                        </div>
                      ))}
                      {/* Available timings in blue/green */}
                      {availablePairs.map(([start, end], idx) => (
                        <button
                          key={`avail-${idx}`}
                          disabled={isViewOnly}
                          className="bg-[#00AC001A] text-blue rounded p-1 text-sm w-full mb-1 last:mb-0 inline-flex"
                          onClick={() =>
                            handleSelectTime(doctor, day, dayData.timing)
                          }
                        >
                          {formatTimeToAMPM(start)} - {formatTimeToAMPM(end)}
                        </button>
                      ))}
                    </div>
                  );
                }

                // If leave for whole day
                if (
                  leaveDataForDay &&
                  leaveDataForDay.onLeave &&
                  (!leaveDataForDay.timing || !leaveDataForDay.timing.length)
                ) {
                  return (
                    <div
                      key={day}
                      className=" p-2 flex flex-col items-center justify-center text-center last:border-r-0 min-h-[56px]"
                      style={{ flex: `0 0 ${100 / 7}%` }}
                    >
                      <span className="bg-yellow-100 text-yellow-800 rounded-md px-3 py-2 text-sm font-medium">
                        On leave
                      </span>
                    </div>
                  );
                }

                // If only leaveData with partial leave
                if (leaveDataForDay && leaveDataForDay.timing.length) {
                  const leavePairs = pairTimings(leaveDataForDay.timing);
                  return (
                    <div
                      key={day}
                      className=" p-2 flex flex-col items-center justify-center text-center last:border-r-0 min-h-[56px]"
                      style={{ flex: `0 0 ${100 / 7}%` }}
                    >
                      {leavePairs.map(([start, end], idx) => (
                        <div
                          key={idx}
                          className="bg-red-100 text-red-700 rounded p-1 text-sm w-full mb-1 last:mb-0 inline-flex"
                        >
                          On leave: {formatTimeToAMPM(start)} -{" "}
                          {formatTimeToAMPM(end)}
                        </div>
                      ))}
                    </div>
                  );
                }

                // Default: show roasterData or week off
                return (
                  <div
                    key={day}
                    className="p-2 flex flex-col items-center justify-center text-center last:border-r-0 min-h-[56px]"
                    style={{ flex: `0 0 ${100 / 7}%` }}
                  >
                    {dayData ? (
                      dayData.onLeave ? (
                        <span className="bg-yellow-100 text-yellow-800 rounded-full px-2 py-1 text-xs font-medium">
                          On leave
                        </span>
                      ) : dayData.timing.length ? (
                        pairTimings(dayData.timing).map(([start, end], idx) => (
                          <button
                            key={idx}
                            disabled={isViewOnly}
                            className="bg-[#00AC001A] rounded p-1 text-blue text-sm w-full mb-1 last:mb-0 inline-flex cursor-pointer disabled:cursor-not-allowed"
                            onClick={() =>
                              handleSelectTime(doctor, day, dayData.timing)
                            }
                          >
                            {formatTimeToAMPM(start)} - {formatTimeToAMPM(end)}
                          </button>
                        ))
                      ) : (
                        <SelectTimeButton
                          onClick={() => handleSelectTime(doctor, day)}
                          isViewOnly={isViewOnly}
                        />
                      )
                    ) : (
                      <SelectTimeButton
                        onClick={() => handleSelectTime(doctor, day)}
                        isViewOnly={isViewOnly}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          );
        })
      )}
      {popupOpen && (
        <TimePopup
          doctor={selectedDoctor}
          day={selectedDay}
          initialTiming={initialTiming}
          onClose={handleClosePopup}
          onSubmit={handleSubmitTime}
        />
      )}
      {breakPopupOpen && (
        <ScheduleBreakModal
          doctor={selectedDoctor}
          open={breakPopupOpen}
          onClose={() => setBreakPopupOpen(false)}
          onSubmit={handleBreakSubmit}
        />
      )}
    </div>
  );
};

export default WeeklyCalendar;
