"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
    { label: "Secs", value: timeLeft.seconds },
  ];

  return (
    <Card className="bg-primary/10 border-primary/20 text-primary-foreground">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center text-base gap-2 text-primary">
          <Timer className="h-5 w-5" />
          Countdown to A/L 2027
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-4 gap-2 text-center">
          {timeParts.map((part) => (
            <div
              key={part.label}
              className="flex flex-col items-center justify-center p-2 rounded-lg bg-primary/20"
            >
              <div className="text-2xl font-bold text-primary-foreground">
                {String(part.value).padStart(2, "0")}
              </div>
              <div className="text-xs uppercase tracking-wider text-primary-foreground/80">
                {part.label}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
