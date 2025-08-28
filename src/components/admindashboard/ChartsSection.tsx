// import React from "react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
//   PieChart,
//   Pie,
//   Cell,
//   Legend
// } from "recharts";

// // Mock data for monthly registrations
// const monthlyData = [
//   { month: "Jan 2025", patients: 45 },
//   { month: "Feb 2025", patients: 52 },
//   { month: "Mar 2025", patients: 38 },
//   { month: "Apr 2025", patients: 67 },
//   { month: "May 2025", patients: 73 },
//   { month: "Jun 2025", patients: 58 },
//   { month: "Jul 2025", patients: 84 },
//   { month: "Aug 2025", patients: 92 }
// ];

// // Mock data for age distribution
// const ageDistributionData = [
//   { name: "Children (0-17)", value: 125, percentage: 25 },
//   { name: "Young Adults (18-39)", value: 200, percentage: 40 },
//   { name: "Adults (40-59)", value: 125, percentage: 25 },
//   { name: "Seniors (60+)", value: 50, percentage: 10 }
// ];

// const COLORS = [
//   'hsl(214 83% 47%)', // healthcare-chart-1
//   'hsl(158 64% 51%)', // healthcare-chart-2
//   'hsl(43 89% 58%)',  // healthcare-chart-3
//   'hsl(267 57% 52%)'  // healthcare-chart-4
// ];

// const ChartsSection = () => {
//   return (
//     <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
//       {/* Monthly Registration Trend */}
//       <Card className="shadow-md">
//         <CardHeader>
//           <CardTitle className="text-lg font-semibold text-foreground">
//             Monthly Patient Registrations
//           </CardTitle>
//           <p className="text-sm text-muted-foreground">
//             Registration trends over the past 8 months
//           </p>
//         </CardHeader>
//         <CardContent>
//           <div className="h-80">
//             <ResponsiveContainer width="100%" height="100%">
//               <BarChart data={monthlyData}>
//                 <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
//                 <XAxis 
//                   dataKey="month" 
//                   tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
//                   tickLine={{ stroke: 'hsl(var(--border))' }}
//                 />
//                 <YAxis 
//                   tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
//                   tickLine={{ stroke: 'hsl(var(--border))' }}
//                 />
//                 <Tooltip
//                   contentStyle={{
//                     backgroundColor: 'hsl(var(--card))',
//                     border: '1px solid hsl(var(--border))',
//                     borderRadius: '0.75rem',
//                     color: 'hsl(var(--foreground))'
//                   }}
//                 />
//                 <Bar 
//                   dataKey="patients" 
//                   fill="hsl(var(--healthcare-chart-1))"
//                   radius={[4, 4, 0, 0]}
//                 />
//               </BarChart>
//             </ResponsiveContainer>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Age Distribution */}
//       <Card className="shadow-md">
//         <CardHeader>
//           <CardTitle className="text-lg font-semibold text-foreground">
//             Patient Age Distribution
//           </CardTitle>
//           <p className="text-sm text-muted-foreground">
//             Breakdown of patients by age groups
//           </p>
//         </CardHeader>
//         <CardContent>
//           <div className="h-80">
//             <ResponsiveContainer width="100%" height="100%">
//               <PieChart>
//                 <Pie
//                   data={ageDistributionData}
//                   cx="50%"
//                   cy="50%"
//                   labelLine={false}
//                   label={({ name, percentage }) => `${name}: ${percentage}%`}
//                   outerRadius={80}
//                   fill="#8884d8"
//                   dataKey="value"
//                   className="text-xs"
//                 >
//                   {ageDistributionData.map((entry, index) => (
//                     <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                   ))}
//                 </Pie>
//                 <Tooltip
//                   contentStyle={{
//                     backgroundColor: 'hsl(var(--card))',
//                     border: '1px solid hsl(var(--border))',
//                     borderRadius: '0.75rem',
//                     color: 'hsl(var(--foreground))'
//                   }}
//                 />
//                 <Legend 
//                   wrapperStyle={{ 
//                     fontSize: '12px',
//                     color: 'hsl(var(--muted-foreground))'
//                   }}
//                 />
//               </PieChart>
//             </ResponsiveContainer>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default ChartsSection;


