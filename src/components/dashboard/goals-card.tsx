
"use client";

import React, { useState, useTransition } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Target, Wand2 } from "lucide-react";
import type { Subjects } from "@/app/page";
import { useToast } from "@/hooks/use-toast";
import { generateStudyGoalsAction } from "@/app/actions";
import { Skeleton } from "../ui/skeleton";
import { useAuth } from "@/hooks/use-auth";

interface GoalsCardProps {
  subjects: Subjects;
  onUpdate: (newGoals: { [key: string]: number }) => void;
  stream: string | null;
}

export function GoalsCard({ subjects, onUpdate, stream }: GoalsCardProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const totalGoalHours = Object.values(subjects).reduce((sum, s) => sum + s.goalHours, 0);

  const handleGenerateGoals = () => {
    if (!user) {
        toast({
            variant: "destructive",
            title: "Error",
            description: "You must be logged in to generate goals.",
        });
        return;
    }
     if (!stream) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not determine study stream. Please refresh.",
      });
      return;
    }

    startTransition(async () => {
        const serializableSubjects = Object.fromEntries(
            Object.entries(subjects).map(([key, value]) => [
              key,
              {
                name: value.name,
                todos: value.todos.map((t) => t.text),
                totalHours: value.totalHours,
                goalHours: value.goalHours,
              },
            ])
          );

      const result = await generateStudyGoalsAction(stream, serializableSubjects);

      if (result.success && result.goals) {
        onUpdate(result.goals);
        toast({
          title: "AI Goals Generated",
          description: "Your weekly study goals have been updated by the AI.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.message,
        });
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-6 w-6 text-primary" />
          Weekly Goals
        </CardTitle>
        <CardDescription>
          Track your progress towards your weekly study hour goals.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between p-3 rounded-lg bg-muted">
            <div className="text-sm font-medium text-muted-foreground">Total Weekly Goal</div>
            <div className="text-2xl font-bold text-primary">{totalGoalHours.toFixed(1)} hrs</div>
        </div>

        {isPending ? (
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : (
          Object.values(subjects).map((subject) => {
            const progress =
              subject.goalHours > 0
                ? (subject.totalHours / subject.goalHours) * 100
                : 0;
            return (
              <div key={subject.name} className="space-y-2">
                <div className="flex justify-between text-sm items-center">
                  <Label className="font-medium flex items-center gap-2">
                    <subject.icon className="w-4 h-4" style={{ color: subject.color }}/>
                    {subject.name}
                  </Label>
                  <span className="text-muted-foreground">
                    {subject.totalHours.toFixed(1)} / {subject.goalHours} hrs
                  </span>
                </div>
                <Progress value={progress} indicatorClassName="transition-all duration-500" style={{'--indicator-color': subject.color} as React.CSSProperties} />
              </div>
            );
          })
        )}
         <Button onClick={handleGenerateGoals} disabled={isPending || !user} className="w-full">
            <Wand2 className="h-4 w-4 mr-2" />
            {isPending ? "Generating..." : "Generate Goals with AI"}
        </Button>
      </CardContent>
    </Card>
  );
}
