
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useLanguage } from "@/hooks/use-language";
import { Switch } from "../ui/switch";

interface SubjectCardProps {
  subjectKey: string;
  subject: Subject;
  onUpdate: (
    key: string,
    updatedData: Partial<Subject> | ((prevTodos: Todo[]) => Todo[])
  ) => void;
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
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);
  const [hoursSpent, setHoursSpent] = useState("");
  const [isFullyCompleted, setIsFullyCompleted] = useState(true);
  const { toast } = useToast();

  const completeTodo = (todo: Todo) => {
     const updatedTodos = subject.todos.map((t) =>
        t.id === todo.id ? { ...t, completed: true } : t
      );
      onUpdate(subjectKey, { todos: updatedTodos });
  }

  const handleToggleTodo = (id: number) => {
    startTransition(() => {
      const todo = subject.todos.find((t) => t.id === id);
      if (!todo) return;

      if (!todo.completed) {
        // If marking as complete, open dialog
        setSelectedTodo(todo);
        setIsLogHoursDialogOpen(true);
      } else {
        // If un-marking, just update the state without opening dialog
        const updatedTodos = subject.todos.map((t) =>
          t.id === id ? { ...t, completed: false } : t
        );
        onUpdate(subjectKey, { todos: updatedTodos });
      }
    });
  };

  const handleDone = () => {
    if (!selectedTodo) return;

    const hours = parseFloat(hoursSpent);
    const hasHours = !isNaN(hours) && hours > 0;

    startTransition(() => {
      if (hasHours) {
        onLogHours(subjectKey, hours);
      }

      if (isFullyCompleted) {
        completeTodo(selectedTodo);
        toast({
          title: t("toastTaskCompleted"),
          description: hasHours 
            ? t("toastLoggedHoursForTask", { hours, taskText: selectedTodo.text })
            : `"${selectedTodo.text}" marked as complete.`,
        });
      } else {
         if (hasHours) {
             toast({
                title: t("progressLogged"),
                description: t("partialProgressLogged", { hours, taskText: selectedTodo.text }),
            });
         } else {
            // Nothing to do if not fully completed and no hours logged, just close dialog
         }
      }

      resetAndCloseDialog();
    });
  };
  
  const resetAndCloseDialog = () => {
     setIsLogHoursDialogOpen(false);
     setSelectedTodo(null);
     setHoursSpent("");
     setIsFullyCompleted(true);
  }

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

        <Dialog open={isLogHoursDialogOpen} onOpenChange={(isOpen) => !isOpen && resetAndCloseDialog()}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{t("logHoursForTaskTitle")}</DialogTitle>
                    <DialogDescription>
                        {t("logHoursForTaskOptionalDescription", { taskText: selectedTodo?.text || '' })}
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4 space-y-4">
                    <div>
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
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="completion-status"
                        checked={isFullyCompleted}
                        onCheckedChange={setIsFullyCompleted}
                      />
                      <Label htmlFor="completion-status">
                        {isFullyCompleted ? "I fully completed it" : "I haven't fully completed this yet"}
                      </Label>
                    </div>
                </div>
                <DialogFooter>
                     <Button onClick={handleDone} disabled={isPending}>
                        {isPending ? t("loggingButton") : "Done"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </div>
  );
}
