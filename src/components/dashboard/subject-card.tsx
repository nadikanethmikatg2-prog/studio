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
import { Plus, Trash2, Clock } from "lucide-react";
import type { Subject, Todo } from "@/app/page";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "../ui/scroll-area";

interface SubjectCardProps {
  subjectKey: string;
  subject: Subject;
  onUpdate: (key: string, updatedData: Partial<Subject>) => void;
}

export function SubjectCard({
  subjectKey,
  subject,
  onUpdate,
}: SubjectCardProps) {
  const [hoursToAdd, setHoursToAdd] = useState("");
  const [newTodo, setNewTodo] = useState("");
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const handleAddHours = (hours: number) => {
    if (!isNaN(hours) && hours > 0) {
      startTransition(() => {
        onUpdate(subjectKey, { totalHours: subject.totalHours + hours });
        setHoursToAdd("");
        toast({
          title: "Success",
          description: `${hours} hour(s) added to ${subject.name}.`,
        });
      });
    } else {
      toast({
        variant: "destructive",
        title: "Invalid Input",
        description: "Please enter a positive number for hours.",
      });
    }
  };

  const handleLogHoursFromInput = () => {
    const hours = parseFloat(hoursToAdd);
    handleAddHours(hours);
  };

  const handleAddTodo = () => {
    if (newTodo.trim() !== "") {
      startTransition(() => {
        const newTodoItem: Todo = {
          id: Date.now(),
          text: newTodo.trim(),
          completed: false,
        };
        onUpdate(subjectKey, { todos: [...subject.todos, newTodoItem] });
        setNewTodo("");
      });
    }
  };

  const handleToggleTodo = (id: number) => {
    startTransition(() => {
      const updatedTodos = subject.todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      );
      onUpdate(subjectKey, { todos: updatedTodos });
    });
  };

  const handleDeleteTodo = (id: number) => {
    startTransition(() => {
      const updatedTodos = subject.todos.filter((todo) => todo.id !== id);
      onUpdate(subjectKey, { todos: updatedTodos });
    });
  };

  const Icon = subject.icon;

  return (
    <Card className="flex flex-col bg-card hover:bg-card/90 transition-colors">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon
              className="h-6 w-6"
              style={{ color: subject.color }}
            />
            {subject.name}
          </div>
           <span className="text-sm text-muted-foreground font-medium">
             {subject.totalHours.toFixed(1)}h
           </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow space-y-4">
        <div className="space-y-2">
          <Label htmlFor={`hours-${subjectKey}`}>Log Study Hours</Label>
          <div className="flex gap-2 items-center">
             <Input
              id={`hours-${subjectKey}`}
              type="number"
              value={hoursToAdd}
              onChange={(e) => setHoursToAdd(e.target.value)}
              placeholder="e.g., 1.5"
              onKeyDown={(e) => e.key === 'Enter' && handleLogHoursFromInput()}
            />
            <Button onClick={handleLogHoursFromInput} disabled={isPending}>
              Log
            </Button>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => handleAddHours(0.5)}>+30m</Button>
            <Button variant="outline" size="sm" onClick={() => handleAddHours(1)}>+1h</Button>
            <Button variant="outline" size="sm" onClick={() => handleAddHours(2)}>+2h</Button>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label>To-Do List</Label>
          <div className="flex gap-2">
            <Input
              type="text"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              placeholder="Add a new task..."
              onKeyDown={(e) => e.key === 'Enter' && handleAddTodo()}
            />
            <Button onClick={handleAddTodo} variant="outline" size="icon" disabled={isPending}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
           <ScrollArea className="h-32 w-full rounded-md border mt-2">
            <div className="p-2 space-y-2">
              {subject.todos.length > 0 ? (
                subject.todos.map((todo) => (
                  <div key={todo.id} className="flex items-center gap-2 group">
                    <Checkbox
                      id={`todo-${todo.id}`}
                      checked={todo.completed}
                      onCheckedChange={() => handleToggleTodo(todo.id)}
                    />
                    <Label
                      htmlFor={`todo-${todo.id}`}
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
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No tasks yet. Add one!
                </p>
              )}
            </div>
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
}
