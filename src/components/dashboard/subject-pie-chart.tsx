"use client";

import { Pie, PieChart, ResponsiveContainer, Cell, Tooltip, Legend } from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import type { Subjects } from "@/app/page";
import { PieChart as PieChartIcon } from "lucide-react";
import React from "react";

interface SubjectPieChartProps {
  subjects: Subjects;
}

const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.6;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  if (percent < 0.05) return null; // Don't render label for small slices

  return (
    <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" className="text-xs font-medium">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};


export function SubjectPieChart({ subjects }: SubjectPieChartProps) {
  const chartData = Object.values(subjects)
    .filter((subject) => subject.totalHours > 0)
    .map((subject) => ({
      name: subject.name,
      value: subject.totalHours,
      fill: subject.color,
    }));

  return (
    <div className="h-full flex flex-col">
        <div className="p-4 pb-0">
            <h3 className="text-lg font-semibold flex items-center gap-2">
                <PieChartIcon className="h-5 w-5 text-primary" />
                Subject Distribution
            </h3>
            <p className="text-sm text-muted-foreground">
                Your study time distribution.
            </p>
        </div>
        <div className="flex-1 min-h-0">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                <Tooltip
                    cursor={{ fill: "hsl(var(--muted))" }}
                    contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    borderColor: "hsl(var(--border))",
                    borderRadius: "var(--radius)",
                    }}
                    formatter={(value: number, name: string) => [`${value.toFixed(1)} hrs`, name]}
                />
                <Pie
                    data={chartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius="80%"
                    innerRadius="50%"
                    labelLine={false}
                    label={renderCustomizedLabel}
                    paddingAngle={2}
                >
                    {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} stroke={"hsl(var(--card))"} strokeWidth={2} />
                    ))}
                </Pie>
                <Legend iconSize={10} wrapperStyle={{fontSize: '0.8rem'}}/>
                </PieChart>
            </ResponsiveContainer>
           ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
              Log some hours to see the chart.
            </div>
          )}
        </div>
    </div>
  );
}
