import React, { useState, useEffect } from "react";
import { eachDayOfInterval, endOfMonth, format, startOfMonth, startOfWeek, startOfToday, parse, add, sub, addDays, addSeconds, isBefore } from "date-fns";

import css from "./Calendar.module.css"

export const Calendar = () => {
const [dateFrom, setDateFrom] = useState(null);
const [dateTo, setDateTo] = useState(null);
const [selectedDates, setSelectedDates] = useState([]);
const [currentMonth, setCurrentMonth] = useState(format(startOfToday(), 'MMM yyyy'));
const defaultDateFormat = "yyyy-MM-dd"

const firstDayCurrentMonth = parse(currentMonth, 'MMM yyyy', new Date()); //prawidlowo - pierwszy dzien miesiaca
const firstDayNextMonth = add(firstDayCurrentMonth, { months: 1 });
const firstDayPrevMonth = sub(firstDayCurrentMonth, { months: 1 });

function nextMonth() {
  const firstDayNextMonth = add(firstDayCurrentMonth, { months: 1 });
  setCurrentMonth(format(firstDayNextMonth, 'MMM yyyy'))
  }
  
  function previousMonth() {
  const firstDayPrevMonth = sub(firstDayCurrentMonth, { months: 1 });
  setCurrentMonth(format(firstDayPrevMonth, 'MMM yyyy'))
  }

console.log(`CURRENT MONTH => ${currentMonth}`);


function getDaysInMonth(month) {
  const start = startOfWeek(startOfMonth(month)); // Get start of month
  const end = endOfMonth(month); // Get end of month
  const daysInMonth = eachDayOfInterval({ start, end }); // Get array of dates in month
  const currentMonth = format(startOfToday(), 'MMM yyyy'); // Get current month
  const currentMonthIndex = new Date(currentMonth).getMonth(); // Extract month value from current month

  for (const day in daysInMonth) {
    const monthIndex = daysInMonth[day].getMonth(); // Extract month value from date
    const monthName = daysInMonth[day].toLocaleString('default', { month: 'long' }); // Get month name from date
    if (monthIndex !== currentMonthIndex) { // Compare month value with current month
      console.log(`${monthName} ${daysInMonth[day].getDate()}, ${daysInMonth[day].getFullYear()}`);
    }
  }
  console.log(daysInMonth);
  return daysInMonth;
}


const month = getDaysInMonth(new Date()).map(day => {
  //console.log(`DAY => ${day}`);
  const isSelected = selectedDates.some(selectedDay => format(selectedDay, defaultDateFormat) === format(day, defaultDateFormat));
return { day, isSelected };
})
//console.log(`MONTH => ${month}`);


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

const formattedDateFrom = dateFrom ? format(dateFrom, 'MMMM dd') : null;
const formattedDateTo = dateTo ? format(dateTo, 'MMMM dd') : null;
console.log(`Start: ${formattedDateFrom}, End: ${formattedDateTo}`);
console.log(`Selected dates: ${selectedDates}`);
console.log(`Selected length: ${selectedDates.length}`);


  return (
    <div>
      <div className={css.header}>
        <p className={css.title}>Select date</p>
        { selectedDates.length === 0 ? (
          <p className={css.dates}>Pick date(s)</p>
        ) : (
          <p className={css.dates}>
            {formattedDateFrom}{formattedDateTo ? ` - ${formattedDateTo}` : ''}
          </p>
        )}
      </div>
    <div className={css.calendar}>
      <div className={css.nav}>
        <button  onClick={previousMonth}><p>&larr;</p>{format(firstDayPrevMonth, 'MMMMMM')}</button>
        <h2>{format(firstDayCurrentMonth, 'MMMMMMM yyy')}</h2>
        <button onClick={nextMonth}>{format(firstDayNextMonth, 'MMMMMM')}<p>&#8594;</p></button>
      </div>
      <div className={css.daysName}>
        <p>Mon</p>
        <p>Tue</p>
        <p>Wed</p>
        <p>Thu</p>
        <p>Fri</p>
        <p>Sat</p>
        <p>Sun</p>
      </div>
      <div className={css.days}>
      {month.map(({ day, isSelected }) => (
      <p
        className={`${css.day} ${isSelected ? css.selectedDay : ''}`}
        key={day.toString()}
        onClick={() => handleDayClick(day)}
      >
        <time dateTime={format(day, defaultDateFormat)}>{format(day, 'd')}</time>
      </p>
      ))}
      </div>
    </div>
  </div>
  );
};


