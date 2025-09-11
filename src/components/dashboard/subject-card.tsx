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
  const [newTodo, setNewTodo] = useState("");
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();


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
    <div className="space-y-4">
        <div className="space-y-2">
          <Label>To-Do List</Label>
           <ScrollArea className="h-48 w-full rounded-md border mt-2">
            <div className="p-2 space-y-2">
              {subject.todos.length > 0 ? (
                subject.todos.map((todo) => (
                  <div key={todo.id} className="flex items-center gap-2 group">
                    <Checkbox
                      id={`todo-${subjectKey}-${todo.id}`}
                      checked={todo.completed}
                      onCheckedChange={() => handleToggleTodo(todo.id)}
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
                  No tasks yet. Add one above!
                </p>
              )}
            </div>
          </ScrollArea>
        </div>
    </div>
  );
}
