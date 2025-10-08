
"use client";

import { Bar, BarChart, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { CalendarDays } from "lucide-react";
import type { DailyLog, Subjects } from "@/app/page";
import { useLanguage } from "@/hooks/use-language";
import { format, parseISO, getDay } from 'date-fns';


interface ProductivityChartProps {
  dailyLogs: DailyLog;
  subjects: Subjects;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  const { t } = useLanguage();
  if (active && payload && payload.length) {
    const totalHours = payload.reduce((sum: number, entry: any) => sum + entry.value, 0);
    return (
      <div className="p-2 bg-background/80 border border-border rounded-lg shadow-lg">
        <p className="label font-bold">{label}</p>
        <p className="text-sm text-primary">{`${t('total')}: ${totalHours.toFixed(1)}${t('hrsSuffix')}`}</p>
        <hr className="my-1 border-border" />
        {payload.map((pld: any) => (
            <div key={pld.dataKey} style={{ color: pld.fill }} className="text-xs">
                {`${pld.name}: ${pld.value.toFixed(1)}${t('hrsSuffix')}`}
            </div>
        ))}
      </div>
    );
  }

  return null;
};


export function ProductivityChart({ dailyLogs, subjects }: ProductivityChartProps) {
  const { t } = useLanguage();
  
  const dayLabels = [t('sun'), t('mon'), t('tue'), t('wed'), t('thu'), t('fri'), t('sat')];

  const chartData = dayLabels.map(label => ({
    name: label,
    ...Object.keys(subjects).reduce((acc, key) => ({ ...acc, [key]: 0 }), {}),
  }));

  Object.entries(dailyLogs).forEach(([dateStr, logs]) => {
    // getDay returns 0 for Sunday, 1 for Monday, etc.
    const dayIndex = getDay(parseISO(dateStr));
    Object.entries(logs).forEach(([subjectKey, hours]) => {
      if (chartData[dayIndex] && chartData[dayIndex][subjectKey] !== undefined) {
        chartData[dayIndex][subjectKey] += hours;
      }
    });
  });

  const hasData = chartData.some(day => Object.values(day).some(val => typeof val === 'number' && val > 0));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-primary"/>
            {t('productivityHotspots')}
        </CardTitle>
        <CardDescription>{t('productivityHotspotsDescription')}</CardDescription>
      </CardHeader>
      <CardContent className="h-[250px]">
        {hasData ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <XAxis
                dataKey="name"
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
                cursor={{ fill: "hsl(var(--muted))" }}
                content={<CustomTooltip />}
              />
              {Object.entries(subjects).map(([key, subject]) => (
                <Bar 
                  key={key} 
                  dataKey={key} 
                  stackId="a" 
                  name={t(key as any) || subject.name}
                  fill={subject.color} 
                  radius={[4, 4, 0, 0]} 
                />
              ))}
            </BarChart>
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
