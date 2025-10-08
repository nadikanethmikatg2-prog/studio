
"use client";

import React, { useState, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend } from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GanttChart } from "lucide-react";
import { format, eachDayOfInterval, startOfWeek, endOfWeek, subWeeks, startOfMonth, endOfMonth, parseISO, eachWeekOfInterval } from "date-fns";
import type { DailyLog, Subjects } from "@/app/page";
import { useLanguage } from "@/hooks/use-language";
import { cn } from '@/lib/utils';

type ViewMode = 'week' | 'month' | 'all';

interface WeeklyProgressChartProps {
  dailyLogs: DailyLog;
  subjects: Subjects;
}

const CustomTooltip = ({ active, payload, label, viewMode }: any) => {
  const { t } = useLanguage();
  if (active && payload && payload.length) {
    return (
      <div className="p-2 bg-background/80 border border-border rounded-lg shadow-lg">
        <p className="label font-bold">{label}</p>
        {payload.map((pld: any, index: number) => {
            const subjectName = pld.name === 'totalHours' ? t('total') : pld.name;
            return (
                <div key={index} style={{ color: pld.stroke || pld.fill }}>
                    {`${subjectName}: ${pld.value.toFixed(1)}${t('hrsSuffix')}`}
                </div>
            )
        })}
      </div>
    );
  }

  return null;
};


export function WeeklyProgressChart({ dailyLogs, subjects }: WeeklyProgressChartProps) {
  const { t } = useLanguage();
  const [viewMode, setViewMode] = useState<ViewMode>('week');
  
  const chartData = useMemo(() => {
    const today = new Date();
    if (viewMode === 'week') {
        const weekStart = startOfWeek(today, { weekStartsOn: 1 });
        const weekEnd = endOfWeek(today, { weekStartsOn: 1 });
        const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });
        return weekDays.map(day => {
            const dateKey = format(day, 'yyyy-MM-dd');
            const dayLog = dailyLogs[dateKey] || {};
            const totalHours = Object.values(dayLog).reduce((sum, hours) => sum + hours, 0);
            return {
                date: format(day, "EEE"),
                totalHours,
            };
        });
    } else if (viewMode === 'month') {
        const monthStart = startOfMonth(today);
        const monthEnd = endOfMonth(today);
        const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });
        return monthDays.map(day => {
            const dateKey = format(day, 'yyyy-MM-dd');
            const dayLog = dailyLogs[dateKey] || {};
            const totalHours = Object.values(dayLog).reduce((sum, hours) => sum + hours, 0);
            return {
                date: format(day, "d"),
                totalHours,
            };
        });
    } else { // 'all' time
        const sortedDates = Object.keys(dailyLogs).sort();
        if (sortedDates.length === 0) return [];
        
        const firstDate = parseISO(sortedDates[0]);
        const lastDate = parseISO(sortedDates[sortedDates.length - 1]);
        
        const weeks = eachWeekOfInterval({
            start: firstDate,
            end: lastDate
        }, { weekStartsOn: 1 });

        return weeks.map(weekStart => {
            const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 });
            const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });
            
            let weeklyTotal = 0;
            weekDays.forEach(day => {
                const dateKey = format(day, 'yyyy-MM-dd');
                const dayLog = dailyLogs[dateKey] || {};
                weeklyTotal += Object.values(dayLog).reduce((sum, hours) => sum + hours, 0);
            });

            return {
                date: format(weekStart, 'MMM d'),
                totalHours: weeklyTotal,
            };
        });
    }
  }, [dailyLogs, viewMode]);


  return (
    <Card>
        <CardHeader>
            <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                <div className="space-y-1.5">
                    <CardTitle className="flex items-center gap-2">
                        <GanttChart className="h-5 w-5 text-primary"/>
                        {t("studyTrends")}
                    </CardTitle>
                    <CardDescription>
                        {t("studyTrendsDescription")}
                    </CardDescription>
                </div>
                <div className="flex-shrink-0 self-start sm:self-center">
                    <div className="flex items-center gap-1 rounded-md bg-muted p-1 text-muted-foreground">
                        {(['week', 'month', 'all'] as ViewMode[]).map((mode) => (
                        <Button
                            key={mode}
                            variant="ghost"
                            size="sm"
                            className={cn(
                            "text-xs px-2.5 py-1 h-7",
                            viewMode === mode && "bg-background text-foreground shadow-sm"
                            )}
                            onClick={() => setViewMode(mode)}
                        >
                            {t(mode)}
                        </Button>
                        ))}
                    </div>
                </div>
            </div>
      </CardHeader>
      <CardContent className="h-[300px]">
            {chartData.length > 0 && chartData.some(d => d.totalHours > 0) ? (
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 5, right: 20, left: -20, bottom: 0 }}>
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
                            interval={viewMode === 'month' ? 3 : 'preserveStartEnd'}
                        />
                        <YAxis
                            stroke="hsl(var(--muted-foreground))"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => `${value}h`}
                        />
                        <Tooltip
                            content={<CustomTooltip viewMode={viewMode}/>}
                            cursor={{ fill: "hsl(var(--muted))", fillOpacity: 0.5 }}
                        />
                        <Area 
                            type="monotone" 
                            dataKey="totalHours" 
                            name={t('totalHours')} 
                            stroke="hsl(var(--primary))" 
                            fill="url(#colorTotal)" 
                            strokeWidth={2} 
                        />
                    </AreaChart>
                </ResponsiveContainer>
            ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                    {t("noHoursLoggedYet")}
                </div>
            )}
        </CardContent>
    </Card>
  );
}
