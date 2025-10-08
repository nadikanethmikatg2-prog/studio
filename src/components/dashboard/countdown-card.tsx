
"use client";

import { useState, useEffect } from "react";
import { Timer } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";
import { Card } from "../ui/card";
import { cn } from "@/lib/utils";

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
    <Card className="p-0.5 md:w-auto">
        <div className="flex h-full items-center gap-3 text-center px-2">
            <div className="flex items-center gap-1.5 text-primary pr-3 border-r border-border h-full">
                <Timer className="h-5 w-5" />
                <span className="text-xs font-semibold">{t("al2027")}</span>
            </div>
            <div className="flex items-center gap-1">
                {timeParts.map((part) => (
                    <div
                    key={part.label}
                    className="flex flex-col items-center justify-center rounded-md bg-primary/10 px-1 py-0 w-9 h-8"
                    >
                    <div className="text-sm font-bold text-foreground/90">
                        {String(part.value).padStart(2, "0")}
                    </div>
                    <div className="text-[7px] uppercase tracking-wider text-foreground/70 -mt-1">
                        {part.label}
                    </div>
                    </div>
                ))}
            </div>
        </div>
    </Card>
  );
}
