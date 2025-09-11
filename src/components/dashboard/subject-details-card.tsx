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
import { SubjectCard } from "./subject-card"; // Re-using the content of the old subject card
import { BookCopy } from "lucide-react";

interface SubjectDetailsCardProps {
  subjects: Subjects;
  onUpdate: (key: string, updatedData: Partial<Subject>) => void;
}

export function SubjectDetailsCard({ subjects, onUpdate }: SubjectDetailsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
            <BookCopy className="text-primary"/>
            Subject Details
        </CardTitle>
        <CardDescription>
          View your total hours and to-do lists for each subject.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="chemistry" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            {Object.entries(subjects).map(([key, subject]) => (
              <TabsTrigger key={key} value={key}>
                <div className="flex items-center gap-2">
                    <subject.icon className="h-4 w-4" />
                    {subject.name}
                </div>
              </TabsTrigger>
            ))}
          </TabsList>
          {Object.entries(subjects).map(([key, subject]) => (
            <TabsContent key={key} value={key} className="mt-4">
              <div className="flex justify-between items-center mb-4 p-2 rounded-lg bg-muted">
                <h4 className="font-semibold">Total Study Time</h4>
                <span className="font-bold text-lg text-primary">{subject.totalHours.toFixed(1)} hours</span>
              </div>
              <SubjectCard
                subjectKey={key}
                subject={subject}
                onUpdate={onUpdate}
              />
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}
