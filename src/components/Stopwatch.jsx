import React, { useState, useEffect, useRef } from "react";
import { useStopwatch } from "react-timer-hook";

export default function MyStopwatch() {
  const { seconds, minutes, hours, days, isRunning, start, pause, reset } =
    useStopwatch({ autoStart: false });

  const [milliseconds, setMilliseconds] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setMilliseconds((prevMillis) => prevMillis + 10); // Increment milliseconds by 10 every 10ms
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
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h1>Stopwatch</h1>
      <div style={{ fontSize: "100px" }}>
        <span>{days}</span>:<span>{hours}</span>:<span>{minutes}</span>:
        <span>{seconds}</span>.<span>{milliseconds}</span>
      </div>
      <p>{isRunning ? "Running" : "Not running"}</p>
      <button onClick={start}>Start</button>
      <button onClick={pause}>Pause</button>
      <button onClick={handleResetClick}>Reset</button>
    </div>
  );
}
