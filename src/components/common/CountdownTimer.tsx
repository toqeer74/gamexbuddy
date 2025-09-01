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

    // Assign different neon colors based on interval for variety
    let neonColorClass = "";
    switch (interval) {
      case "days":
        neonColorClass = "text-cyan-400";
        break;
      case "hours":
        neonColorClass = "text-pink-400";
        break;
      case "minutes":
        neonColorClass = "text-yellow-400";
        break;
      case "seconds":
        neonColorClass = "text-green-400";
        break;
      default:
        neonColorClass = "text-white";
    }

    timerComponents.push(
      <div key={interval} className="flex flex-col items-center mx-2">
        <span className={`text-5xl md:text-7xl font-mono font-extrabold neon-glow ${neonColorClass}`}>
          {String(timeLeft[interval as keyof typeof timeLeft]).padStart(2, '0')}
        </span>
        <span className="text-xl font-medium block text-white opacity-80 uppercase">{interval}</span>
      </div>
    );
  });

  return (
    <div className="text-center p-4">
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