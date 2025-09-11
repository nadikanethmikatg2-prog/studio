"use client";

import React, { useState, useTransition } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, BrainCircuit } from "lucide-react";
import { getMotivationalMessageAction } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import type { Subjects } from "@/app/page";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "../ui/skeleton";

interface MotivationCardProps {
  subjects: Subjects;
}

export function MotivationCard({ subjects }: MotivationCardProps) {
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleGenerateMessage = () => {
    startTransition(async () => {
      setMessage(""); // Clear previous message
      const input = {
        studyHoursChemistry: subjects.chemistry.totalHours,
        studyHoursPhysics: subjects.physics.totalHours,
        studyHoursPureMaths: subjects.pureMaths.totalHours,
        studyHoursAppliedMaths: subjects.appliedMaths.totalHours,
        todoListChemistry: subjects.chemistry.todos
          .map((t) => t.text)
          .join(", "),
        todoListPhysics: subjects.physics.todos.map((t) => t.text).join(", "),
        todoListPureMaths: subjects.pureMaths.todos
          .map((t) => t.text)
          .join(", "),
        todoListAppliedMaths: subjects.appliedMaths.todos
          .map((t) => t.text)
          .join(", "),
      };

      const result = await getMotivationalMessageAction(input);

      if (result.success) {
        setMessage(result.message);
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
          <Sparkles className="h-6 w-6 text-accent" />
          AI Motivator
        </CardTitle>
        <CardDescription>
          Get a personalized motivational boost.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button
          onClick={handleGenerateMessage}
          disabled={isPending}
          className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
        >
          {isPending ? "Generating..." : "Get Motivated"}
        </Button>
        {isPending && (
          <div className="space-y-2 pt-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        )}
        {message && (
          <Alert className="bg-primary/10 border-primary/20">
             <BrainCircuit className="h-4 w-4 text-primary" />
            <AlertTitle className="text-primary">Your Daily Boost!</AlertTitle>
            <AlertDescription className="text-primary/80">{message}</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
