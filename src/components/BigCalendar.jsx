import React from 'react';
import {Calendar, momentLocalizer} from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment'


const localizer = momentLocalizer(moment);

const events = [
  {
    title: 'Methamatics Qiuz',
    start: new Date(),
    end: new Date(new Date().setHours(new Date().getHours() + 1)),
  },
  {
    title: 'Science Assessment 2 Submmission',
    start: new Date(new Date().setDate(new Date().getDate() + 1)),
    end: new Date(new Date().setHours(new Date().getHours() + 1)),
  }
];

const eventStyleGetter = (event, start, end, isSelected) => {
    const style = {
      backgroundColor: event.color, // Use the color property of the event
      borderRadius: '5px',
      opacity: isSelected ? 0.8 : 1,
      border: 'none',
      color: 'white',
      padding: '5px',
      cursor: 'pointer',
    };
    return { style };
  };
  
const BigCalendarComponent = () => {

  return (
    <div style={{ width: '100%', padding: '20px' }}>
      <Calendar
      localizer={localizer}
        events={events}
        eventStyleGetter={eventStyleGetter}
        startAccessor="start"
        endAccessor="end"
        style={{ height: '500px' }}
      />
    </div>
  )
}

export default BigCalendarComponent
