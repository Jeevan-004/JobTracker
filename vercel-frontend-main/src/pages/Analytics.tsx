import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, LineChart, PieChart, Lightbulb } from "lucide-react";
import { 
  PieChart as RechartsPie,
  Pie,
  Cell,
  BarChart as RechartsBar,
  Bar,
  LineChart as RechartsLine,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,        
  Legend,
  ResponsiveContainer 
} from "recharts";
import { useQuery } from "@tanstack/react-query";
import api from "@/services/api";
import { toast } from "sonner";

const Analytics = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("last30days");
  
  const { data: analyticsData, isLoading, error } = useQuery({
    queryKey: ['analytics', selectedPeriod],
    queryFn: async () => {
      const response = await api.get(`/api/jobs/analytics?period=${selectedPeriod}`);
      return response.data;
    }
  });

  useEffect(() => {
    if (error) {
      toast.error("Failed to load analytics data");
    }
  }, [error]);

  // Generate insights based on the data
  const generateInsights = (data: any) => {
    if (!data) return [];
    
    const insights = [];
    const { summary, statusDistribution } = data;

    // Interview rate insight
    const interviewRate = parseFloat(summary.interviewRate);
    if (interviewRate > 30) {
      insights.push({
        title: "Strong interview conversion rate",
        description: "Your application-to-interview rate is above average. Keep up the good work!"
      });
    } else if (interviewRate < 15) {
      insights.push({
        title: "Consider improving application targeting",
        description: "Your interview rate is below average. Consider focusing on roles that better match your skills."
      });
    }

    // Offer rate insight
    const offerRate = parseFloat(summary.offerRate);
    if (offerRate > 20) {
      insights.push({
        title: "Excellent offer conversion rate",
        description: "You're converting interviews to offers at a high rate. Your interview skills are strong!"
      });
    } else if (offerRate < 5) {
      insights.push({
        title: "Interview preparation opportunity",
        description: "Consider practicing common interview questions and improving your interview skills."
      });
    }

    // Response time insight
    const avgResponseTime = parseInt(summary.avgResponseTime);
    if (avgResponseTime > 14) {
      insights.push({
        title: "Long response times",
        description: "Companies are taking longer to respond. Consider following up after 1-2 weeks."
      });
    }

    // Status distribution insights
    const appliedCount = statusDistribution.find((s: any) => s.name === "Applied")?.value || 0;
    const interviewCount = statusDistribution.find((s: any) => s.name === "Interview")?.value || 0;
    if (interviewCount > 0 && appliedCount > 0) {
      const interviewRatio = interviewCount / appliedCount;
      if (interviewRatio > 0.4) {
        insights.push({
          title: "High interview conversion",
          description: "You're getting interviews for a large portion of your applications. Your resume is working well!"
        });
      }
    }

    return insights;
  };

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <div className="flex items-center justify-center h-[60vh]">
          <div className="w-16 h-16 border-4 border-t-jobwise-medium rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-jobwise-dark mb-2">Analytics Dashboard</h1>
        <p className="text-gray-600">
          Track your application progress and gain insights to improve your job search
        </p>
      </div>

      {/* Time Period Selector */}
      <div className="mb-8">
        <Tabs value={selectedPeriod} onValueChange={setSelectedPeriod} className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-3">
            <TabsTrigger value="last30days">Last 30 Days</TabsTrigger>
            <TabsTrigger value="last90days">Last 90 Days</TabsTrigger>
            <TabsTrigger value="alltime">All Time</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {analyticsData?.summary && [
          { title: "Total Applications", value: analyticsData.summary.totalApplications, color: "bg-jobwise-light" },
          { title: "Interview Rate", value: analyticsData.summary.interviewRate, color: "bg-blue-100" },
          { title: "Offer Rate", value: analyticsData.summary.offerRate, color: "bg-green-100" },
          { title: "Avg. Response Time", value: analyticsData.summary.avgResponseTime, color: "bg-amber-100" },
        ].map((card, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card>
              <CardContent className={`p-6 ${card.color}`}>
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-medium text-gray-500">{card.title}</p>
                  <h3 className="text-2xl font-bold text-jobwise-dark">{card.value}</h3>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Application Status Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-bold text-jobwise-dark">Application Status</CardTitle>
              <PieChart className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent className="pt-2">
              <div className="h-[300px] flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPie>
                    <Pie
                      data={analyticsData?.statusDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {analyticsData?.statusDistribution.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} Applications`, ""]} />
                    <Legend />
                  </RechartsPie>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Applications Over Time */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-bold text-jobwise-dark">Applications Over Time</CardTitle>
              <LineChart className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent className="pt-2">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsLine data={analyticsData?.timeData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis 
                      dataKey="date" 
                      tickFormatter={(date) => new Date(date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    />
                    <YAxis />
                    <Tooltip 
                      labelFormatter={(date) => new Date(date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                      formatter={(value) => [`${value} Applications`, ""]}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="count" 
                      name="Applications" 
                      stroke="#A3A3CC" 
                      strokeWidth={2}
                      activeDot={{ r: 8, fill: "#5C5C99" }} 
                    />
                  </RechartsLine>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Applications by Role */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-bold text-jobwise-dark">Applications by Role</CardTitle>
              <BarChart className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent className="pt-2">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBar data={analyticsData?.roleData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="applied" name="Applied" fill="#A3A3CC" />
                    <Bar dataKey="interview" name="Interview" fill="#5C5C99" />
                    <Bar dataKey="offered" name="Offered" fill="#292966" />
                  </RechartsBar>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Insights Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-bold text-jobwise-dark">Insights & Tips</CardTitle>
              <Lightbulb className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent className="pt-2">
              <div className="space-y-4">
                {generateInsights(analyticsData).map((insight, index) => (
                  <div key={index} className="p-3 bg-jobwise-light/20 rounded-lg border border-jobwise-light/30">
                    <h3 className="font-medium text-jobwise-dark">{insight.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{insight.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Analytics;
