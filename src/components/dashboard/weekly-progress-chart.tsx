
"use client";

import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend } from "recharts";
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
  currentWeekData: any[];
  previousWeekData: any[];
  subjects: Subjects;
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

const CustomTooltip = ({ active, payload, label, subjects }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-2 bg-background/80 border border-border rounded-lg shadow-lg">
        <p className="label font-bold">{`${label}`}</p>
        {payload.map((pld: any, index: number) => (
            <div key={index} style={{ color: pld.stroke || pld.fill }}>
                {`${pld.name}: ${pld.value.toFixed(1)}h`}
            </div>
        ))}
      </div>
    );
  }

  return null;
};


export function WeeklyProgressChart({ currentWeekData, previousWeekData, subjects, selectedDate, onDateChange }: WeeklyProgressChartProps) {
  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(selectedDate, { weekStartsOn: 1 });
  
  const combinedData = currentWeekData.map((d, i) => ({
      ...d,
      previousTotalHours: previousWeekData[i]?.totalHours || 0
  }))

  return (
    <Card>
        <CardHeader>
            <div className="flex flex-row items-start justify-between">
                <div className="space-y-1.5">
                    <CardTitle className="flex items-center gap-2">
                        <GanttChart className="h-5 w-5 text-primary"/>
                        Weekly Progress
                    </CardTitle>
                    <CardDescription>
                        {format(weekStart, "MMM d")} - {format(weekEnd, "MMM d, yyyy")}
                    </CardDescription>
                </div>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant={"outline"} size={"sm"} className="text-xs">
                            <CalendarIcon className="mr-1.5 h-3.5 w-3.5" />
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
            </div>
      </CardHeader>
      <CardContent className="h-[300px]">
            {currentWeekData.some(d => d.totalHours > 0) || previousWeekData.some(d => d.totalHours > 0) ? (
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={combinedData} margin={{ top: 5, right: 20, left: -20, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4}/>
                                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <XAxis
                        dataKey="date"
                        stroke="hsl(var(--muted-foreground))"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        />
                        <YAxis
                        stroke="hsl(var(--muted-foreground))"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => `${value}h`}
                        />
                        <Tooltip
                            content={<CustomTooltip subjects={subjects} />}
                            cursor={{ fill: "hsl(var(--muted))", fillOpacity: 0.5 }}
                            contentStyle={{
                                backgroundColor: "hsl(var(--card))",
                                borderColor: "hsl(var(--border))",
                                borderRadius: "var(--radius)",
                            }}
                        />
                        <Legend iconSize={10} wrapperStyle={{fontSize: '0.8rem'}}/>
                        <Area dataKey="previousTotalHours" name="Previous Week" stroke="hsl(var(--muted-foreground))" fill="transparent" strokeWidth={1.5} strokeDasharray="4 4" />
                        <Area type="monotone" dataKey="totalHours" name="Current Week" stroke="hsl(var(--primary))" fill="url(#colorTotal)" strokeWidth={2} />
                    </AreaChart>
                </ResponsiveContainer>
            ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                    No study hours logged for this week.
                </div>
            )}
        </CardContent>
    </Card>
  );
}
