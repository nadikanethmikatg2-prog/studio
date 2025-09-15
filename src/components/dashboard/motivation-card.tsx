
"use client";

import React, { useState, useTransition, useEffect, useRef } from "react";
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
import { Badge } from "../ui/badge";

interface MotivationCardProps {
  subjects: Subjects;
}

type SerializableSubjects = {
  [key: string]: {
    name: string;
    todos: string[]; // Updated to string array
    totalHours: number;
    goalHours: number;
  }
}


export function MotivationCard({ subjects }: MotivationCardProps) {
  const [analysis, setAnalysis] = useState<{
    message: string;
    subjectSpotlight: string;
  } | null>(null);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const hasFetched = useRef(false);

  useEffect(() => {
    const generateAnalysis = () => {
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

        const result = await getMotivationalMessageAction(serializableSubjects);
        
        if (result.success && result.analysis) {
          setAnalysis(result.analysis);
        } else {
          // Only show toast on subsequent errors, not on initial load error
          if(hasFetched.current) {
            toast({
              variant: "destructive",
              title: "AI Analysis Error",
              description: result.message,
            });
          }
        }
        hasFetched.current = true;
      });
    };
    
    if (subjects && Object.keys(subjects).length > 0) {
      generateAnalysis();
    }
    
  }, [subjects, toast]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-accent" />
          AI Study Coach
        </CardTitle>
        <CardDescription>
          Your personal AI assistant for smarter studying.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isPending && !analysis && (
          <div className="space-y-2 pt-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        )}
        {analysis && (
          <div className="space-y-4">
            <Alert className="bg-primary/10 border-primary/20">
              <BrainCircuit className="h-4 w-4 text-primary" />
              <AlertTitle className="text-primary">Analysis</AlertTitle>

              <AlertDescription className="text-primary/80">
                {isPending ? 'Generating new analysis...' : analysis.message}
              </AlertDescription>
            </Alert>
            
            <Alert variant="default" className="bg-accent/10 border-accent/20">
              <Activity className="h-4 w-4 text-accent" />
              <AlertTitle className="text-accent">Subject Spotlight</AlertTitle>
              <AlertDescription className="text-accent/80">
                 {isPending ? '...' : analysis.subjectSpotlight}
              </AlertDescription>
            </Alert>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
