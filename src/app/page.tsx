
"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { Atom, Combine, FlaskConical, Sigma, Leaf } from "lucide-react";
import dynamic from "next/dynamic";
import { SiteHeader } from "@/components/site-header";
import { GoalsCard } from "@/components/dashboard/goals-card";
import { MotivationCard } from "@/components/dashboard/motivation-card";
import { ActivityLoggerCard } from "@/components/dashboard/activity-logger-card";
import { SubjectDetailsCard } from "@/components/dashboard/subject-details-card";
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
import { GuestPromptCard } from "@/components/dashboard/guest-prompt-card";
import { StatsCard } from "@/components/dashboard/stats-card";
import { format, parseISO, differenceInCalendarDays } from "date-fns";

// Dynamically import heavy components
const WeeklyProgressChart = dynamic(() => import('@/components/dashboard/weekly-progress-chart').then(mod => mod.WeeklyProgressChart), {
  loading: () => <Skeleton className="h-[300px] w-full" />,
  ssr: false
});
const SubjectPieChart = dynamic(() => import('@/components/dashboard/subject-pie-chart').then(mod => mod.SubjectPieChart), {
  loading: () => <Skeleton className="h-full w-full min-h-[300px]" />,
  ssr: false
});
const FloatingChat = dynamic(() => import('@/components/dashboard/floating-chat').then(mod => mod.FloatingChat), {
  ssr: false
});
const ProductivityChart = dynamic(() => import('@/components/dashboard/productivity-chart').then(mod => mod.ProductivityChart), {
    loading: () => <Skeleton className="h-[300px] w-full" />,
    ssr: false
});


export type Todo = {
  id: number;
  text: string;
  completed: boolean;
  completedAt?: string; // ISO 8601 string format
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

  
  const calculateStreaks = useCallback(() => {
    const loggedDates = Object.keys(dailyLogs)
      .filter(date => {
        const totalHours = Object.values(dailyLogs[date]).reduce((sum, hours) => sum + hours, 0);
        return totalHours > 0;
      })
      .map(date => parseISO(date))
      .sort((a, b) => b.getTime() - a.getTime());

    if (loggedDates.length === 0) {
      return { currentStreak: 0, longestStreak: 0 };
    }

    // Calculate current streak
    let currentStreak = 0;
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const todayStr = format(today, 'yyyy-MM-dd');
    const yesterdayStr = format(yesterday, 'yyyy-MM-dd');

    if (dailyLogs[todayStr] || dailyLogs[yesterdayStr]) {
      currentStreak = 1;
      let lastDate = dailyLogs[todayStr] ? today : yesterday;

      for (let i = 0; i < loggedDates.length; i++) {
        const currentDate = loggedDates[i];
        if (differenceInCalendarDays(lastDate, currentDate) === 1) {
          currentStreak++;
          lastDate = currentDate;
        } else if (differenceInCalendarDays(lastDate, currentDate) > 1) {
           // if the current date is not consecutive break
           if (! (format(lastDate, 'yyyy-MM-dd') === format(currentDate, 'yyyy-MM-dd'))) {
            break;
           }
        }
      }
    }


    // Calculate longest streak
    let longestStreak = 0;
    if (loggedDates.length > 0) {
        longestStreak = 1;
        let currentLongest = 1;
        for (let i = 0; i < loggedDates.length - 1; i++) {
            const diff = differenceInCalendarDays(loggedDates[i], loggedDates[i+1]);
            if (diff === 1) {
                currentLongest++;
            } else if (diff > 1) {
                currentLongest = 1; // Reset streak
            }
            if (currentLongest > longestStreak) {
                longestStreak = currentLongest;
            }
        }
    }


    return { currentStreak, longestStreak };
  }, [dailyLogs]);


  if (loading || !dataLoaded) {
    return (
      <div className="flex flex-col min-h-screen">
        <SiteHeader />
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <div className="grid gap-6 md:gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 grid gap-6 md:gap-8">
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-[300px] w-full" />
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

  const { currentStreak, longestStreak } = calculateStreaks();
  const totalHoursStudied = Object.values(subjects).reduce((sum, s) => sum + s.totalHours, 0);

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background dashboard-container">
      <SiteHeader />
      <main className="flex-1 p-4 md:p-6 lg:p-8">
        <div className="grid gap-6 md:gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 grid gap-6 md:gap-8">
            {user?.isAnonymous && <GuestPromptCard />}
            <MotivationCard subjects={subjects} stream={stream}/>
            <WeeklyProgressChart
              dailyLogs={dailyLogs}
              subjects={subjects}
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
            <StatsCard 
              currentStreak={currentStreak}
              longestStreak={longestStreak}
              totalHours={totalHoursStudied}
            />
            <ProductivityChart dailyLogs={dailyLogs} subjects={subjects} />
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
