"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Atom, Combine, FlaskConical, Sigma } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { GoalsCard } from "@/components/dashboard/goals-card";
import { MotivationCard } from "@/components/dashboard/motivation-card";
import { SubjectPieChart } from "@/components/dashboard/subject-pie-chart";
import { ActivityLoggerCard } from "@/components/dashboard/activity-logger-card";
import { SubjectDetailsCard } from "@/components/dashboard/subject-details-card";
import { WeeklyProgressChart } from "@/components/dashboard/weekly-progress-chart";
import {
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  subWeeks,
} from "date-fns";
import { FloatingChat } from "@/components/dashboard/floating-chat";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import {
  getInitialSubjects,
  saveSubjects,
  saveDailyLogs,
  getDailyLogs,
} from "@/lib/firebase/firestore";
import { Skeleton } from "@/components/ui/skeleton";

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

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [subjects, setSubjects] = useState<Subjects | null>(null);
  const [dailyLogs, setDailyLogs] = useState<DailyLog>({});
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      const fetchData = async () => {
        const [subjectsData, logsData] = await Promise.all([
          getInitialSubjects(user.uid),
          getDailyLogs(user.uid),
        ]);
        Object.keys(subjectsData).forEach((key) => {
          if (iconMap[key]) {
            subjectsData[key].icon = iconMap[key];
          }
        });
        setSubjects(subjectsData);
        setDailyLogs(logsData);
        setDataLoaded(true);
      };
      fetchData();
    }
  }, [user]);

  useEffect(() => {
    if (user && subjects && dataLoaded) {
      const dataToSave = {
        chemistry: { ...subjects.chemistry, icon: undefined },
        physics: { ...subjects.physics, icon: undefined },
        pureMaths: { ...subjects.pureMaths, icon: undefined },
        appliedMaths: { ...subjects.appliedMaths, icon: undefined },
      };
      saveSubjects(user.uid, dataToSave);
    }
  }, [subjects, user, dataLoaded]);

  useEffect(() => {
    if (user && Object.keys(dailyLogs).length > 0 && dataLoaded) {
      saveDailyLogs(user.uid, dailyLogs);
    }
  }, [dailyLogs, user, dataLoaded]);

  const handleLogHours = useCallback(
    (subjectKey: string, hours: number) => {
      const today = format(new Date(), "yyyy-MM-dd");

      setSubjects((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          [subjectKey]: {
            ...prev[subjectKey],
            totalHours: (prev[subjectKey]?.totalHours || 0) + hours,
          },
        };
      });

      setDailyLogs((prevLogs) => {
        const newLogs = { ...prevLogs };
        if (!newLogs[today]) {
          newLogs[today] = {};
        }
        newLogs[today][subjectKey] =
          (newLogs[today][subjectKey] || 0) + hours;
        return newLogs;
      });
    },
    []
  );

  const handleUpdate = useCallback(
    (
      key: string,
      updatedData: Partial<Subject> | ((prevTodos: Todo[]) => Todo[])
    ) => {
      setSubjects((prev) => {
        if (!prev) return null;
        const currentSubject = prev[key];
        const newSubjectData =
          typeof updatedData === "function"
            ? { ...currentSubject, todos: updatedData(currentSubject.todos) }
            : { ...currentSubject, ...updatedData };

        return {
          ...prev,
          [key]: newSubjectData,
        };
      });
    },
    []
  );

  const handleAddTodo = useCallback((subjectKey: string, task: string) => {
    setSubjects((prev) => {
      if (!prev) return null;
      const newTodo: Todo = {
        id: Date.now(),
        text: task,
        completed: false,
      };
      const newSubjects = { ...prev };
      newSubjects[subjectKey] = {
        ...newSubjects[subjectKey],
        todos: [...newSubjects[subjectKey].todos, newTodo],
      };
      return newSubjects;
    });
  }, []);

  const handleBulkUpdateGoals = useCallback(
    (newGoals: { [key: string]: number }) => {
      setSubjects((prev) => {
        if (!prev) return null;
        const newSubjects = { ...prev };
        Object.keys(newGoals).forEach((key) => {
          if (newSubjects[key]) {
            newSubjects[key].goalHours = newGoals[key];
          }
        });
        return newSubjects;
      });
    },
    []
  );

  const handleDeleteAllTodos = useCallback(() => {
    setSubjects((prev) => {
      if (!prev) return null;
      const newSubjects = { ...prev };
      for (const key in newSubjects) {
        newSubjects[key].todos = [];
      }
      return newSubjects;
    });
  }, []);

  const handleDeleteSubjectTodos = useCallback((subjectKey: string) => {
    setSubjects((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        [subjectKey]: {
          ...prev[subjectKey],
          todos: [],
        },
      };
    });
  }, []);

  const getWeekData = useCallback(
    (date: Date) => {
      if (!subjects) return [];
      const weekStart = startOfWeek(date, { weekStartsOn: 1 });
      const weekEnd = endOfWeek(date, { weekStartsOn: 1 });
      const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

      return weekDays.map((day) => {
        const dateKey = format(day, "yyyy-MM-dd");
        const dayLog = dailyLogs[dateKey] || {};
        const totalHours = Object.values(dayLog).reduce(
          (sum, hours) => sum + hours,
          0
        );

        return {
          date: format(day, "EEE"),
          totalHours: totalHours,
          ...Object.keys(subjects).reduce(
            (acc, key) => ({ ...acc, [key]: dayLog[key] || 0 }),
            {}
          ),
        };
      });
    },
    [dailyLogs, subjects]
  );

  if (loading || !dataLoaded) {
    return (
      <div className="flex flex-col min-h-screen">
        <SiteHeader />
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <div className="grid gap-6 md:gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 grid gap-6 md:gap-8">
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-96 w-full" />
              <Skeleton className="h-64 w-full" />
              <Skeleton className="h-96 w-full" />
            </div>
            <div className="lg:col-span-1 grid gap-6 md:gap-8 content-start">
              <Skeleton className="h-96 w-full" />
              <Skeleton className="h-80 w-full" />
            </div>
          </div>
        </main>
      </div>
    );
  }

  const currentWeekData = getWeekData(selectedDate);
  const lastWeekDate = subWeeks(selectedDate, 1);
  const previousWeekData = getWeekData(lastWeekDate);

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background">
      <SiteHeader />
      <main className="flex-1 p-4 md:p-6 lg:p-8">
        <div className="grid gap-6 md:gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 grid gap-6 md:gap-8">
            <MotivationCard subjects={subjects!} />
            <WeeklyProgressChart
              currentWeekData={currentWeekData}
              previousWeekData={previousWeekData}
              subjects={subjects!}
              selectedDate={selectedDate}
              onDateChange={setSelectedDate}
            />
            <ActivityLoggerCard
              subjects={subjects!}
              onLogHours={handleLogHours}
            />
            <SubjectDetailsCard
              subjects={subjects!}
              onUpdate={handleUpdate}
              onLogHours={handleLogHours}
            />
          </div>

          <div className="lg:col-span-1 grid gap-6 md:gap-8 content-start">
            <GoalsCard subjects={subjects!} onUpdate={handleBulkUpdateGoals} />
            <SubjectPieChart subjects={subjects!} />
          </div>
        </div>
      </main>
      <FloatingChat
        subjects={subjects!}
        onTaskAdded={handleAddTodo}
        onDeleteAllTodos={handleDeleteAllTodos}
        onDeleteSubjectTodos={handleDeleteSubjectTodos}
      />
    </div>
  );
}
