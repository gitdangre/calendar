import React, { useState, useEffect } from "react";
import moment from "moment";
// import Moment from "react-moment";
import "./App.css";
import data from "./data";
import { buildCalendar, isoToUnixTimestamp } from "./helpers";
import CalendarMap from "./CalendarMap";
import Header from "./Header";

const Calendar = () => {
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
      //filter data that is contained anywhere in current month, either the start date, end date, or just passing through
      if (dateObj1 >= startDay && dateObj1 <= endDay) return true;
      if (dateObj2 >= startDay && dateObj2 <= endDay) return true;
      if (dateObj1 <= startDay && dateObj2 >= endDay) return true;
      return false;
    });
    setCalendarData(filteredData);
  }, [currentDate]);

  return (
    <>
      <Header setCurrentDate={setCurrentDate} currentDate={currentDate} />
      <CalendarMap
        calendar={calendar}
        calendarData={calendarData}
        currentDate={currentDate}
        setSelectedDate={setSelectedDate}
      />
      <pre>{JSON.stringify(selectedDate, 0, 3)}</pre>
      <pre>{JSON.stringify(calendarData, 0, 3)}</pre>
    </>
  );
};
export default Calendar;
