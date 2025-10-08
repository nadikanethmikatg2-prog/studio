
"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Flame, Star, Hourglass } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";

interface StatsCardProps {
  currentStreak: number;
  longestStreak: number;
  totalHours: number;
}

export function StatsCard({ currentStreak, longestStreak, totalHours }: StatsCardProps) {
  const { t } = useLanguage();

  const stats = [
    {
      icon: Flame,
      label: t("currentStreak"),
      value: currentStreak,
      unit: t("daysSuffix"),
      color: "text-orange-400",
    },
    {
      icon: Star,
      label: t("longestStreak"),
      value: longestStreak,
      unit: t("daysSuffix"),
      color: "text-yellow-400",
    },
    {
      icon: Hourglass,
      label: t("totalHours"),
      value: totalHours.toFixed(1),
      unit: t("hrsSuffix"),
      color: "text-blue-400",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("statsTitle")}</CardTitle>
        <CardDescription>{t("statsDescription")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {stats.map((stat, index) => (
          <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted">
            <div className="flex items-center gap-3">
              <stat.icon className={`h-6 w-6 ${stat.color}`} />
              <span className="font-medium text-sm text-muted-foreground">{stat.label}</span>
            </div>
            <div className="font-bold text-lg">
              {stat.value} <span className="text-sm text-muted-foreground">{stat.unit}</span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
