import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../../context/AuthContext";
import { CheckCircle, XCircle, Clock, AlertCircle } from "lucide-react";

const statusIcons = {
  Present: <CheckCircle className="h-4 w-4 text-green-500" />,
  Absent: <XCircle className="h-4 w-4 text-red-500" />,
  Late: <Clock className="h-4 w-4 text-amber-500" />,
  Excused: <AlertCircle className="h-4 w-4 text-blue-500" />,
};

export default function ManualMarking({ classData, date, onSuccess }) {
  const { token } = useAuth();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [existingAttendance, setExistingAttendance] = useState({});
  const authToken = () => token || localStorage.getItem("token");

  // Fetch students AND existing attendance for the selected date
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [studentsRes, attendanceRes] = await Promise.all([
          axios.get(
            `http://localhost:8081/api/attendance/getAvailableStudents/${classData.ClassID}`,
            { headers: { Authorization: `Bearer ${authToken()}` } }
          ),
          axios.get(
            `http://localhost:8081/api/attendance/getAttendanceByClass/${classData.ClassID}`,
            { params: { date }, headers: { Authorization: `Bearer ${authToken()}` } }
          ),
        ]);

        const studentsData = studentsRes.data.students || [];
        const attendanceData = attendanceRes.data?.records || [];

        const attendanceMap = {};
        attendanceData.forEach((record) => {
          attendanceMap[record.StudentID] = record.Status;
        });

        setStudents(studentsData);
        setExistingAttendance(attendanceMap);
      } catch (err) {
        console.error("Failed to fetch data:", err);
        alert("Failed to load data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [classData.ClassID, date, token]);

  // Initialize with existing attendance (default: Present)
  const [attendance, setAttendance] = useState({});
  useEffect(() => {
    if (students.length > 0) {
      const initial = students.reduce((acc, s) => {
        acc[s.StudentID] = existingAttendance[s.StudentID] || "Present";
        return acc;
      }, {});
      setAttendance(initial);
    }
  }, [students, existingAttendance]);

  const handleStatusChange = (studentId, status) => {
    setAttendance((prev) => ({ ...prev, [studentId]: status }));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const attendanceList = Object.entries(attendance).map(
        ([studentId, status]) => ({
          studentId: parseInt(studentId),
          status,
          markedBy: "Admin",
        })
      );

      await axios.post(
        "http://localhost:8081/api/attendance/markAttendance",
        { classId: classData.ClassID, date, attendance: attendanceList },
        { headers: { Authorization: `Bearer ${authToken()}` } }
      );

      alert("Attendance marked successfully!");
      onSuccess();
    } catch (err) {
      console.error("Failed to mark attendance:", err);
      alert("Failed to mark attendance");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent mr-3" />
        <span className="text-gray-600">Loading students...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="p-4 bg-indigo-50 rounded-xl">
        <p className="text-sm text-indigo-700">
          📝 Click to change status. Existing attendance for{" "}
          <strong>{new Date(date).toLocaleDateString()}</strong> is pre-loaded.
        </p>
      </div>

      <div className="overflow-x-auto bg-white rounded-xl border border-gray-100">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left">Student</th>
              <th className="px-4 py-3 text-left">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {students.map((student) => (
              <tr key={student.StudentID} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div className="font-medium text-gray-900">
                    {student.FirstName} {student.LastName}
                  </div>
                  <div className="text-xs text-gray-400">ID: {student.StudentID}</div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    {["Present", "Absent", "Late", "Excused"].map((status) => (
                      <button
                        key={status}
                        onClick={() => handleStatusChange(student.StudentID, status)}
                        className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition ${
                          attendance[student.StudentID] === status
                            ? status === "Present"
                              ? "bg-green-100 text-green-700 border border-green-200"
                              : status === "Absent"
                              ? "bg-red-100 text-red-700 border border-red-200"
                              : status === "Late"
                              ? "bg-amber-100 text-amber-700 border border-amber-200"
                              : "bg-blue-100 text-blue-700 border border-blue-200"
                            : "border border-gray-200 bg-white text-gray-500 hover:bg-gray-50"
                        }`}
                      >
                        {statusIcons[status]} {status}
                      </button>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="bg-indigo-600 text-white px-6 py-2 rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition font-medium"
        >
          {submitting ? "Saving..." : "Mark Attendance"}
        </button>
      </div>
    </div>
  );
}