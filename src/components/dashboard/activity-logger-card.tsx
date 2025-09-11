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
import { Plus, Clock, ListTodo } from "lucide-react";
import type { Subject, Todo, Subjects } from "@/app/page";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ActivityLoggerCardProps {
  subjects: Subjects;
  onUpdate: (key: string, updatedData: Partial<Subject>) => void;
  onLogHours: (subjectKey: string, hours: number) => void;
}

export function ActivityLoggerCard({ subjects, onUpdate, onLogHours }: ActivityLoggerCardProps) {
  const [selectedSubject, setSelectedSubject] = useState<string>("chemistry");
  const [hoursToAdd, setHoursToAdd] = useState("");
  const [newTodo, setNewTodo] = useState("");
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

  const handleAddTodo = () => {
    if (selectedSubject && newTodo.trim() !== "") {
      startTransition(() => {
        const currentSubject = subjects[selectedSubject];
        const newTodoItem: Todo = {
          id: Date.now(),
          text: newTodo.trim(),
          completed: false,
        };
        onUpdate(selectedSubject, {
          todos: [...currentSubject.todos, newTodoItem],
        });
        setNewTodo("");
        toast({
            title: "Task Added",
            description: `New task for ${currentSubject.name}: "${newTodo.trim()}"`,
        })
      });
    } else {
        toast({
            variant: "destructive",
            title: "Invalid Input",
            description: "Please select a subject and enter a task.",
        });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Log Your Activity</CardTitle>
        <CardDescription>
          Select a subject to log study hours or add new tasks to your to-do list.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label htmlFor="subject-select" className="mb-2 block">
            Subject
          </Label>
          <Select value={selectedSubject} onValueChange={setSelectedSubject}>
            <SelectTrigger id="subject-select">
              <SelectValue placeholder="Select a subject..." />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(subjects).map(([key, subject]) => (
                <SelectItem key={key} value={key}>
                  {subject.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
                <Label htmlFor={`hours-input`} className="flex items-center gap-2"><Clock /> Log Study Hours</Label>
                <div className="flex gap-2 items-center">
                    <Input
                    id={`hours-input`}
                    type="number"
                    value={hoursToAdd}
                    onChange={(e) => setHoursToAdd(e.target.value)}
                    placeholder="e.g., 1.5"
                    onKeyDown={(e) => e.key === 'Enter' && handleLogHoursFromInput()}
                    />
                    <Button onClick={handleLogHoursFromInput} disabled={isPending || !selectedSubject}>
                    Log
                    </Button>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleAddHours(0.5)} disabled={!selectedSubject}>+30m</Button>
                    <Button variant="outline" size="sm" onClick={() => handleAddHours(1)} disabled={!selectedSubject}>+1h</Button>
                    <Button variant="outline" size="sm" onClick={() => handleAddHours(2)} disabled={!selectedSubject}>+2h</Button>
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="todo-input" className="flex items-center gap-2"><ListTodo /> Add a Task</Label>
                <div className="flex gap-2">
                    <Input
                    id="todo-input"
                    type="text"
                    value={newTodo}
                    onChange={(e) => setNewTodo(e.target.value)}
                    placeholder="New task description..."
                    onKeyDown={(e) => e.key === 'Enter' && handleAddTodo()}
                    />
                    <Button onClick={handleAddTodo} variant="outline" size="icon" disabled={isPending || !selectedSubject}>
                    <Plus className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
