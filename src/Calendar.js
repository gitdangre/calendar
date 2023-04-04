import React, { useState, useEffect } from "react";
import moment from "moment";
// import Moment from "react-moment";
import "./App.css";
import buildCalendar from "./build";
import data from "./data";
// import dayStyles from "./styles";

const utcToMMDDYYYY = (unixTimestamp, format) => {
  const dateObj = new Date(unixTimestamp * 1000); // Multiply by 1000 to convert seconds to milliseconds
  const uday = ("0" + dateObj.getDate()).slice(-2);
  const umonth = ("0" + (dateObj.getMonth() + 1)).slice(-2); // Add 1 since umonths are zero-indexed
  const uyear = dateObj.getFullYear();
  const formattedDate = `${umonth}/${uday}/${uyear}`;

  if (format === "full") return formattedDate; // Outputs "MM/DD/YYYY" format
  if (format === "day") return uday;
  if (format === "month") return umonth;
  if (format === "year") return uyear;
};

const daysBetweenUtc = (unixTimestamp1, unixTimestamp2) => {
  // Convert the timestamps to JavaScript Date objects
  const dateObj1 = new Date(unixTimestamp1 * 1000);
  const dateObj2 = new Date(unixTimestamp2 * 1000);

  // Calculate the time difference in milliseconds
  const millisecondsDifference = Math.abs(dateObj2 - dateObj1);

  // Convert the milliseconds difference to days
  const daysDifference = millisecondsDifference / (1000 * 60 * 60 * 24);

  return Math.round(daysDifference) + 1;
};

const mmddyyyToUnixTimestamp = (inputDate) => {
  // Parse the date string to a JavaScript Date object
  const dateObj = new Date(inputDate);

  // Get the number of milliseconds since the Unix epoch
  const millisecondsSinceEpoch = dateObj.getTime();

  // Convert the milliseconds to a Unix timestamp (in seconds)
  const unixTimestamp = Math.floor(millisecondsSinceEpoch / 1000);

  return unixTimestamp;
};

const isoToUnixTimestamp = (iso) => {
  return Math.floor(new Date(iso).getTime() / 1000); //ISO8601 to unixTimestamp
};

const ResponsiveCalendar = () => {
  const [calendarData, setCalendarData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(false);
  const [currentDate, setCurrentDate] = useState(moment());
  const [calendar, setCalendar] = useState([]);

  useEffect(() => {
    setCalendar(buildCalendar(currentDate));
    const startDay = isoToUnixTimestamp(
      currentDate.clone().startOf("month").startOf("week")
    );
    const endDay = isoToUnixTimestamp(
      currentDate.clone().endOf("month").endOf("week")
    );
    const filteredData = data.filter((d) => {
      const dateObj1 = new Date(d.startDT);
      const dateObj2 = new Date(d.endDT);
      //filter data that is contained anywhere in current month, either the start date or the end date
      if (dateObj1 >= startDay && dateObj1 <= endDay) return true;
      if (dateObj2 >= startDay && dateObj2 <= endDay) return true;
      if (dateObj1 <= startDay && dateObj2 >= endDay) return true;
      return false;
    });
    setCalendarData(filteredData);
  }, [currentDate]);

  const selectedMonthName = () => {
    return currentDate.format("MMMM");
  };

  const selectedYear = () => {
    return currentDate.format("YYYY");
  };

  const prevMonth = () => {
    return currentDate.clone().subtract(1, "month");
  };

  const nextMonth = () => {
    return currentDate.clone().add(1, "month");
  };

  return (
    <>
      <div className="header">
        <button
          className="header-prev"
          onClick={() => setCurrentDate(prevMonth())}
        >
          {`< PREV`}
        </button>
        <button
          className="header-curr"
          onClick={() => setCurrentDate(moment())}
        >
          NOW
        </button>
        <button
          className="header-next"
          onClick={() => setCurrentDate(nextMonth())}
        >
          {`NEXT >`}
        </button>
        <div className="header-display">
          {selectedMonthName()} {selectedYear()}
        </div>
      </div>
      <div className="month">
        {calendar.map((week, weeki) => {
          const startWeek = isoToUnixTimestamp(week[0]._d);
          const endWeek = isoToUnixTimestamp(week[6]._d);

          const weeklyData = calendarData
            .filter((d) => {
              const startDate = new Date(d.startDT);
              const endDate = new Date(d.endDT);
              //filter data that is contained anywhere in current month, either the start date or the end date
              if (startDate >= startWeek && startDate <= endWeek) return true;
              if (endDate >= startWeek && endDate <= endWeek) return true;
              if (startDate <= startWeek && endDate >= endWeek) return true;
              return false;
            })
            .map((fd, fdi) => {
              const startDate = fd.startDT;
              const endDate = fd.endDT;
              const pctOfWeek = 14.285;
              let startPos = -1;
              let divWidth = pctOfWeek * 1;

              week.forEach((dow, dowi) => {
                const dowToUT = isoToUnixTimestamp(dow);
                // console.log(dowToUT, startDate);
                if (startDate < startWeek && endDate >= dowToUT) {
                  //if extends throughout the week
                  startPos = 0;
                  divWidth = pctOfWeek * dowi + pctOfWeek;
                } else if (startDate === dowToUT && endDate >= endWeek) {
                  //if starts in week and extends to end of week or beyond
                  startPos = pctOfWeek * dowi;
                  divWidth = pctOfWeek * (7 - dowi);
                } else if (startDate === dowToUT && endDate < endWeek) {
                  //if contained within the week
                  startPos = pctOfWeek * dowi;
                  divWidth = pctOfWeek * daysBetweenUtc(startDate, endDate);
                }
              });

              return (
                <div key={fdi}>
                  {startPos >= 0 && divWidth >= 0 && (
                    <div
                      className="test"
                      style={{
                        top: 20 * (fdi + 1),
                        left: `${startPos}%`,
                        width: `${divWidth}%`,
                        background: fd.color,
                      }}
                    >
                      {fd.title}
                      {`  ${utcToMMDDYYYY(
                        fd.startDT,
                        "full"
                      )} to ${utcToMMDDYYYY(fd.endDT, "full")}`}
                    </div>
                  )}
                </div>
              );
            });

          // console.log(weeklyData);
          return (
            <div className="week" key={weeki}>
              {weeklyData}

              {week.map((day, i) => {
                return (
                  <div
                    className="day"
                    style={{
                      background:
                        !currentDate.isSame(day, "month") &&
                        "rgba(0, 0, 0, 0.1)",
                    }}
                    key={i}
                  >
                    {/* <div className={dayStyles(day, selectedDate)}> */}
                    <div
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        const formatDay = new Date(day);
                        setSelectedDate(formatDay);
                      }}
                    >
                      <span
                        style={{
                          fontWeight:
                            day.isSame(new Date(), "day") &&
                            currentDate.isSame(day, "month")
                              ? "bold"
                              : "",
                        }}
                      >
                        {day.format("D")}{" "}
                        {/* {mmddyyyToUnixTimestamp(day.format("MM/DD/YYYY"))} */}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
      <pre>{JSON.stringify(selectedDate, 0, 3)}</pre>
      {/* <pre>{JSON.stringify(calendarData, 0, 3)}</pre> */}
    </>
  );
};
export default ResponsiveCalendar;
