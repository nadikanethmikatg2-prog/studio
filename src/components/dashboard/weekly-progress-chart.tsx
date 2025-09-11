"use client";

import { Line, LineChart, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend } from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, GanttChart } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format, startOfWeek, endOfWeek } from "date-fns";
import type { Subjects } from "@/app/page";

interface WeeklyProgressChartProps {
  weekData: any[];
  subjects: Subjects;
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

export function WeeklyProgressChart({ weekData, subjects, selectedDate, onDateChange }: WeeklyProgressChartProps) {
  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(selectedDate, { weekStartsOn: 1 });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="space-y-1.5">
            <CardTitle className="flex items-center gap-2">
                <GanttChart className="h-6 w-6 text-primary"/>
                Weekly Progress
            </CardTitle>
            <CardDescription>
                {format(weekStart, "MMM d")} - {format(weekEnd, "MMM d, yyyy")}
            </CardDescription>
        </div>
        <Popover>
            <PopoverTrigger asChild>
                <Button variant={"outline"} size={"sm"}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(selectedDate, "MMM d, yyyy")}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
                <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(day) => day && onDateChange(day)}
                    initialFocus
                />
            </PopoverContent>
        </Popover>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
            {weekData.some(d => d.totalHours > 0) ? (
                <LineChart data={weekData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                    <XAxis
                    dataKey="date"
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    />
                    <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${value}h`}
                    />
                    <Tooltip
                        cursor={{ fill: "hsl(var(--muted))" }}
                        contentStyle={{
                            backgroundColor: "hsl(var(--background))",
                            borderColor: "hsl(var(--border))",
                        }}
                        formatter={(value: number) => [`${value.toFixed(1)} hrs`, 'Hours']}
                    />
                    <Legend iconSize={10} />
                    <Line type="monotone" dataKey="totalHours" name="Total Hours" stroke="hsl(var(--primary))" strokeWidth={2} />
                    {Object.entries(subjects).map(([key, subject]) => (
                        <Line key={key} type="monotone" dataKey={key} name={subject.name} stroke={subject.color} strokeWidth={1} strokeDasharray="3 3"/>
                    ))}
                </LineChart>
            ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                    No study hours logged for this week.
                </div>
            )}
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
