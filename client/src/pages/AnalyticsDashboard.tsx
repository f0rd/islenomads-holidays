/**
 * Analytics Dashboard
 * Displays key user behavior and conversion metrics with real-time data visualization
 */

import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  ScatterChart, Scatter
} from "recharts";
import { useState } from "react";
import { ArrowUp, TrendingUp, Users, Package, BookOpen, MapPin } from "lucide-react";
import { Loader2 } from "lucide-react";

export default function AnalyticsDashboard() {
  const { user } = useAuth();
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d'>('30d');

  // Fetch analytics data
  const { data: dashboardData, isLoading: dashboardLoading } = trpc.analytics.dashboard.useQuery();
  const { data: packageMetrics, isLoading: packageLoading } = trpc.analytics.packagePerformance.useQuery();
  const { data: conversionData, isLoading: conversionLoading } = trpc.analytics.conversions.useQuery();
  const { data: destinationData, isLoading: destinationLoading } = trpc.analytics.destinations.useQuery();
  const { data: engagementData, isLoading: engagementLoading } = trpc.analytics.engagement.useQuery();

  const isLoading = dashboardLoading || packageLoading || conversionLoading || destinationLoading || engagementLoading;

  // Color palette for charts
  const COLORS = ['#0891b2', '#06b6d4', '#22d3ee', '#67e8f9', '#cffafe'];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-teal-500" />
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  // Prepare data for charts
  const categoryData = dashboardData?.distribution.packageCategories 
    ? Object.entries(dashboardData.distribution.packageCategories).map(([name, value]) => ({
        name: name.replace('-', ' ').toUpperCase(),
        value,
      }))
    : [];

  const destinationData_formatted = dashboardData?.topData.topDestinations
    ? dashboardData.topData.topDestinations.map((d: any) => ({
        name: d.name || 'Unknown',
        packages: d.count,
      }))
    : [];

  const crmStatusData = dashboardData?.distribution.crmStatus
    ? Object.entries(dashboardData.distribution.crmStatus).map(([status, count]) => ({
        name: status.charAt(0).toUpperCase() + status.slice(1),
        value: count,
      }))
    : [];

  const inquiriesByDateData = conversionData?.inquiriesByDate
    ? Object.entries(conversionData.inquiriesByDate)
        .slice(-7) // Last 7 days
        .map(([date, count]) => ({
          date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          inquiries: count,
        }))
    : [];

  const activitySpotTypeData = engagementData?.activitySpotsByType
    ? Object.entries(engagementData.activitySpotsByType).map(([type, count]) => ({
        name: type.replace('-', ' ').toUpperCase(),
        value: count,
      }))
    : [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
              <p className="text-gray-600 mt-2">Real-time insights into user behavior and conversion metrics</p>
            </div>
            <div className="flex gap-2">
              {(['7d', '30d', '90d'] as const).map((range) => (
                <Button
                  key={range}
                  variant={dateRange === range ? 'default' : 'outline'}
                  onClick={() => setDateRange(range)}
                  className="text-sm"
                >
                  {range === '7d' ? 'Last 7 Days' : range === '30d' ? 'Last 30 Days' : 'Last 90 Days'}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <Card className="bg-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <Package className="w-4 h-4 text-teal-500" />
                Total Packages
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{dashboardData?.summary.totalPackages || 0}</div>
              <p className="text-xs text-gray-500 mt-1">
                <ArrowUp className="w-3 h-3 inline mr-1" />
                {dashboardData?.summary.featuredPackages || 0} featured
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-cyan-500" />
                Island Guides
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{dashboardData?.summary.totalIslandGuides || 0}</div>
              <p className="text-xs text-gray-500 mt-1">
                {dashboardData?.summary.publishedIslandGuides || 0} published
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-blue-500" />
                Blog Posts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{dashboardData?.summary.totalBlogPosts || 0}</div>
              <p className="text-xs text-gray-500 mt-1">
                {dashboardData?.engagement.totalBlogViews || 0} total views
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <Users className="w-4 h-4 text-green-500" />
                Inquiries
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{conversionData?.totalInquiries || 0}</div>
              <p className="text-xs text-gray-500 mt-1">
                {conversionData?.conversionRate || 0}% conversion rate
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-purple-500" />
                Engagement
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{engagementData?.avgBlogViews || 0}</div>
              <p className="text-xs text-gray-500 mt-1">
                avg views per post
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Package Categories Distribution */}
          <Card className="bg-white">
            <CardHeader>
              <CardTitle>Package Categories</CardTitle>
              <CardDescription>Distribution of packages by category</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Top Destinations */}
          <Card className="bg-white">
            <CardHeader>
              <CardTitle>Top Destinations</CardTitle>
              <CardDescription>Most popular package destinations</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={destinationData_formatted}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="packages" fill="#0891b2" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Inquiry Trends */}
          <Card className="bg-white">
            <CardHeader>
              <CardTitle>Inquiry Trends</CardTitle>
              <CardDescription>Contact inquiries over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={inquiriesByDateData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="inquiries"
                    stroke="#0891b2"
                    strokeWidth={2}
                    dot={{ fill: '#0891b2', r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* CRM Status Distribution */}
          <Card className="bg-white">
            <CardHeader>
              <CardTitle>Inquiry Status</CardTitle>
              <CardDescription>Distribution of inquiry statuses</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={crmStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {crmStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Activity Spot Types */}
          <Card className="bg-white">
            <CardHeader>
              <CardTitle>Activity Spot Types</CardTitle>
              <CardDescription>Distribution of activity spots by type</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={activitySpotTypeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#06b6d4" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Destination Breakdown */}
          <Card className="bg-white lg:col-span-2">
            <CardHeader>
              <CardTitle>Destination Metrics</CardTitle>
              <CardDescription>Islands and atolls overview</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-gradient-to-br from-teal-50 to-teal-100 rounded-lg">
                  <div className="text-sm text-teal-600 font-medium">Total Islands</div>
                  <div className="text-2xl font-bold text-teal-900 mt-2">{destinationData?.totalIslands || 0}</div>
                </div>
                <div className="p-4 bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-lg">
                  <div className="text-sm text-cyan-600 font-medium">Published Islands</div>
                  <div className="text-2xl font-bold text-cyan-900 mt-2">{destinationData?.publishedIslands || 0}</div>
                </div>
                <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                  <div className="text-sm text-blue-600 font-medium">Total Atolls</div>
                  <div className="text-2xl font-bold text-blue-900 mt-2">{destinationData?.totalAtolls || 0}</div>
                </div>
                <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
                  <div className="text-sm text-purple-600 font-medium">Published Atolls</div>
                  <div className="text-2xl font-bold text-purple-900 mt-2">{destinationData?.publishedAtolls || 0}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="bg-white">
          <CardHeader>
            <CardTitle>Recent Inquiries</CardTitle>
            <CardDescription>Latest contact form submissions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {conversionData?.recentInquiries && conversionData.recentInquiries.length > 0 ? (
                conversionData.recentInquiries.slice(0, 5).map((inquiry: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <div>
                      <p className="font-medium text-gray-900">{inquiry.name}</p>
                      <p className="text-sm text-gray-500">{inquiry.email}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">
                        {new Date(inquiry.createdAt).toLocaleDateString()}
                      </p>
                      <span className={`inline-block px-2 py-1 text-xs font-medium rounded mt-1 ${
                        inquiry.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        inquiry.status === 'responded' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {inquiry.status || 'Pending'}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 py-8">No recent inquiries</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
