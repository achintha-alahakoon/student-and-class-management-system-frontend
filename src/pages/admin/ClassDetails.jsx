import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  BookOpen,
  User,
  Hash,
  Building,
  Users,
  Edit,
  Trash2,
  Plus,
  X,
  CheckCircle,
  Clock,
  Eye,
} from "lucide-react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

export default function ClassDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();

  const [classData, setClassData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [studentToRemove, setStudentToRemove] = useState(null);
  const [availableStudents, setAvailableStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const authToken = () => token || localStorage.getItem("token");

  // ── Fetch class details ─────────────────────────────────
  useEffect(() => {
    const fetchClass = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await axios.get(
          `http://localhost:8081/api/classSchedule/scheduledClasses/${id}`,
          { headers: { Authorization: `Bearer ${authToken()}` } },
        );

        const responseData = res.data;
        const flattenedData = {
          ...responseData.class,
          ...responseData,
          tutor: responseData.class?.tutor,
        };
        setClassData(flattenedData);
      } catch (err) {
        console.error("Error fetching class:", err);
        setError("Failed to load class details. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchClass();
  }, [id, token]);

  // ── Fetch available students when modal opens ───────────
  useEffect(() => {
    if (!showAddStudent) return;
    const fetchStudents = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8081/api/classes/${id}/available-students`,
          { headers: { Authorization: `Bearer ${authToken()}` } },
        );
        setAvailableStudents(res.data?.students ?? res.data ?? []);
      } catch (err) {
        console.error("Error fetching available students:", err);
        setAvailableStudents([]);
      }
    };
    fetchStudents();
  }, [showAddStudent, id, token]);

  // ── Add students ────────────────────────────────────────
  const handleSaveStudents = async () => {
    try {
      await axios.post(
        `http://localhost:8081/api/classes/${id}/students`,
        { studentIds: selectedStudents },
        {
          headers: {
            Authorization: `Bearer ${authToken()}`,
            "Content-Type": "application/json",
          },
        },
      );
      const added = availableStudents.filter((s) =>
        selectedStudents.includes(s.id ?? s.StudentID),
      );
      setClassData((prev) => ({
        ...prev,
        students: [...(prev.students ?? []), ...added],
      }));
      setShowAddStudent(false);
      setSelectedStudents([]);
    } catch (err) {
      console.error("Error adding students:", err);
      alert("Failed to add students. Please try again.");
    }
  };

  // ── Remove student ──────────────────────────────────────
  const confirmRemoveStudent = async () => {
    try {
      await axios.delete(
        `http://localhost:8081/api/classes/${id}/students/${studentToRemove.id ?? studentToRemove.StudentID}`,
        { headers: { Authorization: `Bearer ${authToken()}` } },
      );
      setClassData((prev) => ({
        ...prev,
        students: prev.students.filter(
          (s) =>
            (s.id ?? s.StudentID) !==
            (studentToRemove.id ?? studentToRemove.StudentID),
        ),
      }));
      setShowRemoveModal(false);
      setStudentToRemove(null);
    } catch (err) {
      console.error("Error removing student:", err);
      alert("Failed to remove student. Please try again.");
    }
  };

  // ── Delete class ────────────────────────────────────────
  const handleDeleteClass = async () => {
    try {
      await axios.delete(`http://localhost:8081/api/classes/${id}`, {
        headers: { Authorization: `Bearer ${authToken()}` },
      });
      navigate("/dashboard/admin/class-management");
    } catch (err) {
      console.error("Error deleting class:", err);
      alert("Failed to delete class.");
    }
  };

  const handleStudentSelect = (studentId) => {
    setSelectedStudents((prev) =>
      prev.includes(studentId)
        ? prev.filter((sid) => sid !== studentId)
        : [...prev, studentId],
    );
  };

  const formatTime = (t) => {
    if (!t) return "—";
    const [h, m] = t.split(":").map(Number);
    const ampm = h >= 12 ? "PM" : "AM";
    const hour = h % 12 || 12;
    return `${hour}:${String(m).padStart(2, "0")} ${ampm}`;
  };

  // ── Loading ─────────────────────────────────────────────
  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center h-96">
        <div className="animate-spin h-8 w-8 border-4 border-indigo-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  // ── Error ───────────────────────────────────────────────
  if (error) {
    return (
      <div className="p-6 flex flex-col items-center justify-center h-96 text-gray-400">
        <p className="text-sm font-medium text-red-500">{error}</p>
        <button
          onClick={() => navigate("/dashboard/admin/class-management")}
          className="mt-3 text-sm text-indigo-600 hover:underline"
        >
          Back to classes
        </button>
      </div>
    );
  }

  // ── Not found ───────────────────────────────────────────
  if (!classData) {
    return (
      <div className="p-6 flex flex-col items-center justify-center h-96 text-gray-400">
        <p className="text-sm font-medium">Class not found</p>
        <button
          onClick={() => navigate("/dashboard/admin/class-management")}
          className="mt-3 text-sm text-indigo-600 hover:underline"
        >
          Back to classes
        </button>
      </div>
    );
  }

  const students = classData.students ?? [];
  const tutor = classData.tutor ?? null;
  const className = classData.ClassName ?? classData.name ?? "—";
  const grade = classData.Grade ?? classData.grade ?? "—";
  const subject = classData.Subject ?? classData.subject ?? "—";
  const hallNum = classData.Hall_Num ?? classData.roomNumber ?? "—";
  const isActive = classData.Status ?? classData.isActive ?? true;
  const desc = classData.Description ?? classData.description ?? null;

  const schedule = classData.Repeat_On
    ? `${classData.Repeat_On} · ${formatTime(classData.Start_Time)} – ${formatTime(classData.End_Time)}`
    : (classData.schedule ?? "—");

  const tutorName =
    tutor?.name ??
    (tutor
      ? `${tutor.FirstName ?? ""} ${tutor.LastName ?? ""}`.trim()
      : null) ??
    classData.Tutor ??
    "Unassigned";

  const tutorInitials = tutorName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const attendancePercentage = classData.attendanceSummary
    ? Math.round(
        (classData.attendanceSummary.present /
          (classData.attendanceSummary.present +
            classData.attendanceSummary.absent || 1)) *
          100,
      )
    : 0;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/dashboard/admin/class-management")}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-indigo-600 transition"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Classes
        </button>
        <div className="flex-1" />
        <div className="flex gap-3">
          <button
            onClick={() =>
              navigate(`/dashboard/admin/class-details/${id}/edit`)
            }
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition"
          >
            <Edit className="h-4 w-4" /> Edit Class
          </button>
          <button
            onClick={() => setDeleteOpen(true)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition"
          >
            <Trash2 className="h-4 w-4" /> Delete Class
          </button>
        </div>
      </div>

      {/* Class Header */}
      <div className="rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="h-20 w-20 rounded-xl bg-white/20 flex items-center justify-center">
            <BookOpen className="h-10 w-10 text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <h1 className="text-3xl font-bold">{className}</h1>
              <span className="px-3 py-1 rounded-full bg-white/20 text-white text-sm font-medium">
                ID: #{classData.ClassID ?? classData.id}
              </span>
            </div>
            <div className="flex flex-wrap gap-3 text-sm text-indigo-100">
              <span className="flex items-center gap-1.5">
                <Hash className="h-3.5 w-3.5" /> Grade {grade}
              </span>
              <span className="flex items-center gap-1.5">
                <User className="h-3.5 w-3.5" /> {subject}
              </span>
              <span className="flex items-center gap-1.5">
                <Building className="h-3.5 w-3.5" /> Hall {hallNum}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" /> {schedule}
              </span>
            </div>
            <div className="mt-3">
              <span
                className={`px-3 py-1 rounded-full text-sm ${isActive ? "bg-green-500/20" : "bg-red-500/20"}`}
              >
                {isActive ? "Active" : "Inactive"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Details grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Class info */}
        <div className="lg:col-span-2 rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Class Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-500 mb-0.5">Subject</p>
                <p className="font-medium text-gray-900">{subject}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-0.5">Grade</p>
                <p className="font-medium text-gray-900">Grade {grade}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-0.5">Hall / Room</p>
                <p className="font-medium text-gray-900">{hallNum}</p>
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-500 mb-0.5">Current Students</p>
                <p className="font-medium text-gray-900">{students.length}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-0.5">Status</p>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    isActive
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {isActive ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-500 mb-1">Schedule</p>
            <p className="font-medium text-gray-900">{schedule}</p>
          </div>
          {desc && (
            <div className="mt-4">
              <p className="text-xs text-gray-500 mb-1">Description</p>
              <p className="text-sm text-gray-600">{desc}</p>
            </div>
          )}
        </div>

        {/* Tutor card */}
        <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Assigned Tutor
          </h2>
          {tutorName !== "Unassigned" ? (
            <>
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-full bg-indigo-100 flex items-center justify-center">
                  <span className="text-indigo-700 font-semibold">
                    {tutorInitials}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">{tutorName}</p>
                  {(tutor?.Email ?? tutor?.email) && (
                    <p className="text-sm text-gray-500">
                      {tutor.Email ?? tutor.email}
                    </p>
                  )}
                  {(tutor?.TelNo ?? tutor?.phone) && (
                    <p className="text-sm text-gray-500">
                      {tutor.TelNo ?? tutor.phone}
                    </p>
                  )}
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <Link
                  to={`/dashboard/admin/tutors/${classData.TutorID ?? tutor?.TutorID ?? tutor?.id}`}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition"
                >
                  View Profile
                </Link>
                <button
                  onClick={() =>
                    navigate(`/dashboard/admin/class-details/${id}/edit`)
                  }
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition"
                >
                  Change Tutor
                </button>
              </div>
            </>
          ) : (
            <div className="text-center py-6">
              <p className="text-sm text-gray-400 mb-3">No tutor assigned</p>
              <button
                onClick={() =>
                  navigate(`/dashboard/admin/class-details/${id}/edit`)
                }
                className="text-sm font-medium text-indigo-600 hover:underline"
              >
                Assign a tutor
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Attendance summary */}
      {classData.attendanceSummary && (
        <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Attendance Summary
          </h2>
          <div className="flex gap-4 mb-6">
            <div className="flex-1 text-center">
              <div className="h-16 w-16 rounded-xl bg-green-100 flex items-center justify-center mx-auto mb-2">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <p className="text-sm text-gray-500">Present</p>
              <p className="font-semibold text-gray-900">
                {classData.attendanceSummary.present || 0}%
              </p>
            </div>
            <div className="flex-1 text-center">
              <div className="h-16 w-16 rounded-xl bg-red-100 flex items-center justify-center mx-auto mb-2">
                <X className="h-8 w-8 text-red-600" />
              </div>
              <p className="text-sm text-gray-500">Absent</p>
              <p className="font-semibold text-gray-900">
                {classData.attendanceSummary.absent || 0}%
              </p>
            </div>
          </div>
          <div className="h-1.5 rounded-full bg-gray-200 overflow-hidden">
            <div
              className="h-full bg-green-500 rounded-full"
              style={{ width: `${attendancePercentage}%` }}
            />
          </div>
        </div>
      )}

      {/* Enrolled students */}
      <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Enrolled Students ({students.length})
          </h2>
          <button
            onClick={() => {
              setSelectedStudents([]);
              setShowAddStudent(true);
            }}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition"
          >
            <Plus className="h-4 w-4" /> Add Students
          </button>
        </div>

        {students.length === 0 ? (
          <div className="text-center py-10 text-gray-400">
            <p className="text-sm font-medium">No students enrolled yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                    ID
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                    Student
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {students.map((student) => {
                  const sid = student.id ?? student.StudentID;
                  const sname =
                    student.name ??
                    `${student.FirstName ?? ""} ${student.LastName ?? ""}`.trim();
                  const sActive =
                    student.status === "Active" || student.isActive;
                  return (
                    <tr key={sid} className="hover:bg-gray-50 transition">
                      <td className="px-4 py-3 text-gray-600 font-mono text-xs">
                        {student.studentId ?? student.StudentID}
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-900">{sname}</p>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            sActive
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          {sActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() =>
                              navigate(`/dashboard/admin/students/${sid}`)
                            }
                            className="p-1.5 text-gray-400 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition"
                            title="View student"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => {
                              setStudentToRemove(student);
                              setShowRemoveModal(true);
                            }}
                            className="p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-500 rounded-lg transition"
                            title="Remove from class"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Students Modal */}
      {showAddStudent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Add Students to {className}
              </h3>
              <button
                onClick={() => setShowAddStudent(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-2 max-h-60 overflow-y-auto mb-4">
              {availableStudents.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-6">
                  No available students to add
                </p>
              ) : (
                availableStudents.map((s) => {
                  const sid = s.id ?? s.StudentID;
                  const sname =
                    s.name ?? `${s.FirstName ?? ""} ${s.LastName ?? ""}`.trim();
                  return (
                    <label
                      key={sid}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedStudents.includes(sid)}
                        onChange={() => handleStudentSelect(sid)}
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <div>
                        <p className="font-medium text-gray-900">{sname}</p>
                        <p className="text-xs text-gray-500">
                          {s.studentId ?? s.StudentID}
                        </p>
                      </div>
                    </label>
                  );
                })
              )}
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowAddStudent(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveStudents}
                disabled={selectedStudents.length === 0}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition"
              >
                <CheckCircle className="h-4 w-4" />
                Add {selectedStudents.length} Students
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Remove Student Modal */}
      {showRemoveModal && studentToRemove && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Remove Student
            </h3>
            <p className="text-sm text-gray-500 mb-5">
              Are you sure you want to remove{" "}
              {studentToRemove.name ??
                `${studentToRemove.FirstName ?? ""} ${studentToRemove.LastName ?? ""}`}{" "}
              from this class?
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowRemoveModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmRemoveStudent}
                className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Class Modal */}
      {deleteOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Delete Class
            </h3>
            <p className="text-sm text-gray-500 mb-5">
              This will permanently delete{" "}
              <span className="font-medium">{className}</span> and remove all
              enrolled students from it. This cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteClass}
                className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
