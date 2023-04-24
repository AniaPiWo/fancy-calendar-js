import React, { useState, useEffect, useRef  } from "react";
import { eachDayOfInterval, endOfMonth, format, startOfMonth, startOfWeek, startOfToday, parse, add, sub, addDays, addSeconds, isBefore } from "date-fns";
import css from "./Calendar.module.css"

export const Calendar = () => {
const [dateFrom, setDateFrom] = useState(null);
const [dateTo, setDateTo] = useState(null);
const [selectedDates, setSelectedDates] = useState([]);
const [currentMonth, setCurrentMonth] = useState(format(startOfToday(), 'MMM yyyy'));
const calendarRef = useRef(null);
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



function notCurrentMonth(date) {
  const currentMonth = format(startOfToday(), 'MMM yyyy');
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

const month = getDaysInMonth(new Date()).map(day => {
  const isSelected = selectedDates.some(selectedDay => format(selectedDay, defaultDateFormat) === format(day, defaultDateFormat));
return { day, isSelected };
})
console.log(selectedDates);

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
  function handleClickOutside(event) {
    if (calendarRef.current && !calendarRef.current.contains(event.target)) {
      setSelectedDates([]);
    }
  }

  document.addEventListener("click", handleClickOutside);
  return () => {
    document.removeEventListener("click", handleClickOutside);
  };
}, [calendarRef]);

const formattedDateFrom = dateFrom ? format(dateFrom, 'MMMM dd') : null;
const formattedDateTo = dateTo ? format(dateTo, 'MMMM dd') : null;

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
        <p>Sun</p>
        <p>Mon</p>
        <p>Tue</p>
        <p>Wed</p>
        <p>Thu</p>
        <p>Fri</p>
        <p>Sat</p>
      </div>
      <div className={css.days} ref={calendarRef}>
    {month.map(({ day, isSelected }) => {
    const isCurrent = notCurrentMonth(day);
    return (
      <p
        className={`${css.day} ${isSelected ? css.selectedDay : ''} ${isCurrent ? css.notCurrentMonth : ''}`}
        key={day.toString()}
        onClick={() => handleDayClick(day)}
      >
        <time dateTime={format(day, defaultDateFormat)}>{format(day, 'd')}</time>
      </p>
    );
  })}
</div>

    </div>
  </div>
  );
};

