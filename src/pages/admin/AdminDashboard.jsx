import React, { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import {
  Users,
  DollarSign,
  Clock,
  TrendingUp,
  Download,
  Plus,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  Circle,
} from "lucide-react";

// Mock data
const workingHoursData = [
  { time: "8am",  thisMonth: 8,  lastMonth: 6  },
  { time: "10am", thisMonth: 14, lastMonth: 10 },
  { time: "12pm", thisMonth: 12, lastMonth: 13 },
  { time: "2pm",  thisMonth: 18, lastMonth: 12 },
  { time: "4pm",  thisMonth: 16, lastMonth: 15 },
  { time: "6pm",  thisMonth: 13, lastMonth: 11 },
  { time: "8pm",  thisMonth: 10, lastMonth: 8  },
];

const agendaItems = [
  { time: "7:30 AM", end: "8:30 AM", title: "Department Meetings", color: "bg-red-400",    light: "bg-red-50 border-red-200"   },
  { time: "8:00 AM", end: "9:00 AM", title: "Attending Conferences", color: "bg-indigo-400", light: "bg-indigo-50 border-indigo-200" },
  { time: "9:30 AM", end: "10:30 AM", title: "Student Evaluations",  color: "bg-teal-400",   light: "bg-teal-50 border-teal-200"  },
];

const stats = [
  {
    label: "New Students",
    value: "2,543",
    change: "80% increase in 20 days",
    icon: Users,
    iconBg: "bg-indigo-100",
    iconColor: "text-indigo-600",
    chartColor: "#6366f1",
    data: [4, 7, 5, 9, 6, 11, 8, 13, 10],
  },
  {
    label: "Total Students",
    value: "12,543",
    change: "60% increase than before",
    icon: TrendingUp,
    iconBg: "bg-purple-100",
    iconColor: "text-purple-600",
    chartColor: "#a855f7",
    data: [6, 8, 7, 10, 9, 12, 11, 14, 13],
  },
  {
    label: "Total Income",
    value: "$10,123",
    change: "80% increase in 20 days",
    icon: DollarSign,
    iconBg: "bg-pink-100",
    iconColor: "text-pink-600",
    chartColor: "#ec4899",
    data: [5, 3, 7, 4, 8, 5, 9, 6, 10],
  },
  {
    label: "Total Working Hours",
    value: "32h 42m",
    change: "80% increase than before",
    icon: Clock,
    iconBg: "bg-teal-100",
    iconColor: "text-teal-600",
    chartColor: "#14b8a6",
    data: [8, 10, 9, 12, 11, 13, 12, 15, 14],
  },
];

// Tiny sparkline
function Sparkline({ data, color }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const w = 80, h = 36, pad = 4;
  const pts = data.map((v, i) => {
    const x = pad + (i / (data.length - 1)) * (w - pad * 2);
    const y = pad + ((max - v) / (max - min || 1)) * (h - pad * 2);
    return `${x},${y}`;
  });
  const fill = pts.map((p, i) => {
    if (i === 0) return `M${p}`;
    return `L${p}`;
  }).join(" ");
  const area = `${fill} L${w - pad},${h - pad} L${pad},${h - pad} Z`;

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <path d={area} fill={color} fillOpacity="0.12" />
      <path d={fill} fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ── Stat card ─────────────────────────────────────────────
function StatCard({ stat }) {
  const Icon = stat.icon;
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm border border-gray-100">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-gray-400 mb-1">{stat.label}</p>
          <p className="text-2xl font-bold text-gray-900 tracking-tight">{stat.value}</p>
          <p className="text-xs text-gray-400 mt-1">{stat.change}</p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <button className="text-gray-300 hover:text-gray-400">
            <MoreHorizontal className="h-4 w-4" />
          </button>
          <Sparkline data={stat.data} color={stat.chartColor} />
        </div>
      </div>
    </div>
  );
}

// ── Custom tooltip ────────────────────────────────────────
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl bg-gray-900 px-3 py-2 text-xs text-white shadow-lg">
      <p className="font-semibold mb-1">{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color }}>
          {p.name === "thisMonth" ? "This Month" : "Last Month"}: {p.value}h
        </p>
      ))}
    </div>
  );
}

