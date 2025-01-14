import { useState, useEffect, useCallback } from "react";
import useAudio from "./useAudio";

interface Time {
  hours: number;
  minutes: number;
  seconds: number;
}

interface Timer extends Time {
  id: string;
  label: string;
}

interface QueueTimerState {
  timers: Timer[];
  currentIndex: number;
  isRunning: boolean;
  currentTime: number;
  isCompleted: boolean;
  isInfiniteMode: boolean;
}

function getSeconds({ hours, minutes, seconds }: Time) {
  return hours * 3600 + minutes * 60 + seconds;
}

function useQueueTimer() {
  const [state, setState] = useState<QueueTimerState>({
    timers: [],
    currentIndex: 0,
    isRunning: false,
    currentTime: 0,
    isCompleted: false,
    isInfiniteMode: false,
  });

  const { playTimerComplete, playAllComplete } = useAudio();

  const addTimer = useCallback((timer: Omit<Timer, "id">) => {
    setState((prev) => ({
      ...prev,
      timers: [
        ...prev.timers,
        {
          ...timer,
          id: Date.now().toString(),
          label:
            timer.label.trim().length === 0
              ? `label${prev.timers.length + 1}`
              : timer.label,
        },
      ],
    }));
  }, []);

  const removeTimer = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      timers: prev.timers.filter((timer) => timer.id !== id),
    }));
  }, []);

  const toggleInfiniteMode = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isInfiniteMode: !prev.isInfiniteMode,
      isCompleted: false, // 무한 모드 전환시 완료 상태 리셋
    }));
  }, []);

  const start = useCallback(() => {
    setState((prev) => {
      if (prev.timers.length === 0) return prev;

      const currentTimer = prev.timers[prev.currentIndex];
      const totalSeconds = getSeconds(currentTimer);

      return {
        ...prev,
        isRunning: true,
        currentTime: totalSeconds,
        isCompleted: false,
      };
    });
  }, []);

  const pause = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isRunning: false,
    }));
  }, []);

  const reset = useCallback(() => {
    setState((prev) => ({
      ...prev,
      currentIndex: 0,
      isRunning: false,
      currentTime: 0,
      isCompleted: false,
    }));
  }, []);

  useEffect(() => {
    let id: number | undefined;

    if (state.isRunning && state.currentTime >= 0) {
      id = window.setInterval(() => {
        setState((prev) => {
          if (prev.currentTime < 1) {
            if (prev.currentIndex < prev.timers.length - 1) {
              playTimerComplete();

              const nextIndex = prev.currentIndex + 1;
              const nextTimer = prev.timers[nextIndex];
              const nextTotalSeconds = getSeconds(nextTimer);

              return {
                ...prev,
                currentIndex: nextIndex,
                currentTime: nextTotalSeconds,
              };
            } else {
              if (prev.isInfiniteMode) {
                playTimerComplete();

                const firstTimer = prev.timers[0];
                const nextTotalSeconds = getSeconds(firstTimer);

                return {
                  ...prev,
                  currentIndex: 0,
                  currentTime: nextTotalSeconds,
                };
              } else {
                playAllComplete();

                return {
                  ...prev,
                  currentTime: 0,
                  isRunning: false,
                  isCompleted: true,
                };
              }
            }
          }

          return {
            ...prev,
            currentTime: prev.currentTime - 1,
          };
        });
      }, 1000);
    }

    return () => {
      if (id) clearInterval(id);
    };
  }, [state.isRunning, state.currentTime, playTimerComplete, playAllComplete]);

  return {
    ...state,
    addTimer,
    removeTimer,
    toggleInfiniteMode,
    start,
    pause,
    reset,
  };
}

export default useQueueTimer;
