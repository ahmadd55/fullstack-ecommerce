import { useState, useEffect } from "react";
import api from "../../api/axios";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const KpiCard = ({ title, value, icon, trendIcon, trendText, trendUp }) => (
  <div className="bg-white border border-gray-200 rounded-xl p-6 relative overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer">
    <div className="absolute top-0 right-0 w-24 h-24 bg-[#10b981]/5 rounded-bl-full -mr-4 -mt-4"></div>
    <div className="flex justify-between items-start mb-4 relative z-10">
      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
        {title}
      </h3>
      <span className="material-symbols-outlined text-[#10b981]">{icon}</span>
    </div>
    <div className="relative z-10">
      <div className="text-3xl font-bold text-[#006c49] mb-2">{value}</div>
      <div
        className={`flex items-center gap-1 text-sm font-medium ${trendUp ? "text-[#10b981]" : "text-gray-500"}`}
      >
        <span className="material-symbols-outlined text-sm">{trendIcon}</span>
        <span>{trendText}</span>
      </div>
    </div>
  </div>
);

const ActivityRow = ({
  icon,
  text,
  time,
  extraHtml,
  iconColorClass,
  iconBgClass,
}) => (
  <div className="flex items-center gap-4 py-3 border-b border-gray-100 last:border-0">
    <div
      className={`w-10 h-10 rounded-full flex items-center justify-center ${iconBgClass} ${iconColorClass}`}
    >
      <span className="material-symbols-outlined text-sm">{icon}</span>
    </div>
    <div className="flex-1">
      <p className="text-sm text-gray-900">{text}</p>
      <p className="text-xs text-gray-500 mt-1">{time}</p>
    </div>
    {extraHtml && <div>{extraHtml}</div>}
  </div>
);


export default function DashboardHome() {
  const [dashboardData, setDashboardData] = useState({
    stats: { revenue: "Rs 0", orders: "0", customers: "0" },
    charts: { salesOverview: [], salesByCategory: [] },
    activities: { recentOrders: [], lowStockProducts: [], recentUsers: [] },
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const res = await api.get("/dashboard/stats");
        setDashboardData(res.data.data);
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardStats();
  }, []);

  const formatDate = (dateString) => {
    const options = {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  
  const getPieChartBackground = () => {
    const data = dashboardData.charts.salesByCategory;
    if (!data || data.length === 0) return "conic-gradient(#e5e7eb 0% 100%)"; 

    const colors = ["#10b981", "#adedd3", "#34d399", "#059669", "#6ee7b7"];
    let currentPercent = 0;

    const gradientStops = data.map((cat, i) => {
      const start = currentPercent;
      currentPercent += cat.percentage;
      return `${colors[i % colors.length]} ${start}% ${currentPercent}%`;
    });

    return `conic-gradient(${gradientStops.join(", ")})`;
  };

  const chartColors = [
    "bg-[#10b981]",
    "bg-[#adedd3]",
    "bg-[#34d399]",
    "bg-[#059669]",
    "bg-[#6ee7b7]",
  ];

  return (
    <div className="flex-1 p-4 md:p-6 max-w-[1440px] mx-auto w-full bg-gray-50 overflow-y-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Overview</h2>
          <p className="text-gray-500 text-sm mt-1">
            Here's what's happening with your store today.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-10 text-gray-500 font-semibold">
          Loading Dashboard...
        </div>
      ) : (
        <>
        
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <KpiCard
              title="Total Revenue"
              value={dashboardData.stats.revenue}
              icon="payments"
              trendIcon="trending_up"
              trendText="Live data"
              trendUp={true}
            />
            <KpiCard
              title="Total Orders"
              value={dashboardData.stats.orders}
              icon="shopping_bag"
              trendIcon="trending_up"
              trendText="Live data"
              trendUp={true}
            />
            <KpiCard
              title="New Customers"
              value={dashboardData.stats.customers}
              icon="person_add"
              trendIcon="trending_flat"
              trendText="Live data"
              trendUp={false}
            />
          </div>

         
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                Sales Overview
              </h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={dashboardData.charts.salesOverview}
                    margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient
                        id="colorTotal"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#10b981"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor="#10b981"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#f3f4f6"
                    />
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#9ca3af", fontSize: 12 }}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#9ca3af", fontSize: 12 }}
                      tickFormatter={(val) => `Rs ${val / 1000}k`}
                    />
                    <Tooltip
                      cursor={{
                        stroke: "#10b981",
                        strokeWidth: 1,
                        strokeDasharray: "3 3",
                      }}
                      contentStyle={{
                        borderRadius: "8px",
                        border: "none",
                        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="total"
                      stroke="#10b981"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#colorTotal)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex flex-col">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                Sales by Category
              </h3>

              <div className="flex-1 flex items-center justify-center relative">
               
                <div
                  className="w-40 h-40 rounded-full relative shadow-sm"
                  style={{ background: getPieChartBackground() }}
                >
                  
                  <div className="absolute inset-4 bg-white rounded-full flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">
                        100%
                      </div>
                      <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        Total
                      </div>
                    </div>
                  </div>
                </div>
              </div>

             
              <div className="mt-6 flex flex-wrap justify-center gap-4">
                {dashboardData.charts.salesByCategory?.map((cat, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <div
                      className={`w-3 h-3 rounded-full ${chartColors[idx % chartColors.length]}`}
                    ></div>
                    <span className="text-sm text-gray-700">
                      {cat.name} ({cat.percentage}%)
                    </span>
                  </div>
                ))}
                {(!dashboardData.charts.salesByCategory ||
                  dashboardData.charts.salesByCategory.length === 0) && (
                  <span className="text-sm text-gray-500">
                    No data available
                  </span>
                )}
              </div>
            </div>
          </div>

         
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Recent Activity
              </h3>
            </div>
            <div className="flex flex-col gap-2">
              {dashboardData.activities.recentOrders?.map((order) => (
                <ActivityRow
                  key={`order-${order.id}`}
                  icon="shopping_cart_checkout"
                  iconBgClass="bg-[#10b981]/10"
                  iconColorClass="text-[#10b981]"
                  text={
                    <span>
                      <span className="font-semibold">Order #{order.id}</span>{" "}
                      was placed by{" "}
                      <span className="font-semibold">
                        {order.customer?.firstName}
                      </span>
                      .
                    </span>
                  }
                  time={formatDate(order.created_at)}
                  extraHtml={
                    <div className="text-sm font-mono font-semibold text-gray-900">
                      Rs {parseFloat(order.totalAmount).toLocaleString()}
                    </div>
                  }
                />
              ))}
              
            </div>
          </div>
        </>
      )}
    </div>
  );
}
