"use client";

import React, { useState, useTransition } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Plus, Clock, ListTodo, Activity } from "lucide-react";
import type { Subject, Subjects } from "@/app/page";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface ActivityLoggerCardProps {
  subjects: Subjects;
  onLogHours: (subjectKey: string, hours: number) => void;
}

export function ActivityLoggerCard({ subjects, onLogHours }: ActivityLoggerCardProps) {
  const [selectedSubject, setSelectedSubject] = useState<string>("chemistry");
  const [hoursToAdd, setHoursToAdd] = useState("");
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const handleAddHours = (hours: number) => {
    if (selectedSubject && !isNaN(hours) && hours > 0) {
      startTransition(() => {
        onLogHours(selectedSubject, hours);
        setHoursToAdd("");
        toast({
          title: "Success",
          description: `${hours} hour(s) added to ${subjects[selectedSubject].name}.`,
        });
      });
    } else {
      toast({
        variant: "destructive",
        title: "Invalid Input",
        description: "Please select a subject and enter a positive number for hours.",
      });
    }
  };

  const handleLogHoursFromInput = () => {
    const hours = parseFloat(hoursToAdd);
    handleAddHours(hours);
  };


  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
            <Activity className="text-primary"/>
            Log Your Study Hours
        </CardTitle>
        <CardDescription>
          Select a subject, then log your study time. Use the chat to add tasks.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label className="mb-2 block">
            1. Select a subject
          </Label>
           <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {Object.entries(subjects).map(([key, subject]) => {
              const Icon = subject.icon;
              return (
                <Button
                  key={key}
                  variant="outline"
                  className={cn(
                    "h-20 flex-col gap-2 justify-center text-center",
                    selectedSubject === key ? "border-primary ring-2 ring-primary" : ""
                  )}
                  onClick={() => setSelectedSubject(key)}
                >
                  <Icon className="h-6 w-6" style={{ color: subject.color }} />
                  <span className="text-xs">{subject.name}</span>
                </Button>
              );
            })}
          </div>
        </div>

        <div className="space-y-2">
            <Label htmlFor={`hours-input`} className="flex items-center gap-2"><Clock /> 2. Log Study Hours</Label>
            <div className="flex gap-2 items-center">
                <Input
                id={`hours-input`}
                type="number"
                value={hoursToAdd}
                onChange={(e) => setHoursToAdd(e.target.value)}
                placeholder="e.g., 1.5"
                onKeyDown={(e) => e.key === 'Enter' && handleLogHoursFromInput()}
                disabled={!selectedSubject}
                />
                <Button onClick={handleLogHoursFromInput} disabled={isPending || !selectedSubject || !hoursToAdd}>
                Log
                </Button>
            </div>
            <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" onClick={() => handleAddHours(0.5)} disabled={!selectedSubject}>+30m</Button>
                <Button variant="outline" size="sm" onClick={() => handleAddHours(1)} disabled={!selectedSubject}>+1h</Button>
                <Button variant="outline" size="sm" onClick={() => handleAddHours(2)} disabled={!selectedSubject}>+2h</Button>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
