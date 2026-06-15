import React, { useState, useEffect } from 'react';
import ReactClock from 'react-clock';
import 'react-clock/dist/Clock.css';

const ClockComponent = () => {
    const [value, setValue] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setValue(new Date()), 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);
  return (
    <div>
      <ReactClock value={value} />
    </div>
  )
}

export default ClockComponent
