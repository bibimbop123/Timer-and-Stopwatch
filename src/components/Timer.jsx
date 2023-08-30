import React, { useState, useEffect, useCallback } from "react";
import { useTimer } from "react-timer-hook";
import cool_alarm from "../assets/cool_alarm.mp3";

export default function MyTimer() {
  const [selectedMinutes, setSelectedMinutes] = useState(5);
  const [selectedSeconds, setSelectedSeconds] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(
    selectedMinutes * 60 * 1000
  );
  const [isPaused, setIsPaused] = useState(false);
  const [isExpired, setIsExpired] = useState(false);
  const [alarm, setAlarm] = useState(null);

  const handleMinutesChange = (event) => {
    setSelectedMinutes(parseInt(event.target.value));
  };

  const handleSecondsChange = (event) => {
    setSelectedSeconds(parseInt(event.target.value));
  };

  const handleStartClick = () => {
    setTimeRemaining(selectedMinutes * 60 * 1000 + selectedSeconds * 1000);
    setIsPaused(false);
    setIsExpired(false);
  };

  const handlePauseClick = () => {
    setIsPaused(true);
  };

  const handleResumeClick = () => {
    setIsPaused(false);
  };

  const handleRestartClick = () => {
    setTimeRemaining(selectedMinutes * 60 * 1000 + selectedSeconds * 1000);
    setIsPaused(false);
    setIsExpired(false);
    if (alarm) {
      pauseAlarm();
    }
  };

  const { minutes, seconds } = useTimer({
    expiryTimestamp: Date.now() + timeRemaining,
    onExpire: () => {
      setIsExpired(true);
      if (alarm) {
        alarm.play();
        if (window.navigator.vibrate) {
          window.navigator.vibrate(1000);
        }
      }
    },
    autoStart: false,
  });
  useEffect(() => {
    setAlarm(new Audio(cool_alarm));
    return pauseAlarm;
  }, []);

  const pauseAlarm = useCallback(() => {
    if (alarm) {
      alarm.pause();
      alarm.currentTime = 0;
    }
  }, [alarm]);

  useEffect(() => {
    if (isExpired) {
      alarm.play();
      if (window.navigator.vibrate) {
        window.navigator.vibrate(1000);
      }
    } else {
      pauseAlarm();
    }
  }, [isExpired, alarm, pauseAlarm]);

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