import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
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
  Legend,
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
  { month: "Aug 2025", patients: 92 },
];

// Standard healthcare palette
const COLORS = [
  "hsl(214 83% 47%)", // blue
  "hsl(158 64% 51%)", // green
  "hsl(43 89% 58%)", // yellow
  "hsl(267 57% 52%)", // purple
];

// Map stages to colors for consistency
const getStageColor = (stage: string, index: number) => {
  return COLORS[index % COLORS.length];
};

const ChartsSection = () => {
  const [diseaseStages, setDiseaseStages] = useState<any[]>([]);
  const [confidenceStages, setConfidenceStages] = useState<any[]>([]);
  const navigate = useNavigate();

  const getAuthToken = () => {
    return (
      localStorage.getItem("token") ||
      localStorage.getItem("access_token") ||
      localStorage.getItem("authToken")
    );
  };

  useEffect(() => {
    const fetchDiseaseStages = async () => {
      try {
        const token = getAuthToken();
        if (!token) {
          localStorage.clear();
          navigate("/");
          throw new Error("No token found");
        }

        // API #1: distribution
        const res1 = await fetch(
          "http://localhost:8000/analytics/disease/stages",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!res1.ok) throw new Error(`Error ${res1.status}`);
        const result1 = await res1.json();
        setDiseaseStages(result1.distribution);

        // API #2: avg confidence
        const res2 = await fetch(
          "http://localhost:8000/analytics/disease/stages/avg-confidence",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!res2.ok) throw new Error(`Error ${res2.status}`);
        const result2 = await res2.json();
        setConfidenceStages(result2.distribution);
      } catch (err) {
        console.error("Error fetching analytics data:", err);
      }
    };

    fetchDiseaseStages();
  }, []);

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
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(var(--border))"
                />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                  tickLine={{ stroke: "hsl(var(--border))" }}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                  tickLine={{ stroke: "hsl(var(--border))" }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "0.75rem",
                    color: "hsl(var(--foreground))",
                  }}
                />
                <Bar dataKey="patients" radius={[4, 4, 0, 0]}>
                  {monthlyData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Disease Stage Distribution (Pie Chart) */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-foreground">
            Disease Stage Distribution
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Breakdown of patients by disease stages
          </p>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={diseaseStages}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ stage, disease_count }) =>
                    `${stage}: ${disease_count}`
                  }
                  outerRadius={80}
                  dataKey="disease_count"
                >
                  {diseaseStages.map((entry, index) => (
                    <Cell
                      key={`cell-pie-${index}`}
                      fill={getStageColor(entry.stage, index)}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "0.75rem",
                    color: "hsl(var(--foreground))",
                  }}
                />
                <Legend
                  verticalAlign="top"
                  align="right"
                  wrapperStyle={{
                    fontSize: "12px",
                    color: "hsl(var(--muted-foreground))",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Avg Confidence per Stage (Bar Chart) */}
      <Card className="shadow-md col-span-1 lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-foreground">
            Avg Confidence by Disease Stage
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Model prediction confidence for each stage
          </p>
        </CardHeader>
        <CardContent>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={confidenceStages}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(var(--border))"
                />
                <XAxis
                  dataKey="stage"
                  tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                />
                <YAxis
                  domain={[0, 100]}
                  tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "0.75rem",
                    color: "hsl(var(--foreground))",
                  }}
                />
                <Legend
                  verticalAlign="top"
                  align="right"
                  wrapperStyle={{
                    fontSize: "12px",
                    color: "hsl(var(--muted-foreground))",
                  }}
                />
                <Bar dataKey="avg_confidence" radius={[4, 4, 0, 0]}>
                  {confidenceStages.map((entry, index) => (
                    <Cell
                      key={`cell-bar-${index}`}
                      fill={getStageColor(entry.stage, index)}                     />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChartsSection;
