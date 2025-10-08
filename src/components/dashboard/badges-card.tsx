
"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Award, Medal, Trophy, Brain, Flame, Target } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";
import { cn } from "@/lib/utils";

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

const getProgress = (badge: (typeof allBadges)[0], props: BadgesCardProps) => {
    switch (badge.type) {
      case 'hours': return (props.totalHours / badge.threshold) * 100;
      case 'streak': return (props.longestStreak / badge.threshold) * 100;
      case 'tasks': return (props.totalTasksCompleted / badge.threshold) * 100;
      default: return 0;
    }
};


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
            <Trophy className="h-5 w-5 text-primary"/>
            {t('achievements')}
        </CardTitle>
        <CardDescription>{t('achievementsDescription', { unlocked: unlockedCount, total: allBadges.length })}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {allBadges.map((badge) => {
            const unlocked = isUnlocked(badge);
            const progress = unlocked ? 100 : getProgress(badge, {totalHours, longestStreak, totalTasksCompleted});
            return (
                <div key={badge.id} className={cn(
                    "flex items-center gap-4 p-3 rounded-lg transition-all",
                    unlocked ? "bg-primary/20" : "bg-muted/50"
                )}>
                    <div className={cn(
                        "flex items-center justify-center h-10 w-10 rounded-full flex-shrink-0",
                        unlocked ? "bg-primary text-primary-foreground" : "bg-background text-muted-foreground"
                    )}>
                        <badge.icon className="h-6 w-6" />
                    </div>
                    <div className="flex-grow w-full">
                        <div className="flex justify-between items-start">
                            <p className="font-semibold text-sm">{badge.name}</p>
                            {!unlocked && (
                                <p className="text-xs text-muted-foreground">
                                    {badge.type === 'hours' && `${totalHours.toFixed(1)}/${badge.threshold}`}
                                    {badge.type === 'streak' && `${longestStreak}/${badge.threshold}`}
                                    {badge.type === 'tasks' && `${totalTasksCompleted}/${badge.threshold}`}
                                </p>
                            )}
                        </div>
                        <p className="text-xs text-muted-foreground mb-1">{badge.description}</p>
                        {!unlocked && <Progress value={progress} className="h-1.5" />}
                    </div>
                </div>
            )
        })}
      </CardContent>
    </Card>
  );
}