// ── Main component ────────────────────────────────────────
export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("1d");

  return (
    <div className="min-h-full space-y-6">

      {/* ── Header ── */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome Back, Admin 🎉
          </h1>
          <p className="text-sm text-gray-400 mt-0.5">
            Here's what's happening at your institute today.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 transition">
            <Download className="h-4 w-4" />
            Export
          </button>
          <button className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition">
            <Plus className="h-4 w-4" />
            Create
          </button>
        </div>
      </div>

      {/* ── Top row: Lecturer card + 4 stats ── */}
      <div className="grid grid-cols-12 gap-4">

        {/* Lecturer performance card */}
        <div className="col-span-12 lg:col-span-4 rounded-2xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-700 p-5 text-white relative overflow-hidden">
          {/* Decorative circles */}
          <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/5" />
          <div className="pointer-events-none absolute -bottom-6 -left-6 h-24 w-24 rounded-full bg-white/5" />

          <div className="relative flex items-start justify-between mb-4">
            <p className="text-sm font-semibold text-indigo-200">Lecturer Performance</p>
            <button className="text-xs text-indigo-300 hover:text-white">See more</button>
          </div>

          <div className="relative flex items-center gap-4 mb-4">
            <div className="h-14 w-14 rounded-full bg-indigo-400/40 flex items-center justify-center text-2xl font-bold border-2 border-indigo-300/40">
              A
            </div>
            <div>
              <p className="text-4xl font-bold">91.2%</p>
              <p className="text-xs text-indigo-300 mt-0.5">Overall Performance Score.</p>
            </div>
          </div>

          <div className="relative rounded-xl bg-white/10 px-4 py-3 text-sm">
            <span className="text-2xl font-bold text-white">86%</span>
            <span className="ml-2 text-xs text-indigo-200">
              Your Lesson Planning Score increased by 25% from the last month. Pretty good performance!
            </span>
          </div>

          {/* Pagination dots */}
          <div className="relative mt-4 flex items-center gap-2">
            <button className="text-indigo-300 hover:text-white"><ChevronLeft className="h-4 w-4" /></button>
            <div className="flex gap-1">
              <div className="h-1.5 w-4 rounded-full bg-white" />
              <div className="h-1.5 w-1.5 rounded-full bg-white/40" />
              <div className="h-1.5 w-1.5 rounded-full bg-white/40" />
            </div>
            <button className="text-indigo-300 hover:text-white"><ChevronRight className="h-4 w-4" /></button>
          </div>
        </div>

        {/* 4 stat cards */}
        <div className="col-span-12 lg:col-span-8 grid grid-cols-2 gap-4">
          {stats.map((stat) => (
            <StatCard key={stat.label} stat={stat} />
          ))}
        </div>
      </div>

      {/* ── Bottom row: Chart + Agenda ── */}
      <div className="grid grid-cols-12 gap-4">

        {/* Working hours chart */}
        <div className="col-span-12 lg:col-span-7 rounded-2xl bg-white p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-semibold text-gray-900">Working Hours Statistics</p>
            <div className="flex items-center gap-4 text-xs text-gray-400">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-indigo-500 inline-block" />
                This Month
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-gray-300 inline-block" />
                Last Month
              </span>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={workingHoursData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
              <defs>
                <linearGradient id="thisMonth" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#6366f1" stopOpacity={0.18} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}    />
                </linearGradient>
                <linearGradient id="lastMonth" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#94a3b8" stopOpacity={0.14} />
                  <stop offset="95%" stopColor="#94a3b8" stopOpacity={0}    />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="time" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: "#6366f1", strokeWidth: 1, strokeDasharray: "4 2" }} />
              <Area type="monotone" dataKey="lastMonth" stroke="#94a3b8" strokeWidth={2} fill="url(#lastMonth)" dot={false} />
              <Area type="monotone" dataKey="thisMonth" stroke="#6366f1" strokeWidth={2.5} fill="url(#thisMonth)"
                dot={false}
                activeDot={{ r: 5, fill: "#6366f1", stroke: "#fff", strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Agenda */}
        <div className="col-span-12 lg:col-span-5 rounded-2xl bg-white p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-semibold text-gray-900">My Agenda</p>
            <div className="flex gap-1">
              {["1d", "1w", "1m"].map((t) => (
                <button
                  key={t}
                  onClick={() => setActiveTab(t)}
                  className={`rounded-lg px-2.5 py-1 text-xs font-medium transition ${
                    activeTab === t
                      ? "bg-indigo-600 text-white"
                      : "text-gray-400 hover:text-gray-600"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Date header */}
          <div className="flex items-center gap-3 mb-4">
            <div className="text-xs text-gray-400">
              <p>GMT</p>
              <p>+7</p>
            </div>
            <div>
              <p className="text-xs text-gray-400">Today</p>
              <p className="text-base font-bold text-gray-900">
                {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              </p>
            </div>
          </div>

          {/* Time slots */}
          <div className="space-y-3">
            {agendaItems.map((item) => (
              <div key={item.title} className="flex gap-3 items-start">
                <div className="w-14 shrink-0 text-right">
                  <p className="text-xs text-gray-400">{item.time}</p>
                </div>
                <div className={`flex-1 rounded-xl border px-3 py-2.5 ${item.light}`}>
                  <div className="flex items-center gap-2">
                    <div className={`h-2 w-2 rounded-full ${item.color}`} />
                    <p className="text-xs font-semibold text-gray-800">{item.title}</p>
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5 ml-4">{item.time} – {item.end}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}