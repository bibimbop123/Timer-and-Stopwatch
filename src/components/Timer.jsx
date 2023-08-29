import React, { useState, useEffect } from "react";
import { useTimer } from "react-timer-hook";

export default function MyTimer() {
  const [selectedMinutes, setSelectedMinutes] = useState(5);
  const [timeRemaining, setTimeRemaining] = useState(
    selectedMinutes * 60 * 1000
  );
  const [isPaused, setIsPaused] = useState(false);

  const handleMinutesChange = (event) => {
    setSelectedMinutes(parseInt(event.target.value));
  };

  const handleStartClick = () => {
    setTimeRemaining(selectedMinutes * 60 * 1000);
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
      rafId = requestAnimationFrame(updateTimer);
    };
    if (!isPaused) {
      rafId = requestAnimationFrame(updateTimer);
    }
    return () => cancelAnimationFrame(rafId);
  }, [isPaused]);

  const formatTime = (time) => {
    const padTime = (time) => time.toString().padStart(2, "0");
    const minutes = Math.floor(time / 60000);
    const seconds = Math.floor((time % 60000) / 1000);
    const milliseconds = Math.floor(time % 1000);
    return `${padTime(minutes)}:${padTime(seconds)}.${milliseconds
      .toString()
      .padStart(3, "0")}`;
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
