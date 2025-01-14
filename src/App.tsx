import { useState } from "react";
import "./App.css";
import TimeDisplay from "./TimeDisplay";
import useQueueTimer from "./useQueueTimer";

function App() {
  const [label, setLabel] = useState<string>("");
  const [hours, setHours] = useState<number>(0);
  const [minutes, setMinutes] = useState<number>(0);
  const [seconds, setSeconds] = useState<number>(0);

  const {
    timers,
    currentIndex,
    isRunning,
    currentTime,
    isCompleted,
    isInfiniteMode,
    addTimer,
    removeTimer,
    toggleInfiniteMode,
    start,
    pause,
    reset,
  } = useQueueTimer();

  const handleAddTimer = () => {
    if (hours === 0 && minutes === 0 && seconds === 0) return;

    addTimer({ label, hours, minutes, seconds });
    setLabel("");
    setHours(0);
    setMinutes(0);
    setSeconds(0);
  };

  const handleNumberInput = (
    value: string,
    setter: (num: number) => void,
    max: number
  ) => {
    const num = parseInt(value) || 0;

    if (num >= 0 && num <= max) {
      setter(num);
    }
  };

  return (
    <>
      <h1>Timer</h1>
      {!isRunning && (
        <div className="inputs">
          <input
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="Label"
          />
          <input
            type="number"
            value={hours}
            onChange={(e) => handleNumberInput(e.target.value, setHours, 23)}
            min="0"
            max="23"
            placeholder="Hours"
          />
          <input
            type="number"
            value={minutes}
            onChange={(e) => handleNumberInput(e.target.value, setMinutes, 59)}
            min="0"
            max="59"
            placeholder="Minutes"
          />
          <input
            type="number"
            value={seconds}
            onChange={(e) => handleNumberInput(e.target.value, setSeconds, 59)}
            min="0"
            max="59"
            placeholder="Seconds"
          />
          <button onClick={handleAddTimer}>Add Timer</button>
        </div>
      )}

      {!isRunning && (
        <div className="timer-list">
          {timers.map((timer, index) => (
            <div
              key={timer.id}
              className={`timer-item ${index === currentIndex ? "active" : ""}`}
            >
              <span>{timer.label} </span>
              <span>
                {timer.hours.toString().padStart(2, "0")}:
                {timer.minutes.toString().padStart(2, "0")}:
                {timer.seconds.toString().padStart(2, "0")}
              </span>
              <button
                onClick={() => removeTimer(timer.id)}
                disabled={isRunning}
              >
                x
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="controls">
        <label className="infinite-mode">
          <input
            type="checkbox"
            checked={isInfiniteMode}
            onChange={toggleInfiniteMode}
            disabled={isRunning}
          />
          Infinite Loop Mode
        </label>

        {!isRunning && !isCompleted && timers.length > 0 && (
          <button onClick={start}>Start</button>
        )}
        {isRunning && <button onClick={pause}>Pause</button>}
        {(isCompleted || isRunning) && <button onClick={reset}>Reset</button>}
      </div>

      {timers.length > 0 && (
        <div className="current-timer">
          <div>
            {currentIndex + 1}/{timers.length}
          </div>
          <div className="label">{timers[currentIndex].label}</div>
          <TimeDisplay time={currentTime} />
        </div>
      )}

      {isCompleted && !isInfiniteMode && <div>All timers completed!</div>}
    </>
  );
}

export default App;
