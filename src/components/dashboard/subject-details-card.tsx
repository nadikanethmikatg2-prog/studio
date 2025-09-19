
"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Subjects, Subject } from "@/app/page";
import { SubjectCard } from "./subject-card";
import { BookCopy } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/hooks/use-language";

interface SubjectDetailsCardProps {
  subjects: Subjects;
  onUpdate: (key: string, updatedData: Partial<Subject> | ((prevTodos: any[]) => any[])) => void;
  onLogHours: (subjectKey: string, hours: number) => void;
}

export function SubjectDetailsCard({ subjects, onUpdate, onLogHours }: SubjectDetailsCardProps) {
  const { t } = useLanguage();
  const subjectKeys = Object.keys(subjects);
  const gridColsClass = subjectKeys.length === 3 ? 'grid-cols-3' : 'grid-cols-4';

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
            <BookCopy className="text-primary"/>
            {t("subjectDetailsTitle")}
        </CardTitle>
        <CardDescription>
          {t("subjectDetailsDescription")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={subjectKeys[0]} className="w-full">
          <TabsList className={cn("grid w-full", gridColsClass)}>
            {Object.entries(subjects).map(([key, subject]) => (
              <TabsTrigger key={key} value={key}>
                <div className="flex items-center justify-center gap-2 w-full">
                    <subject.icon className="h-4 w-4" />
                    <span className="truncate">{t(key as any) || subject.name}</span>
                </div>
              </TabsTrigger>
            ))}
          </TabsList>
          {Object.entries(subjects).map(([key, subject]) => (
            <TabsContent key={key} value={key} className="mt-4">
              <div className="flex justify-between items-center mb-4 p-2 rounded-lg bg-muted">
                <h4 className="font-semibold">{t("totalStudyTime")}</h4>
                <span className="font-bold text-lg text-primary">{subject.totalHours.toFixed(1)} {t("hoursSuffix")}</span>
              </div>
              <SubjectCard
                subjectKey={key}
                subject={subject}
                onUpdate={onUpdate}
                onLogHours={onLogHours}
              />
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}
