import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Search,
  Filter,
  Download,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Calendar,
  Users,
  BookOpen,
  TrendingUp,
  Edit2,
} from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import MarkAttendance from "./MarkAttendance";

const STATUSES = ["Present", "Absent", "Late", "Excused"];

function statusIcon(status) {
  if (status === "Present")
    return <CheckCircle className="h-3.5 w-3.5 text-green-500" />;
  if (status === "Absent")
    return <XCircle className="h-3.5 w-3.5 text-red-400" />;
  if (status === "Late")
    return <Clock className="h-3.5 w-3.5 text-amber-500" />;
  return <AlertCircle className="h-3.5 w-3.5 text-blue-400" />;
}

function statusClass(status) {
  if (status === "Present")
    return "bg-green-50  text-green-700  border-green-100";
  if (status === "Absent") return "bg-red-50    text-red-600    border-red-100";
  if (status === "Late") return "bg-amber-50  text-amber-700  border-amber-100";
  return "bg-blue-50   text-blue-700   border-blue-100";
}

function AttendancePill({ status }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium ${statusClass(status)}`}
    >
      {statusIcon(status)} {status}
    </span>
  );
}

function ProgressBar({ value, color = "bg-indigo-500" }) {
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 flex-1 rounded-full bg-gray-100">
        <div
          className={`h-full rounded-full ${color}`}
          style={{ width: `${value}%` }}
        />
      </div>
      <span className="w-8 text-right text-xs font-medium text-gray-600">
        {value}%
      </span>
    </div>
  );
}

const ITEMS_PER_PAGE = 12;

export default function AdminAttendance() {
  const { token } = useAuth();
  const navigate = useNavigate();

  // ── State ──────────────────────────────────────────────
  const [view, setView] = useState("overview"); // "overview" | "records"
  const [summary, setSummary] = useState({
    totalSessions: 0,
    avgAttendance: 0,
    presentToday: 0,
    absentToday: 0,
  });
  const [classes, setClasses] = useState([]);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Filters
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [statusFilter, setStatusFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  // Edit modal
  const [editRecord, setEditRecord] = useState(null);
  const [editStatus, setEditStatus] = useState("");
  const [editLoading, setEditLoading] = useState(false);

  const authToken = () => token || localStorage.getItem("token");

  // Fetch scheduled classes
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8081/api/classSchedule/scheduledClasses",
          { headers: { Authorization: `Bearer ${authToken()}` } },
        );
        setClasses(res.data || []);
      } catch (err) {
        console.error("Failed to fetch classes:", err);
        setError("Failed to load classes");
      }
    };
    fetchClasses();
  }, [token]);

  // ── Fetch attendance records ────────────────────────────
  useEffect(() => {
    if (view !== "records" || !selectedClass) return;

    const fetchRecords = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await axios.get(
          `http://localhost:8081/api/attendance/getAttendanceByClass/${selectedClass}`,
          {
            params: { date: selectedDate },
            headers: { Authorization: `Bearer ${authToken()}` },
          },
        );
        setRecords(res.data?.records ?? []);
      } catch (err) {
        console.error("Failed to fetch students:", err);
        setError("Failed to load student records");
        setRecords([]);
      } finally {
        setLoading(false);
      }
    };
    fetchRecords();
  }, [view, selectedClass, token]);

  // Example: Calculate avgAttendance from classes
  useEffect(() => {
    if (classes.length > 0) {
      const avg =
        classes.reduce((sum, cls) => sum + (cls.attendance || 0), 0) /
        classes.length;
      setSummary((prev) => ({ ...prev, avgAttendance: Math.round(avg) }));
    }
  }, [classes]);

  // ── Filtered + paginated records ────────────────────────
  const filtered = records.filter((r) => {
    const name = `${r.FirstName ?? ""} ${r.LastName ?? ""}`.toLowerCase();
    const matchSearch = name.includes(search.toLowerCase());
    const matchStatus = statusFilter === "All" || r.Status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE,
  );

  // ── Counts ──────────────────────────────────────────────
  const counts = STATUSES.reduce((acc, s) => {
    acc[s] = filtered.filter((r) => r.Status === s).length;
    return acc;
  }, {});

  // ── Export CSV ──────────────────────────────────────────
  const handleExport = () => {
    const headers = ["Student", "Status", "Scan Time", "Marked By"];
    const rows = filtered.map((r) => [
      `${r.FirstName} ${r.LastName}`,
      r.Status,
      r.ScanTime ?? "—",
      r.MarkedBy,
    ]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `attendance-${selectedDate}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // ── Save manual override ────────────────────────────────
  const handleSaveEdit = async () => {
    if (!editRecord || !editStatus) return;
    setEditLoading(true);
    try {
      await axios.patch(
        `http://localhost:8081/api/attendance/${editRecord.AttendanceID}`,
        { status: editStatus },
        {
          headers: {
            Authorization: `Bearer ${authToken()}`,
            "Content-Type": "application/json",
          },
        },
      );
      setRecords((prev) =>
        prev.map((r) =>
          r.AttendanceID === editRecord.AttendanceID
            ? { ...r, Status: editStatus, MarkedBy: "Admin" }
            : r,
        ),
      );
      setEditRecord(null);
    } catch {
      alert("Failed to update attendance.");
    } finally {
      setEditLoading(false);
    }
  };

  // ── Bar color helper ────────────────────────────────────
  const barColor = (pct) => {
    if (pct >= 90) return "bg-green-500";
    if (pct >= 75) return "bg-amber-400";
    return "bg-red-400";
  };

  return (
    <div className="space-y-5">
      {/* ── Page header ── */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Attendance</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            Monitor and manage attendance across all classes
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setView("overview")}
            className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
              view === "overview"
                ? "bg-indigo-600 text-white"
                : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setView("records")}
            className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
              view === "records"
                ? "bg-indigo-600 text-white"
                : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            Records
          </button>

          <button
            onClick={() => {
              setSelectedClass("");
              setView("mark");
            }}
            className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
              view === "mark"
                ? "bg-indigo-600 text-white"
                : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            Mark Attendance
          </button>
        </div>
      </div>

      {/* ── Summary cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Total sessions",
            value: summary.totalSessions,
            icon: Calendar,
            color: "text-indigo-600",
            bg: "bg-indigo-50",
          },
          {
            label: "Avg attendance",
            value: `${summary.avgAttendance}%`,
            icon: TrendingUp,
            color: "text-teal-600",
            bg: "bg-teal-50",
          },
          {
            label: "Present today",
            value: summary.presentToday,
            icon: CheckCircle,
            color: "text-green-600",
            bg: "bg-green-50",
          },
          {
            label: "Absent today",
            value: summary.absentToday,
            icon: XCircle,
            color: "text-red-500",
            bg: "bg-red-50",
          },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <div
            key={label}
            className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
          >
            <div className="flex items-start justify-between mb-3">
              <p className="text-xs font-medium text-gray-400">{label}</p>
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-lg ${bg}`}
              >
                <Icon className={`h-4 w-4 ${color}`} />
              </div>
            </div>
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* ── Mark attendance ── */}
      {view === "mark" && (
        <MarkAttendance classes={classes} onBack={() => setView("overview")} />
      )}

      {/* ── OVERVIEW ── */}
      {view === "overview" && (
        <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h2 className="text-sm font-semibold text-gray-900">
              Attendance by class
            </h2>
            <span className="text-xs text-gray-400">
              {classes.length} classes
            </span>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-xs font-medium text-gray-400">
                <th className="px-6 py-3.5 text-left">Class</th>
                <th className="px-4 py-3.5 text-left">Subject</th>
                <th className="px-4 py-3.5 text-left">Tutor</th>
                <th className="px-4 py-3.5 text-left w-48">Attendance rate</th>
                <th className="px-4 py-3.5 text-left">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {classes.map((cls) => (
                <tr
                  key={cls.ClassID}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50">
                        <BookOpen className="h-4 w-4 text-indigo-500" />
                      </div>
                      <p className="font-medium text-gray-900">
                        {cls.ClassName}
                      </p>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-gray-600">{cls.Subject}</td>
                  <td className="px-4 py-3.5 text-gray-600">{cls.Tutor}</td>
                  <td className="px-4 py-3.5">
                    <ProgressBar
                      value={cls.attendance}
                      color={barColor(cls.attendance)}
                    />
                  </td>
                  <td className="px-4 py-3.5">
                    <button
                      onClick={() => {
                        setSelectedClass(String(cls.ClassID));
                        setView("records");
                      }}
                      className="rounded-lg border border-gray-200 px-3 py-1 text-xs font-medium text-gray-600 hover:bg-gray-50 transition"
                    >
                      View records
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── RECORDS ── */}
      {view === "records" && (
        <div className="space-y-4">
          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Class selector */}
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-400 shrink-0" />
              <select
                value={selectedClass}
                onChange={(e) => {
                  setSelectedClass(e.target.value);
                  setPage(1);
                }}
                className="rounded-xl border border-gray-200 bg-white py-2 pl-3 pr-8 text-sm text-gray-700 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition"
              >
                <option value="">Select class</option>
                {classes.map((c) => (
                  <option key={c.ClassID} value={String(c.ClassID)}>
                    {c.ClassName}
                  </option>
                ))}
              </select>
            </div>

            {/* Date */}
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-400 shrink-0" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => {
                  setSelectedDate(e.target.value);
                  setPage(1);
                }}
                className="rounded-xl border border-gray-200 bg-white py-2 px-3 text-sm text-gray-700 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition"
              />
            </div>

            {/* Status filter */}
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="rounded-xl border border-gray-200 bg-white py-2 pl-3 pr-8 text-sm text-gray-700 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition"
            >
              <option value="All">All statuses</option>
              {STATUSES.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>

            {/* Search */}
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search student…"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="w-full rounded-xl border border-gray-200 bg-white py-2 pl-9 pr-4 text-sm placeholder-gray-400 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition"
              />
            </div>

            <div className="ml-auto">
              <button
                onClick={handleExport}
                className="flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 transition"
              >
                <Download className="h-4 w-4" /> Export
              </button>
            </div>
          </div>

          {/* Status count pills */}
          {records.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {STATUSES.map((s) => (
                <button
                  key={s}
                  onClick={() =>
                    setStatusFilter(statusFilter === s ? "All" : s)
                  }
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition ${
                    statusFilter === s
                      ? statusClass(s)
                      : "border-gray-200 bg-white text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  {statusIcon(s)} {s}{" "}
                  <span className="font-bold">{counts[s]}</span>
                </button>
              ))}
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error} — showing sample data.
            </div>
          )}

          {/* Table */}
          <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
            {!selectedClass ? (
              <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                <div className="mb-2 text-4xl">📋</div>
                <p className="text-sm font-medium">
                  Select a class to view records
                </p>
              </div>
            ) : loading ? (
              <div className="flex items-center justify-center py-20 text-sm text-gray-400">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent mr-3" />
                Loading records…
              </div>
            ) : paginated.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                <div className="mb-2 text-4xl">🗓️</div>
                <p className="text-sm font-medium">No records found</p>
                <p className="text-xs mt-1">Try changing the date or filter</p>
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50 text-xs font-medium text-gray-400">
                    <th className="px-5 py-3.5 text-left">Student</th>
                    <th className="px-4 py-3.5 text-left">Status</th>
                    <th className="px-4 py-3.5 text-left">Scan time</th>
                    <th className="px-4 py-3.5 text-left">Marked by</th>
                    <th className="px-4 py-3.5 text-left">Override</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {paginated.map((r) => (
                    <tr
                      key={r.AttendanceID}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-semibold text-indigo-700">
                            {`${r.FirstName?.[0] ?? ""}${r.LastName?.[0] ?? ""}`.toUpperCase()}
                          </div>
                          <p className="font-medium text-gray-900">
                            {r.FirstName} {r.LastName}
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <AttendancePill status={r.Status} />
                      </td>
                      <td className="px-4 py-3.5 text-gray-500 text-xs font-mono">
                        {r.ScanTime ?? "—"}
                      </td>
                      <td className="px-4 py-3.5">
                        <span
                          className={`text-xs font-medium ${
                            r.MarkedBy === "QR_KIOSK"
                              ? "text-indigo-500"
                              : "text-gray-500"
                          }`}
                        >
                          {r.MarkedBy === "QR_KIOSK" ? "QR scan" : r.MarkedBy}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <button
                          onClick={() => {
                            setEditRecord(r);
                            setEditStatus(r.Status);
                          }}
                          className="flex items-center gap-1 rounded-lg p-1.5 text-gray-400 hover:bg-indigo-50 hover:text-indigo-600 transition"
                          title="Override status"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">
                Page {page} of {totalPages}
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="rounded-lg border border-gray-200 p-1.5 text-gray-400 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(
                    (p) =>
                      p === 1 || p === totalPages || Math.abs(p - page) <= 1,
                  )
                  .reduce((acc, p, idx, arr) => {
                    if (idx > 0 && p - arr[idx - 1] > 1) acc.push("...");
                    acc.push(p);
                    return acc;
                  }, [])
                  .map((p, idx) =>
                    p === "..." ? (
                      <span key={`e-${idx}`} className="px-2 text-gray-300">
                        …
                      </span>
                    ) : (
                      <button
                        key={p}
                        onClick={() => setPage(p)}
                        className={`rounded-lg px-3 py-1.5 font-medium transition ${
                          page === p
                            ? "bg-indigo-600 text-white"
                            : "border border-gray-200 text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        {p}
                      </button>
                    ),
                  )}
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="rounded-lg border border-gray-200 p-1.5 text-gray-400 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Override modal ── */}
      {editRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl mx-4">
            <h3 className="text-base font-semibold text-gray-900 mb-1">
              Override attendance
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Changing status for{" "}
              <span className="font-medium text-gray-800">
                {editRecord.FirstName} {editRecord.LastName}
              </span>
            </p>
            <div className="grid grid-cols-2 gap-2 mb-5">
              {STATUSES.map((s) => (
                <button
                  key={s}
                  onClick={() => setEditStatus(s)}
                  className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-medium transition ${
                    editStatus === s
                      ? statusClass(s)
                      : "border-gray-200 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {statusIcon(s)} {s}
                </button>
              ))}
            </div>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setEditRecord(null)}
                className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                disabled={editLoading || editStatus === editRecord.Status}
                className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50 transition"
              >
                {editLoading ? "Saving…" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
