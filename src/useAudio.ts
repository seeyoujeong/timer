import { useCallback } from "react";

function useAudio() {
  const playSound = useCallback((frequency: number, duration: number) => {
    const audioContext = new AudioContext();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = frequency;
    gainNode.gain.value = 1.9;

    oscillator.start();

    setTimeout(() => {
      oscillator.stop();
      audioContext.close();
    }, duration);
  }, []);

  const playTimerComplete = useCallback(() => {
    playSound(880, 200);
  }, [playSound]);

  const playAllComplete = useCallback(() => {
    setTimeout(() => playSound(523.25, 200), 0);
    setTimeout(() => playSound(659.25, 200), 200);
    setTimeout(() => playSound(783.99, 300), 400);
  }, [playSound]);

  return { playTimerComplete, playAllComplete };
}

export default useAudio;
