"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Atom,
  Combine,
  FlaskConical,
  Sigma,
} from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SubjectCard } from "@/components/dashboard/subject-card";
import { ProgressChart } from "@/components/dashboard/progress-chart";
import { CountdownCard } from "@/components/dashboard/countdown-card";
import { GoalsCard } from "@/components/dashboard/goals-card";
import { MotivationCard } from "@/components/dashboard/motivation-card";
import { SubjectPieChart } from "@/components/dashboard/subject-pie-chart";

export type Todo = {
  id: number;
  text: string;
  completed: boolean;
};

export type Subject = {
  name: string;
  icon: React.ElementType;
  totalHours: number;
  goalHours: number;
  todos: Todo[];
  color: string;
};

export type Subjects = {
  [key: string]: Subject;
};

const iconMap: { [key: string]: React.ElementType } = {
  chemistry: FlaskConical,
  physics: Atom,
  pureMaths: Sigma,
  appliedMaths: Combine,
};

const initialSubjects: Subjects = {
  chemistry: {
    name: "Chemistry",
    icon: FlaskConical,
    totalHours: 0,
    goalHours: 20,
    todos: [],
    color: "hsl(var(--chart-1))",
  },
  physics: {
    name: "Physics",
    icon: Atom,
    totalHours: 0,
    goalHours: 20,
    todos: [],
    color: "hsl(var(--chart-2))",
  },
  pureMaths: {
    name: "Pure Maths",
    icon: Sigma,
    totalHours: 0,
    goalHours: 25,
    todos: [],
    color: "hsl(var(--chart-3))",
  },
  appliedMaths: {
    name: "Applied Maths",
    icon: Combine,
    totalHours: 0,
    goalHours: 25,
    todos: [],
    color: "hsl(var(--chart-4))",
  },
};

export default function Home() {
  const [subjects, setSubjects] = useState<Subjects>(initialSubjects);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    try {
      const savedData = localStorage.getItem("alTrailblazerData");
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        // Re-assign icons because they don't survive stringification
        Object.keys(parsedData).forEach(key => {
          if (iconMap[key]) {
            parsedData[key].icon = iconMap[key];
          }
        });
        setSubjects(parsedData);
      }
    } catch (error) {
      console.error("Failed to parse from localStorage", error);
    }
  }, []);

  useEffect(() => {
    if (isClient) {
      try {
        localStorage.setItem("alTrailblazerData", JSON.stringify(subjects));
      } catch (error) {
        console.error("Failed to save to localStorage", error);
      }
    }
  }, [subjects, isClient]);

  const handleUpdate = useCallback((key: string, updatedData: Partial<Subject>) => {
    setSubjects((prev) => ({
      ...prev,
      [key]: { ...prev[key], ...updatedData },
    }));
  }, []);

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background">
      <SiteHeader />
      <main className="flex-1 p-4 md:p-8">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="grid gap-6 md:grid-cols-2">
              {Object.entries(subjects).map(([key, subject]) => (
                <SubjectCard
                  key={key}
                  subjectKey={key}
                  subject={subject}
                  onUpdate={handleUpdate}
                />
              ))}
            </div>
          </div>
          <div className="space-y-8">
            <MotivationCard subjects={subjects} />
            <CountdownCard />
            <SubjectPieChart subjects={subjects} />
            <ProgressChart subjects={subjects} />
            <GoalsCard subjects={subjects} onUpdate={handleUpdate} />
          </div>
        </div>
      </main>
    </div>
  );
}
