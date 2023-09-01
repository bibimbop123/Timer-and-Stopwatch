import "./App.css";
import MyTimer from "./components/Timer";
import cool_alarm from "./assets/cool_alarm.mp3";
import MyStopwatch from "./components/Stopwatch";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <p>Timer and Stopwatch</p>
      </header>
      <div className="App-body">
        <p className="title">Timer</p>
        {/* <Timer /> */}

        <MyTimer />
        <p className="title">Stopwatch</p>
        {/* <Stopwatch /> */}
        <MyStopwatch />
      </div>
      <audio id="alarm" src={cool_alarm} />
      <footer className="App-footer">
        <p>
          <a
            className="App-link"
            href="https://github.com/bibimbop123"
            rel="noreferrer"
            target="_blank"
          >
            Github
          </a>
        </p>
        <p>
          <a
            className="App-link"
            href="https://www.linkedin.com/in/bibimbop/"
            rel="noreferrer"
            target="_blank"
          >
            LinkedIn
          </a>
        </p>
        <p>Created by:Brian Kim &copy; 2023</p>
      </footer>
    </div>
  );
}

export default App;
