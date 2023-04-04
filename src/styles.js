const isSelected = (day, today) => {
  return today.isSame(day, "day");
};

const beforeToday = (day) => {
  return day.isBefore(new Date(), "day");
};

const isToday = (day) => {
  return day.isSame(new Date(), "day");
};

const dayStyles = (day, today) => {
  if (isToday(day)) return "sel-today";
  if (isSelected(day, today)) return "sel-selected";
  if (beforeToday(day)) return "sel-before";
  return "";
};

export default dayStyles;
