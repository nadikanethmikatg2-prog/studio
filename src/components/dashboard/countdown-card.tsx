"use client";

import { useState, useEffect } from "react";
import { Timer } from "lucide-react";

const examDate = new Date("2027-08-01T00:00:00");

export function CountdownCard() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    // This check is to avoid "Text content does not match server-rendered HTML" error
    // by ensuring the countdown only runs on the client.
    if (typeof window === 'undefined') {
      return;
    }

    const calculateTimeLeft = () => {
      const difference = +examDate - +new Date();
      let timeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };

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

    // Set initial value
    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const timeParts = [
    { label: "Days", value: timeLeft.days },
    { label: "Hours", value: timeLeft.hours },
    { label: "Mins", value: timeLeft.minutes },
  ];

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2 text-primary text-sm">
        <Timer className="h-4 w-4" />
        <span>A/L 2027</span>
      </div>
      <div className="flex gap-2 text-center">
          {timeParts.map((part) => (
            <div
              key={part.label}
              className="flex flex-col items-center justify-center rounded-md bg-primary/20 px-2 py-1"
            >
              <div className="text-sm font-bold text-primary-foreground">
                {String(part.value).padStart(2, "0")}
              </div>
              <div className="text-xs uppercase tracking-wider text-primary-foreground/80">
                {part.label}
              </div>
            </div>
          ))}
        </div>
    </div>
  );
}
