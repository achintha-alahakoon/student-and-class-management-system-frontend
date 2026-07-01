import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search, Plus, Filter, Eye, Edit, Trash2,
  BookOpen, Users, ChevronLeft, ChevronRight,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";

function StatusBadge({ status }) {
  return status ? (
    <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-700">
      <span className="h-1.5 w-1.5 rounded-full bg-green-500" />Active
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-500">
      <span className="h-1.5 w-1.5 rounded-full bg-gray-400" />Inactive
    </span>
  );
}

const ITEMS_PER_PAGE = 10;

export default function ClassManagement() {
  const { token }  = useAuth();
  const navigate   = useNavigate();

  const [classes,     setClasses]     = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState("");
  const [search,      setSearch]      = useState("");
  const [gradeFilter, setGradeFilter] = useState("All");
  const [page,        setPage]        = useState(1);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const authToken = token || localStorage.getItem("token");
        const res = await axios.get(
          "http://localhost:8081/api/classSchedule/scheduledClasses",
          { headers: { Authorization: `Bearer ${authToken}` } }
        );
        setClasses(res.data ?? []);
      } catch (err) {
        console.error("Error fetching classes:", err);
        setError("Failed to load classes. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchClasses();
  }, [token]);

  // Grade filter options derived from real data
  const grades = ["All", ...new Set(classes.map((c) => c.Grade).filter(Boolean)).values()];

  const filtered = classes.filter((c) => {
    const matchSearch =
      (c.ClassName ?? "").toLowerCase().includes(search.toLowerCase()) ||
      (c.Subject   ?? "").toLowerCase().includes(search.toLowerCase());
    const matchGrade = gradeFilter === "All" || c.Grade === gradeFilter;
    return matchSearch && matchGrade;
  });

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated  = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1)
    .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
    .reduce((acc, p, idx, arr) => {
      if (idx > 0 && p - arr[idx - 1] > 1) acc.push("...");
      acc.push(p);
      return acc;
    }, []);

  // Format time from "13:00:00" → "1:00 PM"
  const formatTime = (t) => {
    if (!t) return "—";
    const [h, m] = t.split(":").map(Number);
    const ampm = h >= 12 ? "PM" : "AM";
    const hour = h % 12 || 12;
    return `${hour}:${String(m).padStart(2, "0")} ${ampm}`;
  };

  const tutorInitials = (name) =>
    (name ?? "?").split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Class Management</h1>
          <p className="text-sm text-gray-500">Manage all classes and their assignments</p>
        </div>
        <Link
          to="/dashboard/admin/createclass"
          className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition"
        >
          <Plus className="h-4 w-4" /> Add Class
        </Link>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or subject..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full rounded-xl border border-gray-200 bg-white py-2 pl-9 pr-4 text-sm placeholder-gray-400 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <select
            value={gradeFilter}
            onChange={(e) => { setGradeFilter(e.target.value); setPage(1); }}
            className="w-full md:w-36 rounded-xl border border-gray-200 bg-white py-2 pl-9 pr-4 text-sm text-gray-700 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition"
          >
            {grades.map((g) => (
              <option key={g} value={g}>{g === "All" ? "All Grades" : `Grade ${g}`}</option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        {loading ? (
          <div className="flex items-center justify-center py-20 text-sm text-gray-400">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent mr-3" />
            Loading classes...
          </div>
        ) : paginated.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <div className="mb-2 text-4xl">📚</div>
            <p className="text-sm font-medium">No classes found</p>
            <p className="text-xs mt-1">Try adjusting your search or filter</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50 text-xs font-medium text-gray-400">
                <th className="px-5 py-3.5 text-left">Class</th>
                <th className="px-4 py-3.5 text-left">Grade</th>
                <th className="px-4 py-3.5 text-left">Subject</th>
                <th className="px-4 py-3.5 text-left">Tutor</th>
                <th className="px-4 py-3.5 text-left">Students</th>
                <th className="px-4 py-3.5 text-left">Hall</th>
                <th className="px-4 py-3.5 text-left">Schedule</th>
                <th className="px-4 py-3.5 text-left">Status</th>
                <th className="px-4 py-3.5 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {paginated.map((cls) => (
                <tr
                  key={cls.ScheduleID}
                  className="group hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => navigate(`/dashboard/admin/class-details/${cls.ClassID}`)}
                >
                  {/* Class name */}
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-xl bg-indigo-100 flex items-center justify-center">
                        <BookOpen className="h-4 w-4 text-indigo-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{cls.ClassName}</p>
                        <p className="text-xs text-gray-400 font-mono">#{cls.ClassID}</p>
                      </div>
                    </div>
                  </td>

                  {/* Grade */}
                  <td className="px-4 py-3.5 text-gray-600">Grade {cls.Grade}</td>

                  {/* Subject */}
                  <td className="px-4 py-3.5 text-gray-600">{cls.Subject}</td>

                  {/* Tutor */}
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2">
                      <div className="h-7 w-7 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-medium text-indigo-700">
                        {tutorInitials(cls.Tutor)}
                      </div>
                      <span className="text-sm text-gray-700">{cls.Tutor ?? "Unassigned"}</span>
                    </div>
                  </td>

                  {/* Student count — TODO: wire up when backend is ready */}
                  <td className="px-4 py-3.5 text-center">
                    <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">
                      <Users className="h-3 w-3" />
                      {cls.studentCount ?? "—"}
                    </span>
                  </td>

                  {/* Hall */}
                  <td className="px-4 py-3.5 text-gray-600">{cls.Hall_Num ?? "—"}</td>

                  {/* Schedule */}
                  <td className="px-4 py-3.5 text-gray-600 text-xs">
                    {cls.Repeat_On} · {formatTime(cls.Start_Time)} – {formatTime(cls.End_Time)}
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3.5">
                    <StatusBadge status={cls.Status} />
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => navigate(`/dashboard/admin/class-details/${cls.ClassID}`)}
                        className="rounded-lg p-1.5 text-gray-400 hover:bg-indigo-50 hover:text-indigo-600 transition"
                        title="View details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => navigate(`/dashboard/admin/class-details/${cls.ClassID}/edit`)}
                        className="rounded-lg p-1.5 text-gray-400 hover:bg-indigo-50 hover:text-indigo-600 transition"
                        title="Edit class"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => alert(`Delete ${cls.ClassName}`)}
                        className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-500 transition"
                        title="Delete class"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
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
          <span className="text-gray-400">Page {page} of {totalPages}</span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="rounded-lg border border-gray-200 p-1.5 text-gray-400 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            {pageNumbers.map((p, idx) =>
              p === "..." ? (
                <span key={`e-${idx}`} className="px-2 text-gray-300">…</span>
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
              )
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
  );
}