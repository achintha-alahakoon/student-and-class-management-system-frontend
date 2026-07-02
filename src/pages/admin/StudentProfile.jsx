import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Printer,
  ArrowLeft,
  Calendar,
  User,
  Mail,
  Phone,
  Home,
  IdCard,
  Clock,
  DollarSign,
  BarChart3,
  Edit,
  BookOpen,
} from "lucide-react";
import axios from "axios";
import StudentCard from "./StudentCard";
import { useAuth } from "../../context/AuthContext";

export default function StudentProfile() {
  const { id } = useParams();
  const auth = useAuth();
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCard, setShowCard] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const config = {
          headers: { Authorization: `Bearer ${auth.token}` },
        };

        const res = await axios.get(
          `http://localhost:8081/api/students/${id}`,
          config,
        );

        // API returns { success: true, data: { student, enrolledClasses, payments, attendance } }
        setStudentData(res.data?.data || null);
      } catch (err) {
        console.error("Error fetching student:", err);
      } finally {
        setLoading(false);
      }
    };

    if (auth?.token) {
      fetchData();
    }
  }, [id, auth?.token]);

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center h-96">
        <div className="animate-spin h-8 w-8 border-4 border-indigo-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!studentData) {
    return (
      <div className="p-6 text-center text-gray-500">Student not found</div>
    );
  }

  // Extract data from API response
  const student = studentData.student;
  const enrolledClasses = studentData.enrolledClasses || [];
  const payments = studentData.payments || [];
  const attendance = studentData.attendance || [];

  // Calculate attendance percentage
  const totalDays = attendance.length;
  const presentDays = attendance.filter((a) => a.Status === "Present").length;
  const attendancePercentage =
    totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0;

  // Get first class name for display
  const className =
    enrolledClasses.length > 0
      ? `${enrolledClasses[0].ClassName || `\${enrolledClasses[0].Grade} - \${enrolledClasses[0].Subject}`}`
      : "Not enrolled";

  // Fee status color
  const getFeeStatusColor = (status) => {
    switch (status) {
      case "Paid":
        return "bg-green-100 text-green-700";
      case "Partial":
        return "bg-yellow-100 text-yellow-700";
      case "Overdue":
        return "bg-red-100 text-red-700";
      case "Pending":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // Transform student data for consistency
  const transformedStudent = {
    id: student.StudentID,
    studentId: student.StudentID.toString(),
    fullName: `${student.FirstName || ""} ${student.LastName || ""}`.trim(),
    firstName: student.FirstName || "",
    lastName: student.LastName || "",
    gender: student.Gender || "Not specified",
    grade: student.Grade || "N/A",
    phone: student.TelNo || "N/A",
    email: student.Email || "N/A",
    address: student.Address || "N/A",
    dateOfBirth: student.Birthday || null,
    className: className,
    status: "Active",
    photo: null,
    nicPassport: student.NICNo || "",
    parentName: "",
    parentPhone: "",
    parentEmail: "",
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/dashboard/admin/students")}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-indigo-600 transition"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Students
        </button>
        <div className="flex-1" />
        <div className="flex gap-3">
          <button
            onClick={() => setShowCard(true)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition"
          >
            <Printer className="h-4 w-4" />
            Print Card
          </button>
          <Link
            to={`/students/${id}/edit`}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition"
          >
            <Edit className="h-4 w-4" />
            Edit Profile
          </Link>
        </div>
      </div>

      {/* Profile Header */}
      <div className="rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="relative">
            <img
              src={transformedStudent.photo || "/default-student.png"}
              alt={transformedStudent.fullName}
              className="h-32 w-32 rounded-full object-cover border-4 border-white"
            />
            <div className="absolute -bottom-2 -right-2 h-10 w-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border-2 border-white">
              <span className="text-xl font-bold">
                {transformedStudent.grade?.slice(0, 1)}
              </span>
            </div>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold">
                {transformedStudent.fullName}
              </h1>
              <span className="px-3 py-1 rounded-full bg-white/20 text-white text-sm font-medium">
                {transformedStudent.studentId}
              </span>
            </div>
            <div className="flex flex-wrap gap-3 text-sm text-indigo-100">
              <span className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                {transformedStudent.dateOfBirth
                  ? new Date(
                      transformedStudent.dateOfBirth,
                    ).toLocaleDateString()
                  : "N/A"}
              </span>
              <span className="flex items-center gap-1.5">
                <User className="h-3.5 w-3.5" />
                {transformedStudent.gender}
              </span>
              {transformedStudent.nicPassport && (
                <span className="flex items-center gap-1.5">
                  <IdCard className="h-3.5 w-3.5" />
                  {transformedStudent.nicPassport}
                </span>
              )}
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="px-3 py-1 rounded-full bg-white/20 text-white text-sm">
                {transformedStudent.grade}
              </span>
              <span
                className={`px-3 py-1 rounded-full text-sm \${
                  transformedStudent.status === "Active" ? "bg-green-500/20" : "bg-red-500/20"
                }`}
              >
                {transformedStudent.status}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Contact Info */}
        <div className="lg:col-span-1 rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Contact Information
          </h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium text-gray-900">
                  {transformedStudent.email || "Not provided"}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Phone className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-medium text-gray-900">
                  {transformedStudent.phone}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Home className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Address</p>
                <p className="font-medium text-gray-900">
                  {transformedStudent.address || "Not provided"}
                </p>
              </div>
            </div>
          </div>

          <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-4">
            Parent / Guardian
          </h3>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <User className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="font-medium text-gray-900">
                  {transformedStudent.parentName || "Not provided"}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Phone className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-medium text-gray-900">
                  {transformedStudent.parentPhone || "Not provided"}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium text-gray-900">
                  {transformedStudent.parentEmail || "Not provided"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Attendance Summary */}
        <div className="lg:col-span-1 rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Attendance Summary
            </h2>
            <span className="text-2xl font-bold text-indigo-600">
              {attendancePercentage}%
            </span>
          </div>
          <div className="flex gap-4 mb-6">
            <div className="flex-1 text-center">
              <div className="h-16 w-16 rounded-xl bg-green-100 flex items-center justify-center mx-auto mb-2">
                <div className="h-8 w-8 rounded-full bg-green-500" />
              </div>
              <p className="text-sm text-gray-500">Present</p>
              <p className="font-semibold text-gray-900">{presentDays} days</p>
            </div>
            <div className="flex-1 text-center">
              <div className="h-16 w-16 rounded-xl bg-red-100 flex items-center justify-center mx-auto mb-2">
                <div className="h-8 w-8 rounded-full bg-red-500" />
              </div>
              <p className="text-sm text-gray-500">Absent</p>
              <p className="font-semibold text-gray-900">
                {totalDays - presentDays} days
              </p>
            </div>
            <div className="flex-1 text-center">
              <div className="h-16 w-16 rounded-xl bg-blue-100 flex items-center justify-center mx-auto mb-2">
                <div className="h-8 w-8 rounded-full bg-blue-500" />
              </div>
              <p className="text-sm text-gray-500">Total</p>
              <p className="font-semibold text-gray-900">{totalDays} days</p>
            </div>
          </div>
          <div className="h-1.5 rounded-full bg-gray-200 overflow-hidden">
            <div
              className="h-full bg-green-500 rounded-full"
              style={{ width: `${attendancePercentage}%` }}
            />
          </div>
        </div>

        {/* Fee Status */}
        <div className="lg:col-span-1 rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Fee Status
          </h2>
          {payments.length > 0 ? (
            <div className="space-y-3">
              {payments.map((fee) => (
                <div
                  key={fee.PaymentID}
                  className={`flex items-center justify-between p-3 rounded-xl ${getFeeStatusColor(fee.Status)}`}
                >
                  <div>
                    <p className="font-medium text-gray-900">
                      {fee.Month ||
                        new Date(fee.PaymentDate).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-gray-600">
                      {fee.PaymentDate
                        ? new Date(fee.PaymentDate).toLocaleDateString()
                        : "N/A"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      LKR {fee.Amount?.toFixed(2)}
                    </p>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${getFeeStatusColor(fee.Status)}`}
                    >
                      {fee.Status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400 text-center py-4">
              No payment records found
            </p>
          )}
          {payments.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
              <p className="text-sm text-gray-500">Total Due</p>
              <p className="text-xl font-bold text-gray-900">
                LKR{" "}
                {payments
                  .filter((fee) => fee.Status !== "Paid")
                  .reduce((sum, fee) => sum + (parseFloat(fee.Amount) || 0), 0)
                  .toFixed(2)}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Enrolled Classes Section - Add after Profile Details grid */}
      {enrolledClasses.length > 0 && (
        <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Enrolled Classes ({enrolledClasses.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {enrolledClasses.map((cls) => (
              <div
                key={cls.enrolledclassID}
                className="p-4 rounded-xl border border-gray-100 hover:border-indigo-200 transition group"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-indigo-100 flex items-center justify-center group-hover:bg-indigo-50 transition">
                    <BookOpen className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {cls.ClassName}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Grade {cls.Grade} · {cls.Subject}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Attendance Table (only show if data exists) */}
      {attendance.length > 0 && (
        <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Recent Attendance
            </h2>
            <Link
              to={`/students/${id}/attendance`}
              className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
            >
              View All
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                    Day
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                    Class
                  </th>
                </tr>
              </thead>
              <tbody>
                {attendance.slice(0, 5).map((record) => {
                  const classInfo = enrolledClasses.find(
                    (ec) => ec.ClassID === record.ClassID,
                  );
                  return (
                    <tr
                      key={record.AttendanceID}
                      className="border-t border-gray-100"
                    >
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {record.AttendanceDate
                          ? new Date(record.AttendanceDate).toLocaleDateString()
                          : "N/A"}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {record.AttendanceDate
                          ? new Date(record.AttendanceDate).toLocaleDateString(
                              "en-US",
                              {
                                weekday: "short",
                              },
                            )
                          : "N/A"}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium \${
                            record.Status === "Present"
                              ? "bg-green-100 text-green-700"
                              : record.Status === "Absent"
                                ? "bg-red-100 text-red-700"
                                : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {record.Status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {classInfo?.ClassName || "N/A"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Print Card Modal */}
      {showCard && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full relative">
            <button
              onClick={() => setShowCard(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              X
            </button>
            <StudentCard student={transformedStudent} />
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setShowCard(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
              >
                <Printer className="h-4 w-4" />
                Print
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
