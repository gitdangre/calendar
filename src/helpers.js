export const buildCalendar = (currentDate) => {
  const startDay = currentDate.clone().startOf("month").startOf("week");
  const endDay = currentDate.clone().endOf("month").endOf("week");
  const day = startDay.clone().subtract(1, "day");
  const calendar = [];
  while (day.isBefore(endDay, "day")) {
    calendar.push(
      Array(7)
        .fill(0)
        .map(() => day.add(1, "day").clone())
    );
  }
  return calendar;
};

export const utcToMMDDYYYY = (unixTimestamp, format) => {
  const dateObj = new Date(unixTimestamp * 1000); // Multiply by 1000 to convert seconds to milliseconds
  const uday = ("0" + dateObj.getDate()).slice(-2);
  const umonth = ("0" + (dateObj.getMonth() + 1)).slice(-2); // Add 1 since umonths are zero-indexed
  const uyear = dateObj.getFullYear();
  const formattedDate = `${umonth}/${uday}/${uyear}`;
  const monthDay = `${umonth}/${uday}`;

  if (format === "mmdd") return monthDay;
  if (format === "day") return uday;
  if (format === "month") return umonth;
  if (format === "year") return uyear;
  return formattedDate; // default "MM/DD/YYYY" format
};

export const daysBetweenUtc = (unixTimestamp1, unixTimestamp2) => {
  // Convert the timestamps to JavaScript Date objects
  const dateObj1 = new Date(unixTimestamp1 * 1000);
  const dateObj2 = new Date(unixTimestamp2 * 1000);

  // Calculate the time difference in milliseconds
  const millisecondsDifference = Math.abs(dateObj2 - dateObj1);

  // Convert the milliseconds difference to days
  const daysDifference = millisecondsDifference / (1000 * 60 * 60 * 24);

  return Math.round(daysDifference) + 1;
};

export const mmddyyyToUnixTimestamp = (inputDate) => {
  // Parse the date string to a JavaScript Date object
  const dateObj = new Date(inputDate);

  // Get the number of milliseconds since the Unix epoch
  const millisecondsSinceEpoch = dateObj.getTime();

  // Convert the milliseconds to a Unix timestamp (in seconds)
  const unixTimestamp = Math.floor(millisecondsSinceEpoch / 1000);

  return unixTimestamp;
};

export const isoToUnixTimestamp = (iso) => {
  return Math.floor(new Date(iso).getTime() / 1000); //ISO8601 to unixTimestamp
};

export const selectedMonthName = (currentDate) => {
  return currentDate.format("MMMM");
};

export const selectedYear = (currentDate) => {
  return currentDate.format("YYYY");
};

export const prevMonth = (currentDate) => {
  return currentDate.clone().subtract(1, "month");
};

export const nextMonth = (currentDate) => {
  return currentDate.clone().add(1, "month");
};

export const condenseCalendar = (weeklyData) => {
  const weeklyDataClone = weeklyData;
  weeklyDataClone.forEach((d, i) => {
    for (let weekRow = 0; weekRow <= 12; weekRow++) {
      const dataFilter = weeklyDataClone.filter((filteredData) => {
        if (
          filteredData.step === weekRow &&
          filteredData.weekEnd >= d.weekStart
        )
          return true;
        return false;
      });
      if (dataFilter.length === 0) {
        weeklyDataClone[i] = { ...weeklyDataClone[i], step: weekRow };
        break;
      }
    }
  });
  return weeklyDataClone;
};
