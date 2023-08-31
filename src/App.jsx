import "./App.css";
import MyTimer from "./components/Timer";
import cool_alarm from "./assets/cool_alarm.mp3";

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
      </div>
      <audio id="alarm" src={cool_alarm} />
      <footer className="App-footer">
        <p>Created by:Brian Kim &copy; 2021</p>
      </footer>
    </div>
  );
}

export default App;
