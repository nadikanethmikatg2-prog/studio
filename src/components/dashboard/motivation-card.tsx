"use client";

import React, { useState, useTransition, useEffect, useRef, useCallback } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Sparkles, BrainCircuit, Activity } from "lucide-react";
import { getMotivationalMessageAction } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import type { Subjects } from "@/app/page";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "../ui/skeleton";
import { useAuth } from "@/hooks/use-auth";

interface MotivationCardProps {
  subjects: Subjects;
  stream: string | null;
}

export function MotivationCard({ subjects, stream }: MotivationCardProps) {
  const { user } = useAuth();
  const [analysis, setAnalysis] = useState<{
    message: string;
    subjectSpotlight: string;
  } | null>(null);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  const generateAnalysis = useCallback(() => {
    if (!user || !stream) return;

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

      const result = await getMotivationalMessageAction(
        stream,
        serializableSubjects
      );

      if (result.success && result.analysis) {
        setAnalysis(result.analysis);
      } else {
        toast({
          variant: "destructive",
          title: "AI Analysis Error",
          description: result.message,
        });
        setAnalysis(null);
      }
    });
  }, [user, stream, subjects, toast]);

  useEffect(() => {
    const hasActivity = Object.values(subjects).some(
      (s) => s.totalHours > 0 || s.todos.length > 0
    );

    if (user && stream && hasActivity) {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
      setAnalysis(null);
      debounceTimeout.current = setTimeout(generateAnalysis, 1500);
    } else if (!hasActivity) {
      setAnalysis({
        message:
          "Log some study hours or add a to-do task to get your first analysis from the AI Study Coach!",
        subjectSpotlight:
          "Select a subject in the 'Log Your Study Activity' card to get started.",
      });
    }

    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, [subjects, user, stream, generateAnalysis]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-primary" />
          AI Study Coach
        </CardTitle>
        <CardDescription>
          Your personal AI assistant for smarter studying.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {isPending || !analysis ? (
          <div className="space-y-4">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        ) : (
          <div className="space-y-4">
             <div className="p-4 rounded-lg bg-muted text-foreground">
                <div className="flex items-center gap-2 mb-2 font-semibold text-primary">
                    <BrainCircuit className="h-5 w-5" />
                    <h4 className="text-base">Analysis</h4>
                </div>
                <p className="text-sm opacity-90">{analysis.message}</p>
            </div>

            <div className="p-4 rounded-lg bg-muted text-foreground">
                <div className="flex items-center gap-2 mb-2 font-semibold">
                    <Activity className="h-5 w-5" />
                    <h4 className="text-base">Subject Spotlight</h4>
                </div>
                <p className="text-sm opacity-90">{analysis.subjectSpotlight}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
