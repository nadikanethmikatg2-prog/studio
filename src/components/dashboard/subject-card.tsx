
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
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Plus, Trash2 } from "lucide-react";
import type { Subject, Todo } from "@/app/page";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "../ui/scroll-area";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useLanguage } from "@/hooks/use-language";

interface SubjectCardProps {
  subjectKey: string;
  subject: Subject;
  onUpdate: (key: string, updatedData: Partial<Subject>) => void;
  onLogHours: (subjectKey: string, hours: number) => void;
}

export function SubjectCard({
  subjectKey,
  subject,
  onUpdate,
  onLogHours,
}: SubjectCardProps) {
  const { t } = useLanguage();
  const [isPending, startTransition] = useTransition();
  const [isLogHoursDialogOpen, setIsLogHoursDialogOpen] = useState(false);
  const [completedTodo, setCompletedTodo] = useState<Todo | null>(null);
  const [hoursSpent, setHoursSpent] = useState("");
  const { toast } = useToast();

  const handleToggleTodo = (id: number) => {
    startTransition(() => {
      const todo = subject.todos.find((t) => t.id === id);
      if (!todo) return;

      if (!todo.completed) {
        // If marking as complete, open dialog
        setCompletedTodo(todo);
        setIsLogHoursDialogOpen(true);
      } else {
        // If un-marking, just update the state
        const updatedTodos = subject.todos.map((t) =>
          t.id === id ? { ...t, completed: false } : t
        );
        onUpdate(subjectKey, { todos: updatedTodos });
      }
    });
  };

  const handleLogHoursForTodo = () => {
    if (!completedTodo) return;

    const hours = parseFloat(hoursSpent);
    if (isNaN(hours) || hours <= 0) {
      toast({
        variant: "destructive",
        title: t("toastInvalidInput"),
        description: t("toastInvalidHours"),
      });
      return;
    }

    startTransition(() => {
      // Log the hours
      onLogHours(subjectKey, hours);

      // Mark todo as complete
      const updatedTodos = subject.todos.map((t) =>
        t.id === completedTodo.id ? { ...t, completed: true } : t
      );
      onUpdate(subjectKey, { todos: updatedTodos });

      toast({
        title: t("toastTaskCompleted"),
        description: t("toastLoggedHoursForTask", { hours, taskText: completedTodo.text }),
      });

      // Reset and close dialog
      setIsLogHoursDialogOpen(false);
      setCompletedTodo(null);
      setHoursSpent("");
    });
  };

  const handleDeleteTodo = (id: number) => {
    startTransition(() => {
      const updatedTodos = subject.todos.filter((todo) => todo.id !== id);
      onUpdate(subjectKey, { todos: updatedTodos });
    });
  };

  return (
    <div className="space-y-4">
        <div className="space-y-2">
          <Label>{t("todoList")}</Label>
           <ScrollArea className="h-48 w-full rounded-md border mt-2">
            <div className="p-2 space-y-2">
              {subject.todos.length > 0 ? (
                subject.todos.map((todo) => (
                  <div key={todo.id} className="flex items-center gap-2 group">
                    <Checkbox
                      id={`todo-${subjectKey}-${todo.id}`}
                      checked={todo.completed}
                      onCheckedChange={() => handleToggleTodo(todo.id)}
                      disabled={isPending}
                    />
                    <Label
                      htmlFor={`todo-${subjectKey}-${todo.id}`}
                      className={`flex-grow ${
                        todo.completed ? "line-through text-muted-foreground" : ""
                      }`}
                    >
                      {todo.text}
                    </Label>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleDeleteTodo(todo.id)}
                      disabled={isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  {t("noTasksYet")}
                </p>
              )}
            </div>
          </ScrollArea>
        </div>

        <AlertDialog open={isLogHoursDialogOpen} onOpenChange={setIsLogHoursDialogOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{t("logHoursForTaskTitle")}</AlertDialogTitle>
                    <AlertDialogDescription>
                        {t("logHoursForTaskDescription", { taskText: completedTodo?.text || "" })}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="py-4">
                    <Label htmlFor="hours-spent">{t("hoursSpent")}</Label>
                    <Input
                        id="hours-spent"
                        type="number"
                        value={hoursSpent}
                        onChange={(e) => setHoursSpent(e.target.value)}
                        placeholder="e.g., 2.5"
                        autoFocus
                    />
                </div>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => setHoursSpent('')}>{t("cancel")}</AlertDialogCancel>
                    <AlertDialogAction onClick={handleLogHoursForTodo} disabled={isPending || !hoursSpent}>
                        {isPending ? t("generatingButton") : t("logAndCompleteButton")}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    </div>
  );
}
