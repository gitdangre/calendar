import React from "react";
import moment from "moment";
import {
  prevMonth,
  nextMonth,
  selectedMonthName,
  selectedYear,
} from "./helpers";

const Header = (props) => {
  const { currentDate, setCurrentDate, modal, setModal } = props;
  return (
    <div className="header">
      <button
        className="header-prev"
        onClick={() => setCurrentDate(prevMonth(currentDate))}
      >
        {`< PREV`}
      </button>
      <button className="header-curr" onClick={() => setCurrentDate(moment())}>
        NOW
      </button>
      <button
        className="header-next"
        onClick={() => setCurrentDate(nextMonth(currentDate))}
      >
        {`NEXT >`}
      </button>

      <button
        className="header-next"
        onClick={() => setModal({ ...modal, open: true })}
      >
        {`NEW`}
      </button>

      <div className="header-display">
        {selectedMonthName(currentDate)} {selectedYear(currentDate)}
      </div>
    </div>
  );
};

export default Header;
