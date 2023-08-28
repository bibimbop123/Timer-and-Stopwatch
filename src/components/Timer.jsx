import React, { useState } from "react";
import { useTimer } from "react-timer-hook";

function Timer() {
  const [selectedMinutes, setSelectedMinutes] = useState(5);

  const handleMinutesChange = (event) => {
    setSelectedMinutes(parseInt(event.target.value));
  };

  const handleStartClick = () => {
    const time = new Date();
    time.setMinutes(time.getMinutes() + selectedMinutes);
    startTimer(time);
  };

  const { seconds, minutes, hours, days, start, pause, resume, restart } =
    useTimer({
      onExpire: () => console.warn("onExpire called"),
    });

  const startTimer = (expiryTimestamp) => {
    restart(expiryTimestamp);
    start();
  };

  return (
    <div>
      <div>
        <label htmlFor="minutes">Minutes:</label>
        <input
          type="number"
          id="minutes"
          value={selectedMinutes}
          onChange={handleMinutesChange}
        />
      </div>
      <div>
        <button onClick={handleStartClick}>Start</button>
        <button onClick={pause}>Pause</button>
        <button onClick={resume}>Resume</button>
        <button onClick={restart}>Restart</button>
      </div>
      <div>
        <p>
          {days} days, {hours} hours, {minutes} minutes, {seconds} seconds
        </p>
      </div>
    </div>
  );
}

export default Timer;
