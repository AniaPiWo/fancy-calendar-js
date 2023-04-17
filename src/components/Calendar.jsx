import React from "react";
import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css"
import { Container, Row, Col } from 'react-bootstrap';
import { eachDayOfInterval, endOfMonth, endOfWeek, format, startOfMonth, startOfToday, parse, add, sub } from "date-fns";

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
    <Container>
      <Row className="border border-secondary p-3">
        <Col><button  onClick={previousMonth}>{format(firstDayPrevMonth, 'MMMMMM')}</button></Col>
        <Col>{format(firstDayCurrentMonth, 'MMMMMMM yyy')}</Col>
        <Col><button
          onClick={nextMonth}>{format(firstDayNextMonth, 'MMMMMM')}</button></Col>
      </Row>
      <Row className="border border-secondary p-3">
        <Col>Mon</Col>
        <Col>Tue</Col>
        <Col>Wed</Col>
        <Col>Thu</Col>
        <Col>Fri</Col>
        <Col>Sat</Col>
        <Col>Sun</Col>
      </Row>
      <Row>
        {month.map((day) => (
          <Col key={day.toString()}>
            <time dateTime={format(day, 'yyyy-MM-dd')}>{format(day, 'd')}</time>
          </Col>
        ))}
      </Row>
    </Container>
  );
};


