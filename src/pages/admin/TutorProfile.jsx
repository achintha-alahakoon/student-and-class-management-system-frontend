import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
  ChevronLeft,
  Mail,
  Phone,
  MapPin,
  BookOpen,
  CreditCard,
  Calendar,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-50">
        <Icon className="h-4 w-4 text-gray-400" />
      </div>
      <div>
        <p className="text-xs text-gray-400">{label}</p>
        <p className="text-sm font-medium text-gray-800">{value || "—"}</p>
      </div>
    </div>
  );
}

function StatCard({ label, value, color }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm text-center">
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
      <p className="mt-1 text-xs text-gray-400">{label}</p>
    </div>
  );
}

export default function TutorProfile() {
  const { id } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();

  const [tutor, setTutor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionOpen, setActionOpen] = useState(false); // shared modal for deactivate/activate

  useEffect(() => {
    const fetchTutor = async () => {
      try {
        const authToken = token || localStorage.getItem("token");
        const res = await axios.get(`http://localhost:8081/api/tutors/${id}`, {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        setTutor(res.data?.tutor ?? res.data);
      } catch (err) {
        console.error("Failed to fetch tutor:", err);
        setError("Failed to load tutor profile. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchTutor();
  }, [id, token]);

  // ── Deactivate ────────────────────────────────────────
  const handleDeactivate = async () => {
    try {
      const authToken = token || localStorage.getItem("token");
      await axios.delete(`http://localhost:8081/api/tutors/${id}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setTutor((prev) => ({ ...prev, isActive: false }));
      setActionOpen(false);
    } catch {
      alert("Failed to deactivate tutor.");
    }
  };

  // ── Activate ──────────────────────────────────────────
  const handleActivate = async () => {
    try {
      const authToken = token || localStorage.getItem("token");
      await axios.patch(
        `http://localhost:8081/api/tutors/${id}/activate`,
        {},
        { headers: { Authorization: `Bearer ${authToken}` } },
      );
      setTutor((prev) => ({ ...prev, isActive: true }));
      setActionOpen(false);
    } catch {
      alert("Failed to activate tutor.");
    }
  };

  // ── Loading ───────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex items-center justify-center py-32 text-sm text-gray-400">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent mr-3" />
        Loading profile…
      </div>
    );
  }

  // ── Error ─────────────────────────────────────────────
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-gray-400">
        <p className="text-sm font-medium text-red-500">{error}</p>
        <button
          onClick={() => navigate("/dashboard/admin/tutors")}
          className="mt-3 text-sm text-indigo-600 hover:underline"
        >
          Back to tutors
        </button>
      </div>
    );
  }

  // ── Not found ─────────────────────────────────────────
  if (!tutor) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-gray-400">
        <p className="text-sm font-medium">Tutor not found</p>
        <button
          onClick={() => navigate("/dashboard/admin/tutors")}
          className="mt-3 text-sm text-indigo-600 hover:underline"
        >
          Back to tutors
        </button>
      </div>
    );
  }

  const initials =
    `${tutor.FirstName?.[0] ?? ""}${tutor.LastName?.[0] ?? ""}`.toUpperCase();
  const dob = tutor.Birthday ?? tutor.DOB ?? null;

  return (
    <div className="mx-auto max-w-4xl space-y-5">
      {/* Back + actions */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate("/dashboard/admin/tutors")}
          className="flex items-center gap-1.5 rounded-xl border border-gray-200 px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 transition"
        >
          <ChevronLeft className="h-4 w-4" /> Back
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(`/dashboard/admin/tutors/${id}/edit`)}
            className="flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 transition"
          >
            <Edit2 className="h-4 w-4" /> Edit
          </button>

          {tutor.isActive ? (
            // Active → show Deactivate button
            <button
              onClick={() => setActionOpen(true)}
              className="flex items-center gap-1.5 rounded-xl border border-red-200 bg-red-50 px-3.5 py-2 text-sm font-medium text-red-500 hover:bg-red-100 transition"
            >
              <Trash2 className="h-4 w-4" /> Deactivate
            </button>
          ) : (
            // Inactive → show Activate button
            <button
              onClick={() => setActionOpen(true)}
              className="flex items-center gap-1.5 rounded-xl border border-green-200 bg-green-50 px-3.5 py-2 text-sm font-medium text-green-600 hover:bg-green-100 transition"
            >
              <CheckCircle className="h-4 w-4" /> Activate
            </button>
          )}
        </div>
      </div>

      {/* Profile hero */}
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="flex items-start gap-5">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-indigo-100 text-2xl font-bold text-indigo-600">
            {initials}
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-gray-900">
              {tutor.FirstName} {tutor.LastName}
            </h1>
            <p className="text-sm text-gray-400 mt-0.5">
              {tutor.Subject} Tutor
            </p>
            <div className="mt-2 flex items-center gap-3 flex-wrap">
              <span className="font-mono text-xs text-gray-400 bg-gray-50 rounded-lg px-2 py-1">
                ID: {tutor.TutorID}
              </span>
              {tutor.isActive ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-700">
                  <CheckCircle className="h-3 w-3" /> Active
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-500">
                  <XCircle className="h-3 w-3" /> Inactive
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4">
        <StatCard
          label="Total Classes"
          value={tutor.totalClasses ?? "—"}
          color="text-indigo-600"
        />
        <StatCard
          label="Total Students"
          value={tutor.totalStudents ?? "—"}
          color="text-teal-600"
        />
        <StatCard
          label="Attendance Rate"
          value={tutor.attendanceRate ?? "—"}
          color="text-green-600"
        />
      </div>

      {/* Details grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm space-y-4">
          <h2 className="text-sm font-semibold text-gray-900">
            Personal Details
          </h2>
          <InfoRow icon={CreditCard} label="NIC Number" value={tutor.NICNo} />
          <InfoRow icon={Calendar} label="Date of Birth" value={dob} />
          <InfoRow icon={BookOpen} label="Gender" value={tutor.Gender} />
          <InfoRow icon={BookOpen} label="Subject" value={tutor.Subject} />
        </div>
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm space-y-4">
          <h2 className="text-sm font-semibold text-gray-900">
            Contact Details
          </h2>
          <InfoRow icon={Phone} label="Phone Number" value={tutor.TelNo} />
          <InfoRow icon={Mail} label="Email Address" value={tutor.Email} />
          <InfoRow icon={MapPin} label="Address" value={tutor.Address} />
        </div>
      </div>

      {/* Shared confirm modal — content changes based on isActive */}
      {actionOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl mx-4">
            {tutor.isActive ? (
              <>
                <h3 className="text-base font-semibold text-gray-900 mb-1">
                  Deactivate tutor?
                </h3>
                <p className="text-sm text-gray-500 mb-5">
                  <span className="font-medium">
                    {tutor.FirstName} {tutor.LastName}
                  </span>{" "}
                  will no longer be able to log in. You can reactivate them at
                  any time.
                </p>
                <div className="flex gap-3 justify-end">
                  <button
                    onClick={() => setActionOpen(false)}
                    className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeactivate}
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
                  <span className="font-medium">
                    {tutor.FirstName} {tutor.LastName}
                  </span>{" "}
                  will be able to log in again.
                </p>
                <div className="flex gap-3 justify-end">
                  <button
                    onClick={() => setActionOpen(false)}
                    className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleActivate}
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
