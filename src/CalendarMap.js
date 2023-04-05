import React from "react";

import {
  daysBetweenUtc,
  utcToMMDDYYYY,
  mmddyyyToUnixTimestamp,
  isoToUnixTimestamp,
} from "./helpers";

const CalendarMap = (props) => {
  const { calendar, calendarData, currentDate, setSelectedDate } = props;

  const recurse = (weeklyData) => {
    const weeklyDataClone = weeklyData;
    // let shouldLoop = false;
    weeklyDataClone.forEach((d, i) => {
      // console.log(i, d.id);
      for (let weekRow = 0; weekRow < 12; weekRow++) {
        const dataFilter = weeklyDataClone.filter((filteredData) => {
          if (
            filteredData.step === weekRow &&
            filteredData.weekEnd >= d.weekStart
          )
            return true;
          return false;
        });
        // console.log("data filter", dataFilter);
        if (dataFilter.length === 0) {
          weeklyDataClone[i] = { ...weeklyDataClone[i], step: weekRow };
          break;
        }
      }
    });
    return weeklyDataClone;
  };

  return (
    <div className="month">
      {calendar.map((week, weeki) => {
        const startWeek = isoToUnixTimestamp(week[0]._d);
        const endWeek = isoToUnixTimestamp(week[6]._d);

        const weeklyData = calendarData.filter((d) => {
          const startDate = new Date(d.startDT);
          const endDate = new Date(d.endDT);
          //filter data that is contained anywhere in current month, either the start date or the end date
          if (startDate >= startWeek && startDate <= endWeek) return true;
          if (endDate >= startWeek && endDate <= endWeek) return true;
          if (startDate <= startWeek && endDate >= endWeek) return true;
          return false;
        });

        weeklyData.sort((a, b) => a.startDT - b.startDT);

        weeklyData.forEach((w, wi) => {
          const length = daysBetweenUtc(w.startDT, w.endDT);
          let weekStart;
          let weekEnd;
          week.forEach((day, dayi) => {
            const dayToUT = isoToUnixTimestamp(day);
            if (w.startDT < startWeek) weekStart = 0;
            else if (w.startDT === dayToUT) weekStart = dayi;
            if (w.endDT > endWeek) weekEnd = 6;
            else if (w.endDT === dayToUT) weekEnd = dayi;
          });
          weeklyData[wi] = {
            ...weeklyData[wi],
            length: length,
            weekStart: weekStart,
            weekEnd: weekEnd,
            weekLength: weekEnd - weekStart + 1,
            step: -1,
          };
        });

        const reorderedWeeklyData = recurse(weeklyData);

        // console.log(reorderedWeeklyData);

        const displayWeek = reorderedWeeklyData.map((fd, fdi) => {
          const pctOfWeek = 14.285;
          return (
            <div key={fdi}>
              <div
                className="test"
                style={{
                  top: 20 * (fd.step + 1),
                  left: `${fd.weekStart * pctOfWeek}%`,
                  width: `${pctOfWeek * fd.weekLength}%`,
                  background: fd.color,
                }}
              >
                {`${fd.id} ${fd.step} ${utcToMMDDYYYY(
                  fd.startDT,
                  "mmdd"
                )} to ${utcToMMDDYYYY(fd.endDT, "mmdd")}`}
              </div>
            </div>
          );
        });

        // console.log(weeklyData);
        return (
          <div className="week" key={weeki}>
            {displayWeek}

            {week.map((day, i) => {
              return (
                <div
                  className="day"
                  style={{
                    background:
                      !currentDate.isSame(day, "month") && "rgba(0, 0, 0, 0.1)",
                  }}
                  key={i}
                >
                  <div
                    style={{
                      cursor: "pointer",
                    }}
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
                      {day.format("D")}
                      {` ${mmddyyyToUnixTimestamp(day.format("MM/DD/YYYY"))}`}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

export default CalendarMap;
