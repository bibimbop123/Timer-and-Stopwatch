import { useTimer } from "react-timer-hook";
import cool_alarm from "../assets/cool_alarm.mp3";
import memory from "../assets/memory.jpg";
import { useCallback, useEffect, useRef, useState } from "react";

export default function MyTimer() {
  const [selectedDays, setSelectedDays] = useState(0);
  const [selectedHours, setSelectedHours] = useState(0);
  const [selectedMinutes, setSelectedMinutes] = useState(5);
  const [selectedSeconds, setSelectedSeconds] = useState(0);
  const [isExpired, setIsExpired] = useState(false);
  const [alarm, setAlarm] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [expiryTimestamp, setExpiryTimestamp] = useState(null);
  const intervalIdRef = useRef(null);
  const duration =
    selectedSeconds * 1000 +
    selectedMinutes * 60 * 1000 +
    selectedHours * 60 * 60 * 1000 +
    selectedDays * 24 * 60 * 60 * 1000;
  const [days, hours, minutes, seconds] = [
    Math.floor(timeRemaining / 86400000),
    Math.floor((timeRemaining % 86400000) / 3600000),
    Math.floor(((timeRemaining % 86400000) % 3600000) / 60000),
    Math.floor((((timeRemaining % 86400000) % 3600000) % 60000) / 1000),
  ];
  const [isPaused, setIsPaused] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const handleDaysChange = (event) => {
    setSelectedDays(parseInt(event.target.value));
  };
  const handleHoursChange = (event) => {
    setSelectedHours(parseInt(event.target.value));
  };

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
      setIsPaused(true);
      setIsRunning(false);
    } else {
      const expiryTimestamp = Date.now() + duration;
      setExpiryTimestamp(expiryTimestamp);
      setIsRunning(true);
      setIsPaused(false);
      startTimer(expiryTimestamp);
    }
  };

  const handlePauseClick = () => {
    setIsPaused(true);
    setIsRunning(false);
    pause();
    clearInterval(intervalIdRef.current);
    intervalIdRef.current = null;
  };

  const handleResumeClick = () => {
    setIsPaused(false);
    setIsRunning(true);
    const expiryTimestamp = Date.now() + timeRemaining;
    startTimer(expiryTimestamp);
  };

  const handleRestartClick = () => {
    setIsExpired(false);
    const expiryTimestamp = Date.now() + duration;
    setExpiryTimestamp(expiryTimestamp);
    setIsRunning(true);
    setIsPaused(false);
    startTimer(expiryTimestamp);
  };
  const handleTimerComplete = () => {
    setIsRunning(false);
    setIsPaused(false);
    setIsCompleted(true);
    if (alarm) {
      alarm.play();
      if (window.navigator.vibrate) {
        window.navigator.vibrate(1000);
      }
    }
    //at the end of the timer, alert the user
    alert("Time's up!");
  };

  const { pause } = useTimer({
    expiryTimestamp: expiryTimestamp,
    onExpire: handleTimerComplete,
    autoStart: false,
    interval: 1000, // set the interval to 1 second
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
  const startTimer = (expiryTimestamp) => {
    clearInterval(intervalIdRef.current);
    const newIntervalId = setInterval(() => {
      const timeRemaining = Math.max(expiryTimestamp - Date.now(), 0);
      if (timeRemaining <= 0) {
        setIsExpired(true);
        clearInterval(newIntervalId);
        handleTimerComplete();
      }
      setTimeRemaining(timeRemaining);
    }, 1);
    intervalIdRef.current = newIntervalId;
  };

  const handleAlarmLoaded = (event = null) => {
    const audioElement = event ? event.target : new Audio(cool_alarm);
    setAlarm(audioElement);
    audioElement.play().then(() => {
      audioElement.pause();
      audioElement.currentTime = 0;
      audioElement.muted = false;
    });
  };

  const isSafari = () => {
    const ua = navigator.userAgent.toLowerCase();
    return ua.indexOf("safari") !== -1 && ua.indexOf("chrome") === -1;
  };

  return (
    <div className="timer-component">
      <div>
        <div className="label-container">
          <label className="label" htmlFor="days">
            Days:
          </label>
          <input
            className="input"
            type="number"
            id="days"
            value={selectedDays}
            onChange={handleDaysChange}
          />
        </div>
        <div className="label-container">
          <label className="label" htmlFor="hours">
            Hours:
          </label>
          <input
            className="input"
            type="number"
            id="hours"
            value={selectedHours}
            onChange={handleHoursChange}
          />
        </div>
        <div className="label-container">
          <label className="label" htmlFor="minutes">
            Minutes:
          </label>
          <input
            className="input"
            type="number"
            id="minutes"
            value={selectedMinutes}
            onChange={handleMinutesChange}
          />
        </div>
        <div className="label-container">
          <label className="label" htmlFor="seconds">
            Seconds:
          </label>
          <input
            className="input"
            type="number"
            id="seconds"
            value={selectedSeconds}
            onChange={handleSecondsChange}
          />
        </div>
      </div>
      <br />
      <br />
      <br />

      <img src={memory} alt="memory" />
      <br />
      <div>
        <button
          className="button"
          onClick={handleStartClick}
          disabled={isRunning}
        >
          Start
        </button>
        <button
          className="button"
          onClick={handlePauseClick}
          disabled={!isRunning}
        >
          Pause
        </button>
        <button
          className="button"
          onClick={handleResumeClick}
          disabled={isRunning || !isPaused}
        >
          Resume
        </button>
        <button className="button" onClick={handleRestartClick}>
          Restart
        </button>
      </div>
      <br />
      <br />
      <br />
      <div className="Time-remaining-container">
        <p className="Time-remaining">
          Time Remaining: {formatTime(timeRemaining)}
        </p>
      </div>
      <audio src={cool_alarm} />
    </div>
  );
}
