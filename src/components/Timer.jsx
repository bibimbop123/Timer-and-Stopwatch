import React, { useState, useEffect } from "react";
import { useTimer } from "react-timer-hook";
import cool_alarm from "../assets/cool_alarm.mp3";

export default function MyTimer() {
  const [selectedMinutes, setSelectedMinutes] = useState(5);
  const [selectedSeconds, setSelectedSeconds] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(
    selectedMinutes * 60 * 1000
  );
  const [isPaused, setIsPaused] = useState(false);

  const handleMinutesChange = (event) => {
    setSelectedMinutes(parseInt(event.target.value));
  };

  const handleSecondsChange = (event) => {
    setSelectedSeconds(parseInt(event.target.value));
  };

  const handleStartClick = () => {
    setTimeRemaining(selectedMinutes * 60 * 1000);
    setTimeRemaining(selectedSeconds * 1000);
    setIsPaused(false);
  };

  const handlePauseClick = () => {
    setIsPaused(true);
  };

  const handleResumeClick = () => {
    setIsPaused(false);
  };

  const handleRestartClick = () => {
    setTimeRemaining(selectedMinutes * 60 * 1000);
    setIsPaused(false);
  };

  const { seconds, minutes, hours, days } = useTimer({
    expiryTimestamp: Date.now() + timeRemaining,
    onExpire: () => console.warn("onExpire called"),
    autoStart: false,
  });

  useEffect(() => {
    let rafId;
    let lastUpdateTime = Date.now();
    const updateTimer = () => {
      const currentTime = Date.now();
      const deltaTime = currentTime - lastUpdateTime;
      lastUpdateTime = currentTime;
      setTimeRemaining((prevTimeRemaining) => prevTimeRemaining - deltaTime);
      if (timeRemaining <= 0) {
        setIsPaused(true);
        const alarm = new Audio(cool_alarm);
        alarm.play();
      } else {
        rafId = requestAnimationFrame(updateTimer);
      }
    };
    if (!isPaused) {
      rafId = requestAnimationFrame(updateTimer);
    }
    return () => cancelAnimationFrame(rafId);
  }, [isPaused, timeRemaining]);

  const formatTime = (time) => {
    const padTime = (time) => time.toString().padStart(2, "0");
    const days = Math.floor(time / 86400000);
    const hours = Math.floor((time % 86400000) / 3600000);
    const minutes = Math.floor((time % 3600000) / 60000);
    const seconds = Math.floor((time % 60000) / 1000);
    return `${days} days, ${padTime(hours)} hours, ${padTime(
      minutes
    )} minutes, ${padTime(seconds)} seconds`;
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
        <label htmlFor="seconds">Seconds:</label>
        <input
          type="number"
          id="seconds"
          value={selectedSeconds}
          onChange={handleSecondsChange}
        />
      </div>
      <div>
        <button onClick={handleStartClick}>Start</button>
        <button onClick={handlePauseClick}>Pause</button>
        <button onClick={handleResumeClick}>Resume</button>
        <button onClick={handleRestartClick}>Restart</button>
      </div>
      <div>
        <p>Time Remaining: {formatTime(timeRemaining)}</p>
      </div>
    </div>
  );
}
