import React from "react";

interface CountdownTimerProps {
  targetDate: string; // ISO date string, e.g., "2025-01-01T00:00:00Z"
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ targetDate }) => {
  const calculateTimeLeft = () => {
    const difference = +new Date(targetDate) - +new Date();
    let timeLeft: { days?: number; hours?: number; minutes?: number; seconds?: number } = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = React.useState(calculateTimeLeft());

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearTimeout(timer);
  });

  const timerComponents: JSX.Element[] = [];

  Object.keys(timeLeft).forEach((interval) => {
    if (timeLeft[interval as keyof typeof timeLeft] === undefined) {
      return;
    }

    timerComponents.push(
      <span key={interval} className="text-5xl md:text-6xl font-extrabold text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)] mx-2">
        {timeLeft[interval as keyof typeof timeLeft]} <span className="text-xl font-medium block">{interval}</span>
      </span>
    );
  });

  return (
    <div className="text-center p-4">
      <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white drop-shadow-md">GTA6 Countdown</h2>
      {timerComponents.length ? (
        <div className="flex justify-center items-baseline">
          {timerComponents}
        </div>
      ) : (
        <span className="text-3xl font-medium text-green-400 drop-shadow-md">The wait is over!</span>
      )}
    </div>
  );
};

export default CountdownTimer;