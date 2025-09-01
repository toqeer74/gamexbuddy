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
      <span key={interval} className="text-4xl font-bold text-primary mx-2">
        {timeLeft[interval as keyof typeof timeLeft]} {interval}{" "}
      </span>
    );
  });

  return (
    <div className="text-center p-4">
      <h2 className="text-2xl font-semibold mb-4">GTA6 Countdown</h2>
      {timerComponents.length ? (
        <div className="flex justify-center items-baseline">
          {timerComponents}
        </div>
      ) : (
        <span className="text-xl font-medium text-green-500">The wait is over!</span>
      )}
    </div>
  );
};

export default CountdownTimer;