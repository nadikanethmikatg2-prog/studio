"use client";

import { Pie, PieChart, ResponsiveContainer, Cell, Tooltip } from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import type { Subjects } from "@/app/page";
import { BrainCircuit } from "lucide-react";

interface SubjectPieChartProps {
  subjects: Subjects;
}

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
              />
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label={(entry) => `${entry.name.split(" ")[0]}`}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
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
