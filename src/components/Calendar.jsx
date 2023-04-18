import React from "react";
import { useState } from "react";
import { eachDayOfInterval, endOfMonth, endOfWeek, format, startOfMonth, startOfToday, parse, add, sub } from "date-fns";
import css from "./Calendar.module.css"

export const Calendar = () => {
  let today = startOfToday()
  let [selectedDay, setSelectedDay] = useState(today);
  let [currentMonth, setCurrentMonth] = useState(format(today, 'MMM yyyy'))
  let firstDayCurrentMonth = parse(currentMonth, 'MMM yyyy', new Date())
  let firstDayNextMonth = add(firstDayCurrentMonth, { months: 1 })
  let firstDayPrevMonth = sub(firstDayCurrentMonth, { months: 1 })

  let month = eachDayOfInterval({ 
    start: firstDayCurrentMonth,
    end:endOfWeek(endOfMonth(firstDayCurrentMonth))})

  
  function nextMonth() {
    let firstDayNextMonth = add(firstDayCurrentMonth, { months: 1 })
    setCurrentMonth(format(firstDayNextMonth, 'MMM yyyy'))
  }

  function previousMonth() {
    let firstDayPrevMonth = sub(firstDayCurrentMonth, { months: 1 })
    setCurrentMonth(format(firstDayPrevMonth, 'MMM yyyy'))
  }


  return (
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
        {month.map((day) => (
          <p className={css.day} key={day.toString()}>
            <time dateTime={format(day, 'yyyy-MM-dd')}>{format(day, 'd')}</time>
          </p>
        ))}
      </div>
    </div>
  );
};



