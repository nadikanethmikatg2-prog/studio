
"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { Atom, Combine, FlaskConical, Sigma, Leaf } from "lucide-react";
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
  getUserStream,
  getDailyLogs,
} from "@/lib/firebase/firestore";
import { Skeleton } from "@/components/ui/skeleton";
import { useLanguage } from "@/hooks/use-language";

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

export type Message = {
  role: "user" | "model";
  content: string;
};

const iconMap: { [key: string]: React.ElementType } = {
  chemistry: FlaskConical,
  physics: Atom,
  pureMaths: Sigma,
  appliedMaths: Combine,
  biology: Leaf,
};

export default function Home() {
  const { user, loading } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();
  const [subjects, setSubjects] = useState<Subjects | null>(null);
  const [dailyLogs, setDailyLogs] = useState<DailyLog>({});
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [dataLoaded, setDataLoaded] = useState(false);
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [stream, setStream] = useState<string | null>(null);

  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      const fetchData = async () => {
        try {
          setDataLoaded(false); // Start loading
          const [subjectsData, logsData, userStream] = await Promise.all([
            getInitialSubjects(user.uid),
            getDailyLogs(user.uid),
            getUserStream(user.uid),
          ]);
          Object.keys(subjectsData).forEach((key) => {
            if (iconMap[key]) {
              subjectsData[key].icon = iconMap[key];
            }
          });
          setSubjects(subjectsData);
          setDailyLogs(logsData);
          setStream(userStream);
        } catch (error) {
          console.error("Failed to fetch initial data:", error);
          // Optionally, show a toast to the user
        } finally {
          setDataLoaded(true); // Finish loading
        }
      };
      fetchData();
    }
  }, [user]);

  const debouncedSave = useCallback(() => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    debounceTimeoutRef.current = setTimeout(() => {
      if (user && subjects && dataLoaded) {
        const subjectsToSave = JSON.parse(JSON.stringify(subjects));
        for (const key in subjectsToSave) {
          delete subjectsToSave[key].icon;
        }
        saveSubjects(user.uid, subjectsToSave);
      }
      if (user && Object.keys(dailyLogs).length > 0 && dataLoaded) {
        saveDailyLogs(user.uid, dailyLogs);
      }
    }, 1500); // Wait 1.5 seconds after the last change
  }, [user, subjects, dailyLogs, dataLoaded]);

  useEffect(() => {
    if(dataLoaded) {
      debouncedSave();
    }
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [subjects, dailyLogs, dataLoaded, debouncedSave]);

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
  
  if (!subjects) {
    // This can happen if data loading failed but dataLoaded is true.
    return (
       <div className="flex flex-col min-h-screen">
        <SiteHeader />
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <div className="flex items-center justify-center h-full">
            <p className="text-destructive">{t("toastCouldNotLoadData")}</p>
          </div>
        </main>
      </div>
    )
  }

  const currentWeekData = getWeekData(selectedDate);
  const lastWeekDate = subWeeks(selectedDate, 1);
  const previousWeekData = getWeekData(lastWeekDate);

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background dashboard-container">
      <SiteHeader />
      <main className="flex-1 p-4 md:p-6 lg:p-8">
        <div className="grid gap-6 md:gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 grid gap-6 md:gap-8">
            <MotivationCard subjects={subjects} stream={stream}/>
            <WeeklyProgressChart
              currentWeekData={currentWeekData}
              previousWeekData={previousWeekData}
              subjects={subjects}
              selectedDate={selectedDate}
              onDateChange={setSelectedDate}
            />
            <ActivityLoggerCard
              subjects={subjects}
              onLogHours={handleLogHours}
              onAddTask={handleAddTodo}
            />
            <SubjectDetailsCard
              subjects={subjects}
              onUpdate={handleUpdate}
              onLogHours={handleLogHours}
            />
          </div>

          <div className="lg:col-span-1 grid gap-6 md:gap-8 content-start">
            <GoalsCard subjects={subjects} onUpdate={handleBulkUpdateGoals} stream={stream} />
            <SubjectPieChart subjects={subjects} />
          </div>
        </div>
      </main>
      <FloatingChat
        subjects={subjects}
        messages={chatMessages}
        setMessages={setChatMessages}
        onTaskAdded={handleAddTodo}
        onDeleteAllTodos={handleDeleteAllTodos}
        onDeleteSubjectTodos={handleDeleteSubjectTodos}
      />
    </div>
  );
}
