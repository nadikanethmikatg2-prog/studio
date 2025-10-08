
"use client";

import { useState, useEffect } from "react";
import { Timer } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";
import { Card } from "../ui/card";

const examDate = new Date("2027-08-01T00:00:00");

export function CountdownCard() {
  const { t } = useLanguage();
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
    { label: t("days"), value: timeLeft.days },
    { label: t("hours"), value: timeLeft.hours },
    { label: t("mins"), value: timeLeft.minutes },
  ];

  return (
    <Card className="p-4">
        <div className="flex items-center gap-4 text-center">
            <div className="flex flex-col items-center gap-1 text-primary">
                <Timer className="h-5 w-5" />
                <span className="text-xs font-semibold">{t("al2027")}</span>
            </div>
            <div className="flex items-center gap-3">
                {timeParts.map((part) => (
                    <div
                    key={part.label}
                    className="flex flex-col items-center justify-center rounded-md bg-primary/20 px-4 py-2 w-20"
                    >
                    <div className="text-2xl font-bold text-foreground/90">
                        {String(part.value).padStart(2, "0")}
                    </div>
                    <div className="text-xs uppercase tracking-wider text-foreground/80">
                        {part.label}
                    </div>
                    </div>
                ))}
            </div>
        </div>
    </Card>
  );
}
