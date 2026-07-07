import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Search,
  Plus,
  Filter,
  ChevronLeft,
  ChevronRight,
  Eye,
  Trash2,
  Download,
  CheckCircle,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

function StatusBadge({ active }) {
  return active ? (
    <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-700">
      <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
      Active
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-500">
      <span className="h-1.5 w-1.5 rounded-full bg-gray-400" />
      Inactive
    </span>
  );
}

function Avatar({ name }) {
  const initials = name
    ? name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "??";
  const colors = [
    "bg-indigo-100 text-indigo-700",
    "bg-purple-100 text-purple-700",
    "bg-teal-100 text-teal-700",
    "bg-pink-100 text-pink-700",
    "bg-amber-100 text-amber-700",
  ];
  const color = colors[initials.charCodeAt(0) % colors.length];
  return (
    <div
      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${color}`}
    >
      {initials}
    </div>
  );
}

const ITEMS_PER_PAGE = 10;

export default function Tutors() {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [subFilter, setSubFilter] = useState("All");
  const [page, setPage] = useState(1);
  const [deleteId, setDeleteId] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTutors = async () => {
      try {
        const authToken = token || localStorage.getItem("token");
        const res = await axios.get(
          "http://localhost:8081/api/tutors/tutorslist",
          {
            headers: { Authorization: `Bearer ${authToken}` },
          },
        );
        setTutors(res.data?.tutors ?? res.data ?? []);
      } catch (err) {
        console.error("Failed to fetch tutors:", err);
        setError("Failed to load tutors. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchTutors();
  }, [token]);

  const subjects = [
    "All",
    ...new Set(tutors.map((t) => t.Subject).filter(Boolean)),
  ];

  const filtered = tutors.filter((t) => {
    const name = `${t.FirstName ?? ""} ${t.LastName ?? ""}`.toLowerCase();
    const matchSearch =
      name.includes(search.toLowerCase()) ||
      (t.TutorID ?? "").toLowerCase().includes(search.toLowerCase());
    const matchSub = subFilter === "All" || t.Subject === subFilter;
    return matchSearch && matchSub;
  });

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE,
  );

  const handleDelete = async (id) => {
    try {
      const authToken = token || localStorage.getItem("token");
      await axios.delete(`http://localhost:8081/api/tutors/${id}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      // Flip isActive locally — tutor stays in list as inactive
      setTutors((prev) =>
        prev.map((t) => (t.TutorID === id ? { ...t, isActive: false } : t)),
      );
    } catch {
      alert("Failed to deactivate tutor.");
    } finally {
      setDeleteId(null);
    }
  };

  const handleExport = () => {
    const headers = [
      "Tutor ID",
      "First Name",
      "Last Name",
      "Subject",
      "NIC",
      "Tel",
      "Status",
    ];
    const rows = filtered.map((t) => [
      t.TutorID,
      t.FirstName,
      t.LastName,
      t.Subject,
      t.NICNo,
      t.TelNo,
      t.isActive ? "Active" : "Inactive",
    ]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "tutors.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleActivate = async (id) => {
    try {
      const authToken = token || localStorage.getItem("token");
      await axios.patch(
        `http://localhost:8081/api/tutors/${id}/activate`,
        {},
        { headers: { Authorization: `Bearer ${authToken}` } },
      );
      setTutors((prev) =>
        prev.map((t) => (t.TutorID === id ? { ...t, isActive: true } : t)),
      );
    } catch {
      alert("Failed to activate tutor.");
    } finally {
      setDeleteId(null); // ← add this
    }
  };

  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1)
    .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
    .reduce((acc, p, idx, arr) => {
      if (idx > 0 && p - arr[idx - 1] > 1) acc.push("...");
      acc.push(p);
      return acc;
    }, []);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Tutors Management
          </h1>
          <p className="text-sm text-gray-500">
            Manage tutors and their details
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 transition"
          >
            <Download className="h-4 w-4" /> Export
          </button>
          <button
            onClick={() => navigate("/dashboard/admin/register-tutor")}
            className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition"
          >
            <Plus className="h-4 w-4" /> Add Tutor
          </button>
        </div>
      </div>

      {/* Search + filter */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or ID…"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full rounded-xl border border-gray-200 bg-white py-2 pl-9 pr-4 text-sm placeholder-gray-400 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-400 shrink-0" />
          <select
            value={subFilter}
            onChange={(e) => {
              setSubFilter(e.target.value);
              setPage(1);
            }}
            className="rounded-xl border border-gray-200 bg-white py-2 pl-3 pr-8 text-sm text-gray-700 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition"
          >
            {subjects.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
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
            Loading tutors…
          </div>
        ) : paginated.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <div className="mb-2 text-4xl">👨‍🏫</div>
            <p className="text-sm font-medium">No tutors found</p>
            <p className="text-xs mt-1">Try adjusting your search or filter</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50 text-xs font-medium text-gray-400">
                <th className="px-5 py-3.5 text-left">Tutor</th>
                <th className="px-4 py-3.5 text-left">ID</th>
                <th className="px-4 py-3.5 text-left">Subject</th>
                <th className="px-4 py-3.5 text-left">NIC</th>
                <th className="px-4 py-3.5 text-left">Tel</th>
                <th className="px-4 py-3.5 text-left">Status</th>
                <th className="px-4 py-3.5 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {paginated.map((tutor) => (
                <tr
                  key={tutor.id}
                  className="group hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() =>
                    navigate(`/dashboard/admin/tutors/${tutor.TutorID}`)
                  }
                >
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <Avatar name={`${tutor.FirstName} ${tutor.LastName}`} />
                      <div>
                        <p className="font-medium text-gray-900">
                          {tutor.FirstName} {tutor.LastName}
                        </p>
                        <p className="text-xs text-gray-400">{tutor.Subject}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 font-mono text-xs text-gray-500">
                    {tutor.TutorID}
                  </td>
                  <td className="px-4 py-3.5 text-gray-600">{tutor.Subject}</td>
                  <td className="px-4 py-3.5 text-gray-600">{tutor.NICNo}</td>
                  <td className="px-4 py-3.5 text-gray-600">{tutor.TelNo}</td>
                  <td className="px-4 py-3.5">
                    <StatusBadge active={tutor.isActive} />
                  </td>
                  <td className="px-4 py-3.5">
                    <div
                      className="flex items-center gap-1"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={() =>
                          navigate(`/dashboard/admin/tutors/${tutor.TutorID}`, {
                            state: { tutor },
                          })
                        }
                        className="rounded-lg p-1.5 text-gray-400 hover:bg-indigo-50 hover:text-indigo-600 transition"
                        title="View profile"
                      >
                        <Eye className="h-4 w-4" />
                      </button>

                      {tutor.isActive ? (
                        // Active tutor — show deactivate button
                        <button
                          onClick={() => setDeleteId(tutor.TutorID)}
                          className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-500 transition"
                          title="Deactivate tutor"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      ) : (
                        // Inactive tutor — show activate button
                        <button
                          onClick={() => setDeleteId(tutor.TutorID)}
                          className="rounded-lg p-1.5 text-gray-400 hover:bg-green-50 hover:text-green-600 transition"
                          title="Activate tutor"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </button>
                      )}
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
            {pageNumbers.map((p, idx) =>
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

      {/* Deactivate / Activate modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl mx-4">
            {tutors.find((t) => t.TutorID === deleteId)?.isActive ? (
              <>
                <h3 className="text-base font-semibold text-gray-900 mb-1">
                  Deactivate tutor?
                </h3>
                <p className="text-sm text-gray-500 mb-5">
                  This tutor will be deactivated and will no longer be able to
                  log in. You can reactivate them at any time.
                </p>
                <div className="flex gap-3 justify-end">
                  <button
                    onClick={() => setDeleteId(null)}
                    className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleDelete(deleteId)}
                    className="rounded-xl bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600 transition"
                  >
                    Deactivate
                  </button>
                </div>
              </>
            ) : (
              <>
                <h3 className="text-base font-semibold text-gray-900 mb-1">
                  Activate tutor?
                </h3>
                <p className="text-sm text-gray-500 mb-5">
                  This tutor will be reactivated and will be able to log in
                  again.
                </p>
                <div className="flex gap-3 justify-end">
                  <button
                    onClick={() => setDeleteId(null)}
                    className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleActivate(deleteId)}
                    className="rounded-xl bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 transition"
                  >
                    Activate
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
