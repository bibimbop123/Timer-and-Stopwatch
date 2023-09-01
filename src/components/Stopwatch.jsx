import React, { useState, useEffect, useRef } from "react";
import { useStopwatch } from "react-timer-hook";

export default function MyStopwatch() {
  const { seconds, minutes, hours, days, isRunning, start, pause, reset } =
    useStopwatch({ autoStart: false });

  const [milliseconds, setMilliseconds] = useState(0);
  const [pausedTime, setPausedTime] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setMilliseconds((prevMillis) => prevMillis + 33); // Increment milliseconds by 1
      }, 10);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => {
      clearInterval(intervalRef.current);
    };
  }, [isRunning]);

  const handleResetClick = () => {
    reset();
    setMilliseconds(0); // Reset milliseconds to 0
    setPausedTime(0); // Reset paused time to 0
  };

  const handleStartClick = () => {
    if (pausedTime > 0) {
      const now = new Date().getTime();
      const timeElapsed = now - pausedTime;
      start(new Date(timeElapsed));
      setPausedTime(0);
    } else {
      start();
    }
  };

  const handlePauseClick = () => {
    pause();
    setPausedTime(new Date().getTime());
  };

  const formatTime = (timeRemaining) => {
    const padTime = (time) => time.toString().padStart(2, "0");
    const formattedDays = padTime(days);
    const formattedHours = padTime(hours);
    const formattedMinutes = padTime(minutes);
    const formattedSeconds = padTime(seconds);
    const milliseconds = Math.floor(timeRemaining % 1000);
    return `${padTime(formattedDays)} days, ${padTime(
      formattedHours
    )} hours, ${padTime(formattedMinutes)} minutes, ${padTime(
      formattedSeconds
    )} seconds, ${milliseconds.toString().padStart(3, "0")} milliseconds`;
  };

  return (
    <div style={{ textAlign: "center" }}>
      <p className="Time-remaining">
        Time elapsed:
        {formatTime(
          days * 86400000 +
            hours * 3600000 +
            minutes * 60000 +
            seconds * 1000 +
            milliseconds
        )}
      </p>
      {milliseconds > 0 && (
        <p style={{ fontSize: "14px", color: "gray" }}>
          Note: Milliseconds may not be accurate due to limitations in timer
          accuracy.
        </p>
      )}
      <p>{isRunning ? "Running" : "Not running"}</p>
      <button onClick={handleStartClick}>Start</button>
      <button onClick={handlePauseClick}>Pause</button>
      <button onClick={handleResetClick}>Reset</button>
    </div>
  );
}
