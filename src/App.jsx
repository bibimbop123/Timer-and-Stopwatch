import "./App.css";
import MyTimer from "./components/Timer";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <p>Timer and Stopwatch</p>
      </header>
      <div className="App-body">
        <p>Timer</p>
        {/* <Timer /> */}

        <MyTimer />
        <p>Stopwatch</p>
      </div>
    </div>
  );
}

export default App;
