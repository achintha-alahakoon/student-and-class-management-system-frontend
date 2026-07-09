import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../../context/AuthContext";
import { Scanner } from "@yudiel/react-qr-scanner";
import { CheckCircle, XCircle } from "lucide-react";

export default function QRScanner({ classData, onSuccess }) {
  const { token } = useAuth();
  const [students, setStudents] = useState([]);
  const [scannedIds, setScannedIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const authToken = () => token || localStorage.getItem("token");

  // Fetch students for validation
  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `http://localhost:8081/api/classSchedule/available-students/${classData.ClassID}`,
          { headers: { Authorization: `Bearer ${authToken()}` } }
        );
        setStudents(res.data.students || []);
      } catch (err) {
        console.error("Failed to fetch students:", err);
        setError("Failed to load student list");
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, [classData.ClassID, token]);

  const handleScan = (result) => {
    if (result) {
      try {
        const studentId = parseInt(result.getText());
        const student = students.find((s) => s.StudentID === studentId);

        if (student) {
          if (!scannedIds.includes(studentId)) {
            setScannedIds((prev) => [...prev, studentId]);
            setError(null);
          }
        } else {
          setError(`Student ID ${studentId} not in this class`);
          setTimeout(() => setError(null), 3000);
        }
      } catch (err) {
        setError("Invalid QR code");
        setTimeout(() => setError(null), 3000);
      }
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const attendanceList = students.map((student) => ({
        studentId: student.StudentID,
        status: scannedIds.includes(student.StudentID) ? "Present" : "Absent",
        markedBy: "QR_KIOSK",
      }));

      await axios.post(
        "http://localhost:8081/api/attendance/mark",
        {
          classId: classData.ClassID,
          date: new Date().toISOString().split("T")[0],
          attendance: attendanceList,
        },
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

  const getStudentName = (id) => {
    const student = students.find((s) => s.StudentID === id);
    return student ? `${student.FirstName} ${student.LastName}` : `ID: ${id}`;
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
      {/* Instructions */}
      <div className="p-4 bg-indigo-50 rounded-xl">
        <p className="text-sm text-indigo-700">
          📷 Point the camera at student QR codes. Scanned students will be marked{" "}
          <span className="font-medium text-green-600">Present</span>. Non-scanned
          students will be marked <span className="font-medium text-red-600">Absent</span>.
        </p>
        {error && (
          <div className="mt-2 p-2 bg-red-50 text-red-600 rounded text-sm flex items-center gap-2">
            <XCircle className="h-4 w-4" /> {error}
          </div>
        )}
      </div>

      {/* QR Scanner */}
      <div className="bg-white p-4 rounded-xl border border-gray-100">
        <div className="flex justify-center">
          <div className="w-full max-w-md">
            <Scanner
              onDecode={handleScan}
              onError={(err) => console.error("QR Error:", err)}
              containerStyle={{ width: "100%" }}
              constraints={{ facingMode: "environment" }}
            />
          </div>
        </div>
        <p className="text-center text-sm text-gray-500 mt-2">
          Scan student QR codes
        </p>
      </div>

      {/* Scanned students list */}
      <div className="bg-white p-4 rounded-xl border border-gray-100">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-semibold text-gray-900">Scanned Students</h3>
          <span className="text-sm text-gray-500">
            {scannedIds.length} / {students.length}
          </span>
        </div>
        <div className="max-h-48 overflow-y-auto border rounded-lg">
          {scannedIds.length === 0 ? (
            <div className="p-4 text-center text-gray-400 text-sm">
              No students scanned yet
            </div>
          ) : (
            scannedIds.map((id) => (
              <div
                key={id}
                className="flex items-center justify-between p-2 border-b last:border-0"
              >
                <span className="text-gray-700">{getStudentName(id)}</span>
                <span className="flex items-center gap-1 text-green-600 text-sm font-medium">
                  <CheckCircle className="h-4 w-4" /> Present
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Submit button */}
      <div className="flex justify-end">
        <button
          onClick={handleSubmit}
          disabled={submitting || scannedIds.length === 0}
          className="bg-indigo-600 text-white px-6 py-2 rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition font-medium"
        >
          {submitting ? "Saving..." : "Mark Attendance"}
        </button>
      </div>
    </div>
  );
}