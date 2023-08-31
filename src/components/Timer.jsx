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
  const intervalIdRef = useRef(null);
  const duration = selectedSeconds * 1000 + selectedMinutes * 60 * 1000;
  const [isLoaded, setIsLoaded] = useState(false);

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
        clearInterval(intervalIdRef.current);
      }
    } else {
      const expiryTimestamp = Date.now() + duration;
      setExpiryTimestamp(expiryTimestamp);
      setIsRunning(true);
      startTimer(expiryTimestamp);
    }
  };

  const handlePauseClick = () => {
    setIsRunning(false);
    pause();
    clearInterval(intervalIdRef.current);
    intervalIdRef.current = null;
  };

  const handleResumeClick = () => {
    setIsRunning(true);
    const expiryTimestamp = Date.now() + timeRemaining;
    startTimer(expiryTimestamp);
  };

  const handleRestartClick = () => {
    setIsExpired(false);
    const expiryTimestamp = Date.now() + duration;
    setExpiryTimestamp(expiryTimestamp);
    setIsRunning(true);
    startTimer(expiryTimestamp);
  };

  const { start, pause, resume, restart } = useTimer({
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

  const pauseAlarm = useCallback(() => {
    if (alarm) {
      alarm.pause();
      alarm.currentTime = 0;
    }
  }, [alarm]);

  useEffect(() => {
    setAlarm(new Audio(cool_alarm));
    return pauseAlarm;
  }, [pauseAlarm]);

  useEffect(() => {
    if (isExpired) {
      if (alarm && !alarm.paused && alarm.currentTime > 0) {
        alarm.play();
        handleAlarmLoaded();
        if (window.navigator.vibrate) {
          window.navigator.vibrate(1000);
        }
      }
    } else {
      if (alarm) {
        alarm.pause();
        alarm.currentTime = 0;
      }
    }
  }, [isExpired, alarm]);

  const formatTime = (timeRemaining) => {
    const padTime = (time) => time.toString().padStart(2, "0");
    const minutes = Math.floor(timeRemaining / 60000);
    const seconds = Math.floor((timeRemaining % 60000) / 1000);
    const milliseconds = Math.floor(timeRemaining % 1000);
    return `${padTime(minutes)}:${padTime(seconds)}.${milliseconds
      .toString()
      .padStart(3, "0")}`;
  };

  const startTimer = (expiryTimestamp) => {
    clearInterval(intervalIdRef.current);
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
    intervalIdRef.current = newIntervalId;
    start({ expiryTimestamp });
  };

  const handleAlarmLoaded = (event = null) => {
    const audioElement = event ? event.target : new Audio(cool_alarm);
    setAlarm(audioElement);
    setIsLoaded(true);
  };

  useEffect(() => {
    if (!isLoaded) {
      const audioElement = new Audio(cool_alarm);
      audioElement.addEventListener("loadeddata", handleAlarmLoaded);
      return () => {
        audioElement.removeEventListener("loadeddata", handleAlarmLoaded);
      };
    }
  }, [isLoaded]);

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
        <button onClick={handlePauseClick} disabled={!isRunning}>
          Pause
        </button>
        <button onClick={handleResumeClick} disabled={isRunning}>
          Resume
        </button>
        <button onClick={handleRestartClick}>Restart</button>
      </div>
      <div>
        <p>Time Remaining: {formatTime(timeRemaining)}</p>
      </div>
      <audio src={cool_alarm} />
    </div>
  );
}
