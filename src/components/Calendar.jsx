import React from "react";
import { useState, useEffect } from "react";
import { eachDayOfInterval, endOfMonth, endOfWeek, format, startOfMonth, startOfWeek, startOfToday, parse, add, sub, addDays } from "date-fns";
import css from "./Calendar.module.css"

export const Calendar = () => {
  let today = startOfToday()
  let [selectedDay, setSelectedDay] = useState(today);
  let [selectedDays, setSelectedDays] = useState([]);
  let [currentMonth, setCurrentMonth] = useState(format(today, 'MMM yyyy'))
  let firstDayCurrentMonth = parse(currentMonth, 'MMM yyyy', new Date())
  let firstDayNextMonth = add(firstDayCurrentMonth, { months: 1 })
  let firstDayPrevMonth = sub(firstDayCurrentMonth, { months: 1 })
  const start = startOfWeek(firstDayCurrentMonth)
  const end = endOfMonth(firstDayCurrentMonth)
  const newStart = addDays(start, 1)

  //let month = eachDayOfInterval({ start, end})
  //let month = eachDayOfInterval({ start: newStart, end })
  let month = eachDayOfInterval({ start: newStart, end }).map(day => {
    const isSelected = selectedDays.some(selectedDay => format(selectedDay, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd'));
    return { day, isSelected };
  });
  
  
  function nextMonth() {
    let firstDayNextMonth = add(firstDayCurrentMonth, { months: 1 })
    setCurrentMonth(format(firstDayNextMonth, 'MMM yyyy'))
  }

  function previousMonth() {
    let firstDayPrevMonth = sub(firstDayCurrentMonth, { months: 1 })
    setCurrentMonth(format(firstDayPrevMonth, 'MMM yyyy'))
  }
  
  
function handleDayClick(day) {
    const selectedDayStr = format(day, 'yyyy-MM-dd');
    
    setSelectedDays(prevSelectedDays => {
      const selectedDaysSorted = [...prevSelectedDays, day].sort((a, b) => a.getTime() - b.getTime());
      const start = selectedDaysSorted[0];
      const end = selectedDaysSorted[selectedDaysSorted.length - 1];
      const range = eachDayOfInterval({ start, end });
      const rangeStr = range.map(date => format(date, 'yyyy-MM-dd'));
  
      if (prevSelectedDays.some(selectedDay => format(selectedDay, 'yyyy-MM-dd') === selectedDayStr)) {
        return prevSelectedDays.filter(selectedDay => format(selectedDay, 'yyyy-MM-dd') !== selectedDayStr);
      } else if (prevSelectedDays.length > 0 && rangeStr.includes(selectedDayStr)) {
        return range;
      } else {
        return [day];
      }
    });
  } 
  
  useEffect(() => {
    const pickedDate = document.querySelector("#picked-date");
    if (pickedDate) {
      const selectedDaysSorted = [...selectedDays].sort((a, b) => a.getTime() - b.getTime());
      const selectedDaysStrArr = selectedDaysSorted.map(selectedDay => format(selectedDay, 'MMMM dd'));
      if (selectedDaysStrArr.length === 0) {
        pickedDate.innerHTML = "Pick date(s)";
      } else if (selectedDaysStrArr.length === 1) {
        pickedDate.innerHTML = `${selectedDaysStrArr[0]}`;
      } else {
        pickedDate.innerHTML = `${selectedDaysStrArr[0]} - ${selectedDaysStrArr[selectedDaysStrArr.length - 1]}`;
      }
      console.log(selectedDaysStrArr);
    }
  }, [selectedDays]);

  
  
  return (
   <div>
    <div className={css.header}>
      <p>Select date</p>
      <button id="picked-date">Pick date(s)</button>
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
    <time dateTime={format(day, 'yyyy-MM-dd')}>{format(day, 'd')}</time>
  </p>
))}

      </div>
    </div>
    </div> 
  );
};



