import { useEffect, useState } from "react";

function useTimer(initialTime: number) {
  const [time, setTime] = useState(initialTime);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    setTime(initialTime);
  }, [initialTime]);

  useEffect(() => {
    let id: number | undefined;

    if (started && time > 0) {
      id = window.setInterval(() => {
        setTime((prevTime) => {
          if (prevTime <= 1) {
            setStarted(false);
            return 0;
          }

          return prevTime - 1;
        });
      }, 1000);
    }

    return () => {
      if (id) clearInterval(id);
    };
  }, [started, time]);

  const start = () => {
    setStarted(true);
  };

  return { time, start };
}

export default useTimer;
