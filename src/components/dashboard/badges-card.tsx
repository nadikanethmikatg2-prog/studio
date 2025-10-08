
"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Award, Medal, Trophy, Brain, Flame, Target } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface BadgesCardProps {
  totalHours: number;
  longestStreak: number;
  totalTasksCompleted: number;
}

const allBadges = [
  // Hour-based badges
  { id: 'hours-10', type: 'hours', threshold: 10, name: 'Novice Learner', description: 'Logged 10 total study hours.', icon: Medal },
  { id: 'hours-50', type: 'hours', threshold: 50, name: 'Dedicated Scholar', description: 'Logged 50 total study hours.', icon: Award },
  { id: 'hours-100', type: 'hours', threshold: 100, name: 'Study Master', description: 'Logged 100 total study hours.', icon: Trophy },
  // Streak-based badges
  { id: 'streak-3', type: 'streak', threshold: 3, name: 'Consistent Starter', description: 'Maintained a 3-day study streak.', icon: Flame },
  { id: 'streak-7', type: 'streak', threshold: 7, name: 'Weekly Warrior', description: 'Maintained a 7-day study streak.', icon: Flame },
  { id: 'streak-30', type: 'streak', threshold: 30, name: 'Monthly Marathoner', description: 'Maintained a 30-day study streak.', icon: Flame },
  // Task-based badges
  { id: 'tasks-10', type: 'tasks', threshold: 10, name: 'Task Tackler', description: 'Completed 10 to-do items.', icon: Target },
  { id: 'tasks-50', type: 'tasks', threshold: 50, name: 'Productivity Pro', description: 'Completed 50 to-do items.', icon: Target },
  { id: 'tasks-100', type: 'tasks', threshold: 100, name: 'Completionist', description: 'Completed 100 to-do items.', icon: Brain },
];


export function BadgesCard({ totalHours, longestStreak, totalTasksCompleted }: BadgesCardProps) {
  const { t } = useLanguage();

  const isUnlocked = (badge: (typeof allBadges)[0]) => {
    switch (badge.type) {
      case 'hours': return totalHours >= badge.threshold;
      case 'streak': return longestStreak >= badge.threshold;
      case 'tasks': return totalTasksCompleted >= badge.threshold;
      default: return false;
    }
  };

  const unlockedCount = allBadges.filter(isUnlocked).length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-primary"/>
            {t('achievements')}
        </CardTitle>
        <CardDescription>{t('achievementsDescription', { unlocked: unlockedCount, total: allBadges.length })}</CardDescription>
      </CardHeader>
      <CardContent>
        <TooltipProvider>
            <div className="grid grid-cols-5 gap-3">
            {allBadges.map((badge) => (
                <Tooltip key={badge.id}>
                <TooltipTrigger asChild>
                    <div
                        className={cn(
                            "flex items-center justify-center p-2 rounded-lg aspect-square border-2 transition-all",
                            isUnlocked(badge)
                            ? "bg-primary/20 border-primary/50 text-primary"
                            : "bg-muted text-muted-foreground opacity-50"
                        )}
                    >
                        <badge.icon className="h-6 w-6" />
                    </div>
                </TooltipTrigger>
                <TooltipContent>
                    <p className="font-bold">{badge.name}</p>
                    <p className="text-sm text-muted-foreground">{badge.description}</p>
                    {!isUnlocked(badge) && <p className="text-xs text-destructive mt-1">{t('locked')}</p>}
                </TooltipContent>
                </Tooltip>
            ))}
            </div>
        </TooltipProvider>
      </CardContent>
    </Card>
  );
}
