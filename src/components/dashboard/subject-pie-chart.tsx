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
import { BrainCircuit } from "lucide-react";
import React from "react";

interface SubjectPieChartProps {
  subjects: Subjects;
}

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name }: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BrainCircuit className="h-6 w-6 text-primary" />
          Subject Distribution
        </CardTitle>
        <CardDescription>
          How your study time is distributed across subjects.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          {chartData.length > 0 ? (
            <PieChart>
              <Tooltip
                cursor={{ fill: "hsl(var(--muted))" }}
                contentStyle={{
                  backgroundColor: "hsl(var(--background))",
                  borderColor: "hsl(var(--border))",
                }}
                formatter={(value: number, name: string) => [`${value.toFixed(1)} hrs`, name]}
              />
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                labelLine={false}
                label={renderCustomizedLabel}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} stroke={entry.fill} />
                ))}
              </Pie>
              <Legend iconSize={10} />
            </PieChart>
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              Log some hours to see the chart.
            </div>
          )}
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
