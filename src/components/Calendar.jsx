import React, { useState, useEffect, useRef  } from "react";
import { eachDayOfInterval, endOfMonth, format, startOfMonth, startOfWeek, startOfToday, parse, add, sub, isBefore } from "date-fns";
import css from "./Calendar.module.css"

export const Calendar = () => {
const [formattedTime, setFormattedTime] = useState(format(new Date(), 'MMMM dd, HH:mm'));
const [dateFrom, setDateFrom] = useState(null);
const [dateTo, setDateTo] = useState(null);
const [selectedDates, setSelectedDates] = useState([]);
const [currentMonth, setCurrentMonth] = useState(startOfMonth(new Date()));
const defaultDateFormat = "yyyy-MM-dd"
const defaultDisplayDateFormat = "dd MMMM"
const today = new Date();
const calendarRef = useRef(null);
const formattedDateFrom = dateFrom ? format(dateFrom, defaultDisplayDateFormat) : null;
const formattedDateTo = dateTo ? format(dateTo, defaultDisplayDateFormat) : null;
const previousMonth = sub(currentMonth, { months: 1 });
const prevMonthFormatted = format(previousMonth, "MMMM")
const nextMonth = add(currentMonth, { months: 1 });
const nextMonthFormatted = format(nextMonth, "MMMM")

function handleNextMonth() {
  setCurrentMonth(add(currentMonth, { months: 1 }));
  console.log(format(currentMonth, "MMMM"));
}

function handlePreviousMonth() {
  setCurrentMonth(sub(currentMonth, { months: 1 }));
  console.log(currentMonth);
}

function notCurrentMonth(date) {
  const currentMonthIndex = new Date(currentMonth).getMonth();
  const monthIndex = date.getMonth();
  return monthIndex !== currentMonthIndex;
}

function getDaysInMonth(month) {
  const start = startOfWeek(startOfMonth(month));
  const end = endOfMonth(month);
  const daysInMonth = eachDayOfInterval({ start, end });
  return daysInMonth;
}

const month = getDaysInMonth(currentMonth).map((day) => {
  const isSelected = selectedDates.some(
    (selectedDay) =>
        format(selectedDay, defaultDateFormat) ===
        format(day, defaultDateFormat)
    );
    const isCurrent = notCurrentMonth(day);
    const isToday = format(today, defaultDateFormat) === format(day, defaultDateFormat);
    return { day, isSelected, isCurrent, isToday };
});
  
function handleDayClick(day) {
  if (!dateFrom || (dateTo && (format(dateTo, defaultDateFormat) !== format(day, defaultDateFormat)))) {
    setDateFrom(day);
    setDateTo(null);
    setSelectedDates([day]);
  } else if (!dateTo && (format(dateFrom, defaultDateFormat) !== format(day, defaultDateFormat))) {
    if (isBefore(day, dateFrom)) {
      setDateTo(dateFrom);
      setDateFrom(day);
      setSelectedDates(eachDayOfInterval({ start: day, end: dateFrom }));
    } else {
      setDateTo(day);
      setSelectedDates(eachDayOfInterval({ start: dateFrom, end: day }));
    }
  } else {
    setDateFrom(null);
    setDateTo(null);
    setSelectedDates([]);
  }
} 

useEffect(() => {
  if (dateFrom && dateTo) {
    const interval = eachDayOfInterval({ start: dateFrom, end: dateTo });
    setSelectedDates(interval);
  } else {
    setSelectedDates(dateFrom ? [dateFrom] : []);
  }
}, [dateFrom, dateTo]);

useEffect(() => {
  function handleKeyDown(event) {
    if (event.key === "Escape") {
      setSelectedDates([]);
    }
  }
  document.addEventListener("keydown", handleKeyDown);
  return () => {
    document.removeEventListener("keydown", handleKeyDown);
  };
}, [calendarRef, setSelectedDates]);

useEffect(() => {
  const interval = setInterval(() => {
    setFormattedTime(format(new Date(), 'dd MMMM, HH:mm'));
  }, 60000); 
  return () => clearInterval(interval);
}, []);

  return (
    <div>
        <p className={css.clock}>Today is {formattedTime}</p>
      <div className={css.header}>
        <p className={css.title}>Select date</p>
        { selectedDates.length === 0 ? (
          <p className={css.dates}>Pick date(s)</p>
        ) : (
          <p className={css.dates}>
            {formattedDateFrom}{formattedDateTo ? ` - ${formattedDateTo} (${selectedDates.length} days)` : ''}
          </p>
        )}
      </div>
      <div className={css.calendar}>
        <div className={css.nav}>
          <button onClick={handlePreviousMonth}>
            <p>&larr;</p>{prevMonthFormatted}</button>
          <h2>{format(currentMonth, "MMMM")}</h2>
          <button onClick={handleNextMonth}>{nextMonthFormatted}<p>&#8594;</p></button> 
        </div>
        <div className={css.daysName}>
        <p>Sun</p>
        <p>Mon</p>
        <p>Tue</p>
        <p>Wed</p>
        <p>Thu</p>
        <p>Fri</p>
        <p>Sat</p>
      </div>
      <div className={css.days} ref={calendarRef}>
      {month.map(({ day, isSelected, isCurrent, isToday })  => {
      return (
      <p
        className={`${css.day} ${isSelected ? css.selectedDay : ''} ${isCurrent ? css.notCurrentMonth : ''} ${isToday && !isSelected ? css.today: ''}`}
        key={day}
        onClick={() => handleDayClick(day)}
      >
      <time dateTime={format(day, defaultDateFormat)}>{format(day, 'd')}</time>
      </p>
      );
    })} 
    </div>
      <div className={css.esc}>
        <p>Press ESC to clear calendar</p>
       </div> 
    </div>
  </div>
  );
};
