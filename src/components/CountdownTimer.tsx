import { useState, useEffect } from "react";
import { Clock } from "lucide-react";

const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 23,
    minutes: 18,
    seconds: 45,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        let { hours, minutes, seconds } = prev;
        
        seconds -= 1;
        
        if (seconds < 0) {
          seconds = 59;
          minutes -= 1;
        }
        
        if (minutes < 0) {
          minutes = 59;
          hours -= 1;
        }
        
        if (hours < 0) {
          hours = 23;
          minutes = 59;
          seconds = 59;
        }
        
        return { hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex items-center gap-2 text-amber-400">
      <Clock className="w-4 h-4 animate-pulse" />
      <div className="flex items-center gap-1 font-mono text-sm font-bold">
        <span className="bg-amber-500/20 px-2 py-0.5 rounded">{timeLeft.hours.toString().padStart(2, '0')}</span>
        <span>:</span>
        <span className="bg-amber-500/20 px-2 py-0.5 rounded">{timeLeft.minutes.toString().padStart(2, '0')}</span>
        <span>:</span>
        <span className="bg-amber-500/20 px-2 py-0.5 rounded">{timeLeft.seconds.toString().padStart(2, '0')}</span>
      </div>
    </div>
  );
};

export default CountdownTimer;
