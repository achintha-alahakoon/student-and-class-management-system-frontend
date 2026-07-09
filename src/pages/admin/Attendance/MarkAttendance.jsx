import { useState } from "react";
import ManualMarking from "./ManualMarking";
import QRScanner from "./QRScanner";

export default function MarkAttendance({ classes, onBack }) {
  const [selectedClass, setSelectedClass] = useState(null);
  const [mode, setMode] = useState("manual"); // 'manual' or 'qr'

  // Step 1: Class selection
  if (!selectedClass) {
    return (
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Select Class to Mark Attendance
          </h2>
          <button
            onClick={onBack}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            ← Back
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {classes.map((cls) => (
            <button
              key={cls.ClassID}
              onClick={() => setSelectedClass(cls)}
              className="text-left p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition"
            >
              <div className="font-medium text-gray-900">{cls.ClassName}</div>
              <div className="text-xs text-gray-500 mt-1">
                {cls.Subject} • {cls.Tutor}
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Step 2: Marking interface
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900">
          Mark Attendance: <span className="text-indigo-600">{selectedClass.ClassName}</span>
        </h2>
        <button
          onClick={() => setSelectedClass(null)}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          Change Class
        </button>
      </div>

      {/* Mode selector */}
      <div className="flex gap-2 mb-6 p-1 bg-gray-100 rounded-xl">
        <button
          onClick={() => setMode("manual")}
          className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition ${
            mode === "manual"
              ? "bg-white text-indigo-600 shadow"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Manual Entry
        </button>
        <button
          onClick={() => setMode("qr")}
          className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition ${
            mode === "qr"
              ? "bg-white text-indigo-600 shadow"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          QR Scanner
        </button>
      </div>

      {/* Render selected mode */}
      {mode === "manual" ? (
        <ManualMarking
          classData={selectedClass}
          onSuccess={() => setSelectedClass(null)}
        />
      ) : (
        <QRScanner
          classData={selectedClass}
          onSuccess={() => setSelectedClass(null)}
        />
      )}
    </div>
  );
}