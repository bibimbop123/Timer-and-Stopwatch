import React, { useState, useEffect, useCallback, useRef } from "react";
import { useTimer } from "react-timer-hook";
import cool_alarm from "../assets/cool_alarm.mp3";

export default function MyTimer() {
  const [selectedMinutes, setSelectedMinutes] = useState(5);
  const [selectedSeconds, setSelectedSeconds] = useState(0);
  const [isExpired, setIsExpired] = useState(false);
  const [alarm, setAlarm] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [expiryTimestamp, setExpiryTimestamp] = useState(0);
  const [intervalId, setIntervalId] = useState(null);
  const intervalIdRef = useRef(null);
  const duration = selectedSeconds * 1000 + selectedMinutes * 60 * 1000;

  const handleMinutesChange = (event) => {
    setSelectedMinutes(parseInt(event.target.value));
  };

  const handleSecondsChange = (event) => {
    setSelectedSeconds(parseInt(event.target.value));
  };

  const handleStartClick = () => {
    setIsExpired(false);
    if (isRunning) {
      if (intervalIdRef.current) {
        clearInterval(intervalId);
        const expiryTimestamp = Date.now() + timeRemaining;
        intervalId = setInterval(() => {
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
      }
    } else {
      const duration = selectedSeconds * 1000 + selectedMinutes * 60 * 1000;
      setDuration(duration);
      startTimer();
    }
    setIsRunning(true);
  };

  const handlePauseClick = () => {
    setIsRunning(false);
    clearInterval(intervalIdRef.current);
    intervalIdRef.current = null;
  };

  const handleResumeClick = () => {
    setIsRunning(true);
    const expiryTimestamp = Date.now() + timeRemaining;
    const newIntervalId = setInterval(() => {
      const timeRemaining = Math.max(expiryTimestamp - Date.now(), 0);
      if (timeRemaining <= 0) {
        setIsExpired(true);
        clearInterval(newIntervalId);
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
    intervalIdRef.current = newIntervalId;
  };

  const handleRestartClick = () => {
    setIsExpired(false);
    setDuration(selectedSeconds * 1000 + selectedMinutes * 60 * 1000);
    startTimer();
  };

  const { start, pause, restart } = useTimer({
    expiryTimestamp: expiryTimestamp,
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
    if (isRunning) {
      start();
    } else {
      pause();
    }
  }, [isRunning, start, pause]);

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
    setIsRunning(true);
    clearInterval(intervalIdRef.current);
    const expiryTimestamp = Date.now() + duration;
    const newIntervalId = setInterval(() => {
      const timeRemaining = Math.max(expiryTimestamp - Date.now(), 0);
      if (timeRemaining <= 0) {
        setIsExpired(true);
        clearInterval(newIntervalId);
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
    intervalIdRef.current = newIntervalId;
  };

  const setDuration = (duration) => {
    setTimeRemaining(duration);
    setExpiryTimestamp(Date.now() + duration);
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
