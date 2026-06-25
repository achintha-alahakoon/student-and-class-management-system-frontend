import React from "react";
import { QRCodeSVG } from "qrcode.react";

export default function StudentCard({ student }) {
  return (
    <div className="bg-white p-1 print:p-0">
      {/* Print-only styles */}
      <style jsx>{`
        @media print {
          .no-print {
            display: none;
          }
        }
      `}</style>

      <div className="w-[350px] h-[210px] rounded-xl border-2 border-indigo-200 overflow-hidden relative bg-white">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 3px, rgba(99, 102, 241, 0.1) 3px, rgba(99, 102, 241, 0.1) 6px)"
          }} />
        </div>

        {/* Header */}
        <div className="relative p-3 border-b border-indigo-100 bg-indigo-600 text-white">
          <div className="text-center">
            <h2 className="text-sm font-bold tracking-wider">YOUR INSTITUTE NAME</h2>
            <p className="text-xs text-indigo-200">Student Identification Card</p>
          </div>
        </div>

        <div className="relative p-3 flex gap-3">
          {/* Photo */}
          <div className="h-20 w-20 rounded-lg overflow-hidden border-2 border-indigo-200 bg-gray-100">
            <img
              src={student.photo || "/default-student.png"}
              alt={student.fullName}
              className="h-full w-full object-cover"
            />
          </div>

          {/* Details */}
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-gray-500">Name</p>
                <p className="font-bold text-gray-900 text-sm truncate">{student.fullName}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">ID</p>
                <p className="font-mono font-bold text-gray-900">{student.studentId}</p>
              </div>
            </div>

            <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
              <div>
                <p className="text-gray-500">Grade</p>
                <p className="font-medium text-gray-900">{student.grade}</p>
              </div>
              <div>
                <p className="text-gray-500">Class</p>
                <p className="font-medium text-gray-900">{student.className}</p>
              </div>
              <div>
                <p className="text-gray-500">DOB</p>
                <p className="font-medium text-gray-900">
                  {new Date(student.dateOfBirth).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Gender</p>
                <p className="font-medium text-gray-900">{student.gender}</p>
              </div>
            </div>
          </div>

          {/* QR Code */}
          <div className="absolute bottom-3 right-3 h-16 w-16 bg-white p-0.5 rounded border border-indigo-200">
            <QRCodeSVG value={`https://your-institute.com/students/${student.id}`} size={64} level="H" includeMargin={false} />
          </div>
        </div>

        {/* Footer */}
        <div className="relative p-2 bg-indigo-600 text-white text-[10px] text-center">
          <p>Valid until: {new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
}