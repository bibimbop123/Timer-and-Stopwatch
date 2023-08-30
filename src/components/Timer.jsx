import React, { useState, useEffect, useCallback } from "react";
import { useTimer } from "react-timer-hook";
import cool_alarm from "../assets/cool_alarm.mp3";

export default function MyTimer() {
  const [selectedMinutes, setSelectedMinutes] = useState(5);
  const [selectedSeconds, setSelectedSeconds] = useState(0);
  const [isExpired, setIsExpired] = useState(false);
  const [alarm, setAlarm] = useState(null);
  const [intervalId, setIntervalId] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [expiryTimestamp, setExpiryTimestamp] = useState(0);

  const handleMinutesChange = (event) => {
    setSelectedMinutes(parseInt(event.target.value));
  };

  const handleSecondsChange = (event) => {
    setSelectedSeconds(parseInt(event.target.value));
  };

  const handleStartClick = () => {
    setIsExpired(false);
    if (isRunning) {
      clearInterval(intervalId);
      const expiryTimestamp = Date.now() + timeRemaining;
      const intervalId = setInterval(() => {
        const timeRemaining = Math.max(expiryTimestamp - Date.now(), 0);
        if (timeRemaining <= 0) {
          setIsExpired(true);
          clearInterval(intervalId);
          if (alarm) {
            alarm.play();
            if (window.navigator.vibrate) {
              window.navigator.vibrate(1000);
            }
          }
        }
        setTimeRemaining(timeRemaining);
      }, 1);
      setExpiryTimestamp(expiryTimestamp);
      setIntervalId(intervalId);
    } else {
      startTimer();
    }
    setIsRunning(true);
  };

  const handlePauseClick = () => {
    setIsRunning(false);
    clearInterval(intervalId);
  };

  const resume = () => {
    setIsRunning(true);
    const newExpiryTimestamp = Date.now() + timeRemaining;
    const intervalId = setInterval(() => {
      const timeRemaining = Math.max(newExpiryTimestamp - Date.now(), 0);
      if (timeRemaining <= 0) {
        setIsExpired(true);
        clearInterval(intervalId);
        if (alarm) {
          alarm.play();
          if (window.navigator.vibrate) {
            window.navigator.vibrate(1000);
          }
        }
      }
      setTimeRemaining(timeRemaining);
    }, 1);
    setExpiryTimestamp(newExpiryTimestamp);
    setIntervalId(intervalId);
  };

  const handleResumeClick = () => {
    resume();
  };

  const handleRestartClick = () => {
    setIsExpired(false);
    startTimer();
  };

  const { seconds, minutes, start, pause, restart } = useTimer({
    expiryTimestamp:
      Date.now() + selectedMinutes * 60 * 1000 + selectedSeconds * 1000,
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

  const handleAlarmLoaded = (event) => {
    setAlarm(event.target);
  };

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
    setIsRunning(isRunning);
    console.log("isRunning:", isRunning);
  }, [isRunning]);

  const formatTime = (timeRemaining) => {
    const padTime = (time) => time.toString().padStart(2, "0");
    const minutes = Math.floor(timeRemaining / 60000);
    const seconds = Math.floor((timeRemaining % 60000) / 1000);
    const milliseconds = Math.floor(timeRemaining % 1000);
    return `${padTime(minutes)}:${padTime(seconds)}.${milliseconds
      .toString()
      .padStart(3, "0")}`;
  };
  const startTimer = () => {
    const expiryTimestamp =
      Date.now() + selectedMinutes * 60 * 1000 + selectedSeconds * 1000;
    const intervalId = setInterval(() => {
      const timeRemaining = Math.max(expiryTimestamp - Date.now(), 0);
      if (timeRemaining <= 0) {
        setIsExpired(true);
        clearInterval(intervalId);
        if (alarm) {
          alarm.play();
          if (window.navigator.vibrate) {
            window.navigator.vibrate(1000);
          }
        }
      }
      setTimeRemaining(timeRemaining);
    }, 1);
    setIntervalId(intervalId);
    setTimeRemaining(selectedMinutes * 60 * 1000 + selectedSeconds * 1000);
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
        <button onClick={handleStartClick} disabled={isRunning}>
          Start
        </button>
        <button onClick={handlePauseClick}>Pause</button>
        <button onClick={handleResumeClick}>Resume</button>
        <button onClick={handleRestartClick}>Restart</button>
      </div>
      <div>
        <p>Time Remaining: {formatTime(timeRemaining)}</p>
      </div>
      <audio src={cool_alarm} onLoadedData={handleAlarmLoaded} />
    </div>
  );
}
