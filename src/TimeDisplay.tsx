interface TimeDisplayProps {
  time: number;
}

function TimeDisplay({ time }: TimeDisplayProps) {
  const hours = Math.floor(time / 3600);
  const minutes = Math.floor((time % 3600) / 60);
  const seconds = time % 60;

  const formattedHours = hours.toString().padStart(2, "0");
  const formattedMinutes = minutes.toString().padStart(2, "0");
  const formattedSeconds = seconds.toString().padStart(2, "0");

  return (
    <time className="time-display">
      <div className="main-time">
        {formattedHours}:{formattedMinutes}:{formattedSeconds}
      </div>
    </time>
  );
}

export default TimeDisplay;
