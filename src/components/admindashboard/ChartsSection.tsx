import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";

// Mock data for monthly registrations
const monthlyData = [
  { month: "Jan 2025", patients: 45 },
  { month: "Feb 2025", patients: 52 },
  { month: "Mar 2025", patients: 38 },
  { month: "Apr 2025", patients: 67 },
  { month: "May 2025", patients: 73 },
  { month: "Jun 2025", patients: 58 },
  { month: "Jul 2025", patients: 84 },
  { month: "Aug 2025", patients: 92 }
];

// Mock data for age distribution
const ageDistributionData = [
  { name: "Children (0-17)", value: 125, percentage: 25 },
  { name: "Young Adults (18-39)", value: 200, percentage: 40 },
  { name: "Adults (40-59)", value: 125, percentage: 25 },
  { name: "Seniors (60+)", value: 50, percentage: 10 }
];

const COLORS = [
  'hsl(214 83% 47%)', // healthcare-chart-1
  'hsl(158 64% 51%)', // healthcare-chart-2
  'hsl(43 89% 58%)',  // healthcare-chart-3
  'hsl(267 57% 52%)'  // healthcare-chart-4
];

const ChartsSection = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* Monthly Registration Trend */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-foreground">
            Monthly Patient Registrations
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Registration trends over the past 8 months
          </p>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="month" 
                  tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                  tickLine={{ stroke: 'hsl(var(--border))' }}
                />
                <YAxis 
                  tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                  tickLine={{ stroke: 'hsl(var(--border))' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '0.75rem',
                    color: 'hsl(var(--foreground))'
                  }}
                />
                <Bar 
                  dataKey="patients" 
                  fill="hsl(var(--healthcare-chart-1))"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Age Distribution */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-foreground">
            Patient Age Distribution
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Breakdown of patients by age groups
          </p>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={ageDistributionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percentage }) => `${name}: ${percentage}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  className="text-xs"
                >
                  {ageDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '0.75rem',
                    color: 'hsl(var(--foreground))'
                  }}
                />
                <Legend 
                  wrapperStyle={{ 
                    fontSize: '12px',
                    color: 'hsl(var(--muted-foreground))'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChartsSection;