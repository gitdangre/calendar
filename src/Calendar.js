import React, { useState, useEffect } from "react";
import moment from "moment";
// import Moment from "react-moment";
import "./App.css";
import data from "./data";
import { buildCalendar, isoToUnixTimestamp, utcToMMDDYYYY } from "./helpers";
import CalendarMap from "./CalendarMap";
import Header from "./Header";

const Calendar = () => {
  const [allData, setAllData] = useState(data);
  const [calendarData, setCalendarData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(false);
  const [currentDate, setCurrentDate] = useState(moment());
  const [calendar, setCalendar] = useState([]);
  const [modal, setModal] = useState({ data: {}, open: false });

  useEffect(() => {
    console.log("useEffect in effect");
    setCalendar(buildCalendar(currentDate));
    const startDay = isoToUnixTimestamp(
      currentDate.clone().startOf("month").startOf("week")
    );
    const endDay = isoToUnixTimestamp(
      currentDate.clone().endOf("month").endOf("week")
    );
    const filteredData = allData.filter((d) => {
      const dateObj1 = new Date(d.startDT);
      const dateObj2 = new Date(d.endDT);
      //filter data that is contained anywhere in current month, either the start date, end date, or just passing through
      if (dateObj1 >= startDay && dateObj1 <= endDay) return true;
      if (dateObj2 >= startDay && dateObj2 <= endDay) return true;
      if (dateObj1 <= startDay && dateObj2 >= endDay) return true;
      return false;
    });
    setCalendarData(filteredData);
  }, [currentDate, allData]);

  const formHandler = (e) => {
    e.preventDefault();
    const fname = e.target.name;
    let fval = e.target.value;
    if (fname === "startDT" || fname === "endDT") {
      fval = isoToUnixTimestamp(new Date(fval));
      console.log(fval, utcToMMDDYYYY(fval));
    }
    setModal({ ...modal, data: { ...modal.data, [fname]: fval } });
  };

  const addNewTask = () => {
    const savedData = [...calendarData, modal.data];
    setAllData(savedData);
  };

  return (
    <>
      <div className={`backdrop ${modal.open ? "modal-open" : ""}`}></div>
      <div className={`modal ${modal.open ? "modal-open" : ""}`}>
        <div className="modal-line">
          <input
            type="text"
            name="title"
            placeholder="Task Name"
            onChange={formHandler}
            value={modal.data.title}
          />
        </div>
        <div className="modal-line">
          <input
            type="text"
            name="user"
            placeholder="Assigned To"
            onChange={formHandler}
            value={modal.data.user}
          />
        </div>
        <div className="modal-line">
          <input
            type="date"
            name="startDT"
            // onChange={(e) => {
            //   const val = isoToUnixTimestamp(new Date(e.target.value));
            //   console.log(val);
            // }}
            onChange={formHandler}
            value={modal.data.startDT}
          />
          {" to "}
          <input
            type="date"
            name="endDT"
            onChange={formHandler}
            value={modal.data.startDT}
          />
        </div>
        <div className="footer">
          <div className="modal-button" onClick={addNewTask}>
            Save
          </div>
          <div
            className="modal-button"
            onClick={() => setModal({ ...modal, open: false })}
          >
            Cancel
          </div>
        </div>
      </div>
      <Header
        setCurrentDate={setCurrentDate}
        currentDate={currentDate}
        modal={modal}
        setModal={setModal}
      />
      <CalendarMap
        calendar={calendar}
        calendarData={calendarData}
        currentDate={currentDate}
        setSelectedDate={setSelectedDate}
      />
      {/* <pre>
        {JSON.stringify(
          new Date(isoToUnixTimestamp(new Date()) * 1000).toDateString(),
          0,
          3
        )}
      </pre> */}
      <pre>
        {JSON.stringify(
          new Date(isoToUnixTimestamp(selectedDate) * 1000).toDateString(),
          0,
          3
        )}
      </pre>
      <pre>{JSON.stringify(modal, 0, 3)}</pre>
      {/* <pre>{JSON.stringify(calendarData, 0, 3)}</pre> */}
    </>
  );
};
export default Calendar;
