
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
import { Clock, Activity, ListTodo, Plus } from "lucide-react";
import type { Subjects } from "@/app/page";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/hooks/use-language";

interface ActivityLoggerCardProps {
  subjects: Subjects;
  onLogHours: (subjectKey: string, hours: number) => void;
  onAddTask: (subjectKey: string, task: string) => void;
}

export function ActivityLoggerCard({
  subjects,
  onLogHours,
  onAddTask,
}: ActivityLoggerCardProps) {
  const { t } = useLanguage();
  const [selectedSubject, setSelectedSubject] = useState<string>(Object.keys(subjects)[0]);
  const [hoursToAdd, setHoursToAdd] = useState("");
  const [taskToAdd, setTaskToAdd] = useState("");
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const handleAddHours = (hours: number) => {
    if (selectedSubject && !isNaN(hours) && hours > 0) {
      startTransition(() => {
        onLogHours(selectedSubject, hours);
        setHoursToAdd("");
        toast({
          title: t("toastSuccess"),
          description: t("toastHoursAdded", { hours, subjectName: subjects[selectedSubject].name }),
        });
      });
    } else {
      toast({
        variant: "destructive",
        title: t("toastInvalidInput"),
        description: t("toastInvalidHours"),
      });
    }
  };

  const handleLogHoursFromInput = () => {
    const hours = parseFloat(hoursToAdd);
    handleAddHours(hours);
  };

  const handleAddTask = () => {
    if (selectedSubject && taskToAdd.trim() !== "") {
      startTransition(() => {
        onAddTask(selectedSubject, taskToAdd.trim());
        toast({
          title: t("toastTaskAdded"),
          description: t("toastTaskAddedTo", { task: taskToAdd.trim(), subjectName: subjects[selectedSubject].name }),
        });
        setTaskToAdd("");
      });
    } else {
      toast({
        variant: "destructive",
        title: t("toastInvalidInput"),
        description: t("toastInvalidTask"),
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="text-primary" />
          {t("logActivityTitle")}
        </CardTitle>
        <CardDescription>
          {t("logActivityDescription")}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label className="mb-2 block">{t("selectSubject")}</Label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {Object.entries(subjects).map(([key, subject]) => {
              const Icon = subject.icon;
              return (
                <Button
                  key={key}
                  variant="outline"
                  className={cn(
                    "h-20 flex-col gap-2 justify-center text-center",
                    selectedSubject === key
                      ? "border-primary ring-2 ring-primary"
                      : ""
                  )}
                  onClick={() => setSelectedSubject(key)}
                >
                  <Icon className="h-6 w-6" style={{ color: subject.color }} />
                  <span className="text-xs">{t(key as any) || subject.name}</span>
                </Button>
              );
            })}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor={`hours-input`} className="flex items-center gap-2">
            <Clock /> {t("logStudyHours")}
          </Label>
          <div className="flex gap-2 items-center">
            <Input
              id={`hours-input`}
              type="number"
              value={hoursToAdd}
              onChange={(e) => setHoursToAdd(e.target.value)}
              placeholder={t("hoursInputPlaceholder")}
              onKeyDown={(e) => e.key === "Enter" && handleLogHoursFromInput()}
              disabled={!selectedSubject}
            />
            <Button
              onClick={handleLogHoursFromInput}
              disabled={isPending || !selectedSubject || !hoursToAdd}
            >
              {t("logButton")}
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleAddHours(0.5)}
              disabled={!selectedSubject}
            >
              {t("add30min")}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleAddHours(1)}
              disabled={!selectedSubject}
            >
              {t("add1hr")}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleAddHours(2)}
              disabled={!selectedSubject}
            >
              {t("add2hr")}
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor={`task-input`} className="flex items-center gap-2">
            <ListTodo /> {t("addTodoTask")}
          </Label>
          <div className="flex gap-2 items-center">
            <Input
              id={`task-input`}
              type="text"
              value={taskToAdd}
              onChange={(e) => setTaskToAdd(e.target.value)}
              placeholder={t("taskInputPlaceholder")}
              onKeyDown={(e) => e.key === "Enter" && handleAddTask()}
              disabled={!selectedSubject}
            />
            <Button
              onClick={handleAddTask}
              disabled={isPending || !selectedSubject || !taskToAdd}
            >
              <Plus className="h-4 w-4 mr-1" /> {t("addTaskButton")}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
