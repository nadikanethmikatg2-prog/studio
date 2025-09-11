"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Atom,
  Combine,
  FlaskConical,
  Sigma,
} from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { CountdownCard } from "@/components/dashboard/countdown-card";
import { GoalsCard } from "@/components/dashboard/goals-card";
import { MotivationCard } from "@/components/dashboard/motivation-card";
import { SubjectPieChart } from "@/components/dashboard/subject-pie-chart";
import { ActivityLoggerCard } from "@/components/dashboard/activity-logger-card";
import { SubjectDetailsCard } from "@/components/dashboard/subject-details-card";
import { WeeklyProgressChart } from "@/components/dashboard/weekly-progress-chart";
import { startOfWeek, endOfWeek, eachDayOfInterval, format } from "date-fns";

export type Todo = {
  id: number;
  text: string;
  completed: boolean;
};

export type DailyLog = {
  [date: string]: {
    [subjectKey: string]: number;
  };
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
  const [dailyLogs, setDailyLogs] = useState<DailyLog>({});
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    try {
      const savedData = localStorage.getItem("alTrailblazerData");
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        // Re-assign icons because they don't survive stringification
        Object.keys(parsedData.subjects).forEach(key => {
          if (iconMap[key]) {
            parsedData.subjects[key].icon = iconMap[key];
          }
        });
        setSubjects(parsedData.subjects || initialSubjects);
        setDailyLogs(parsedData.dailyLogs || {});
      }
    } catch (error) {
      console.error("Failed to parse from localStorage", error);
    }
  }, []);

  useEffect(() => {
    if (isClient) {
      try {
        const dataToSave = {
          subjects,
          dailyLogs
        };
        localStorage.setItem("alTrailblazerData", JSON.stringify(dataToSave));
      } catch (error) {
        console.error("Failed to save to localStorage", error);
      }
    }
  }, [subjects, dailyLogs, isClient]);

  const handleLogHours = useCallback((subjectKey: string, hours: number) => {
    const today = format(new Date(), 'yyyy-MM-dd');

    setSubjects((prev) => ({
      ...prev,
      [subjectKey]: {
        ...prev[subjectKey],
        totalHours: (prev[subjectKey]?.totalHours || 0) + hours,
       },
    }));

    setDailyLogs((prevLogs) => {
        const newLogs = {...prevLogs};
        if (!newLogs[today]) {
            newLogs[today] = {};
        }
        newLogs[today][subjectKey] = (newLogs[today][subjectKey] || 0) + hours;
        return newLogs;
    });

  }, []);

  const handleUpdate = useCallback((key: string, updatedData: Partial<Subject>) => {
    setSubjects((prev) => ({
      ...prev,
      [key]: { ...prev[key], ...updatedData },
    }));
  }, []);

  const getWeekData = useCallback(() => {
    const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(selectedDate, { weekStartsOn: 1 });
    const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

    return weekDays.map(day => {
        const dateKey = format(day, 'yyyy-MM-dd');
        const dayLog = dailyLogs[dateKey] || {};
        const totalHours = Object.values(dayLog).reduce((sum, hours) => sum + hours, 0);

        return {
            date: format(day, 'EEE'),
            totalHours: totalHours,
            ...Object.keys(subjects).reduce((acc, key) => ({...acc, [key]: dayLog[key] || 0 }), {})
        };
    });
  }, [selectedDate, dailyLogs, subjects]);


  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background">
      <SiteHeader />
      <main className="flex-1 p-4 md:p-8">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 grid gap-8">
            <ActivityLoggerCard subjects={subjects} onLogHours={handleLogHours} onUpdate={handleUpdate} />
            <SubjectDetailsCard subjects={subjects} onUpdate={handleUpdate} />
          </div>
          <div className="space-y-8">
            <MotivationCard subjects={subjects} />
            <CountdownCard />
            <WeeklyProgressChart
                weekData={getWeekData()}
                subjects={subjects}
                selectedDate={selectedDate}
                onDateChange={setSelectedDate}
            />
            <SubjectPieChart subjects={subjects} />
            <GoalsCard subjects={subjects} onUpdate={handleUpdate} />
          </div>
        </div>
      </main>
    </div>
  );
}
