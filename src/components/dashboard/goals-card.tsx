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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Target, Edit } from "lucide-react";
import type { Subjects, Subject } from "@/app/page";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

interface GoalsCardProps {
  subjects: Subjects;
  onUpdate: (key: string, updatedData: Partial<Subject>) => void;
}

export function GoalsCard({ subjects, onUpdate }: GoalsCardProps) {
  const [editableGoals, setEditableGoals] = useState<Record<string, number>>(
    {}
  );
  const [isPending, startTransition] = useTransition();

  const handleGoalChange = (key: string, value: string) => {
    const numericValue = parseFloat(value);
    setEditableGoals((prev) => ({
      ...prev,
      [key]: isNaN(numericValue) ? 0 : numericValue,
    }));
  };

  const handleSaveGoals = () => {
    startTransition(() => {
      Object.entries(editableGoals).forEach(([key, goalHours]) => {
        if (subjects[key].goalHours !== goalHours) {
          onUpdate(key, { goalHours });
        }
      });
    });
  };

  React.useEffect(() => {
    const initialGoals: Record<string, number> = {};
    Object.entries(subjects).forEach(([key, subject]) => {
      initialGoals[key] = subject.goalHours;
    });
    setEditableGoals(initialGoals);
  }, [subjects]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="space-y-1.5">
          <CardTitle className="flex items-center gap-2">
            <Target className="h-6 w-6 text-primary" />
            Weekly Goals
          </CardTitle>
          <CardDescription>Track your weekly study hour goals.</CardDescription>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon">
              <Edit className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Weekly Goals</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              {Object.entries(subjects).map(([key, subject]) => (
                <div key={key} className="grid grid-cols-3 items-center gap-4">
                  <Label htmlFor={`goal-${key}`} className="text-right">
                    {subject.name}
                  </Label>
                  <Input
                    id={`goal-${key}`}
                    type="number"
                    value={editableGoals[key] ?? subject.goalHours}
                    onChange={(e) => handleGoalChange(key, e.target.value)}
                    className="col-span-2"
                  />
                </div>
              ))}
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button
                  type="button"
                  onClick={handleSaveGoals}
                  disabled={isPending}
                >
                  Save Changes
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent className="space-y-4">
        {Object.values(subjects).map((subject) => {
          const progress =
            subject.goalHours > 0
              ? (subject.totalHours / subject.goalHours) * 100
              : 0;
          return (
            <div key={subject.name} className="space-y-2">
              <div className="flex justify-between text-sm">
                <Label>{subject.name}</Label>
                <span className="text-muted-foreground">
                  {subject.totalHours.toFixed(1)} / {subject.goalHours} hrs
                </span>
              </div>
              <Progress value={progress} />
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
