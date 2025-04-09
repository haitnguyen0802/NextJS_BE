"use client";

// import { FiDollarSign, FiShoppingBag, FiUsers, FiClock } from "react-icons/fi";
import DashboardLayout from "./components/DashboardLayout";
import StatCard from "./components/StatCard";
import DataTable from "./components/DataTable";
import SalesChart from "./components/SalesChart";
import { Users, Package, TrendingUp, Clock } from "lucide-react";

export default function Home() {
  // Sample data for deals table
  const products = [
    {
      id: 1,
      name: "Apple Watch",
      location: "6096 Marjolaine Landing",
      dateTime: "12.09.2019 - 12.53 PM",
      pieces: 423,
      amount: "$34,295",
      status: "Delivered" as const,
      image: "/images/profile-placeholder.jpg",
    },
    {
      id: 2,
      name: "Apple Watch",
      location: "6096 Marjolaine Landing",
      dateTime: "12.09.2019 - 12.53 PM",
      pieces: 423,
      amount: "$34,295",
      status: "Pending" as const,
      image: "/images/profile-placeholder.jpg",
    },
    {
      id: 3,
      name: "Apple Watch",
      location: "6096 Marjolaine Landing",
      dateTime: "12.09.2019 - 12.53 PM",
      pieces: 423,
      amount: "$34,295",
      status: "Rejected" as const,
      image: "/images/profile-placeholder.jpg",
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold text-white">Dashboard</h1>
        
        {/* Stat Cards */}
        <div className="grid grid-cols-4 gap-6 md:grid-cols-2 lg:grid-cols-4 --grid-box">
          <StatCard
            title="Total User"
            value="40,689"
            change={8.5}
            trend="up"
            period="from yesterday"
            icon={<Users className="w-6 h-6" />}
            iconBg="bg-blue-500/20"
            iconColor="text-blue-500"
          />
          <StatCard
            title="Total Order"
            value="10293"
            change={1.3}
            trend="up"
            period="from past week"
            icon={<Package className="w-6 h-6" />}
            iconBg="bg-yellow-500/20"
            iconColor="text-yellow-500"
          />
          <StatCard
            title="Total Sales"
            value="$89,000"
            change={4.3}
            trend="down"
            period="from yesterday"
            icon={<TrendingUp className="w-6 h-6" />}
            iconBg="bg-green-500/20"
            iconColor="text-green-500"
          />
          <StatCard
            title="Total Pending"
            value="2040"
            change={1.8}
            trend="up"
            period="from yesterday"
            icon={<Clock className="w-6 h-6" />}
            iconBg="bg-orange-500/20"
            iconColor="text-orange-500"
          />
        </div>

        {/* Sales Chart */}
        <div className="bg-[#1E2A3B] rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-white">Sales Details</h2>
            <select className="bg-[#273142] text-gray-400 text-sm rounded-lg px-3 py-1.5 border border-gray-700 focus:outline-none focus:border-blue-500">
              <option>October</option>
              <option>November</option>
              <option>December</option>
            </select>
          </div>
          <SalesChart />
        </div>

        {/* Deals Table */}
        <div className="bg-[#1E2A3B] rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-white">Deals Details</h2>
            <select className="bg-[#273142] text-gray-400 text-sm rounded-lg px-3 py-1.5 border border-gray-700 focus:outline-none focus:border-blue-500">
              <option>October</option>
              <option>November</option>
              <option>December</option>
            </select>
          </div>
          <DataTable products={products} />
        </div>
      </div>
    </DashboardLayout>
  );
}
