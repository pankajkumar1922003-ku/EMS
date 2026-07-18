import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { getDashboardStats } from "../services/dashboardService";
import type { DashboardStats } from "../types/employee";

const StatCard = ({
  label,
  value,
}: {
  label: string;
  value: number;
}) => (
  <div className="rounded-xl bg-white p-6 shadow">
    <h3 className="text-sm font-medium text-gray-500">{label}</h3>
    <p className="mt-3 text-4xl font-bold text-slate-900">{value}</p>
  </div>
);

const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await getDashboardStats();
        setStats(response.data.data);
      } catch (error: any) {
        toast.error(
          error.response?.data?.message || "Failed to load dashboard"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <h2 className="text-center text-2xl font-semibold text-gray-500">
        Loading...
      </h2>
    );
  }

  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold">Dashboard</h1>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Employees" value={stats?.totalEmployees ?? 0} />
        <StatCard label="Active Employees" value={stats?.activeEmployees ?? 0} />
        <StatCard label="Inactive Employees" value={stats?.inactiveEmployees ?? 0} />
        <StatCard
          label="Departments"
          value={stats?.departmentStats.length ?? 0}
        />
      </div>

      <div className="mt-8 rounded-xl bg-white p-6 shadow">
        <h3 className="mb-4 text-lg font-semibold">Employees by Department</h3>

        {stats?.departmentStats.length ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats.departmentStats}>
              <XAxis dataKey="department" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#2563eb" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-center text-gray-500">No department data yet</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
