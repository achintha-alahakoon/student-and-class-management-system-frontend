import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Plus, Filter, Eye, Edit, Trash2 } from "lucide-react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

export default function Students() {
    const auth = useAuth();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [classFilter, setClassFilter] = useState("");
  const [classes, setClasses] = useState([]);
  const navigate = useNavigate();

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Add authorization header
        const config = {
          headers: { Authorization: `Bearer ${auth.token}` }
        };

        const studentsRes = await axios.get(
          "http://localhost:8081/api/students/studentslist",
          config
        );

        // Transform data...
        const transformedStudents = studentsRes.data.map((s) => ({
          id: s.StudentID,
          studentId: s.StudentID.toString(),
          fullName: `${s.FirstName} ${s.LastName}`.trim(),
          gender: s.Gender,
          grade: s.Grade,
          phone: s.TelNo,
          email: s.Email,
          address: s.Address,
          dateOfBirth: s.Birthday,
          className: "N/A",
          classId: null,
          status: "Active",
          photo: null,
        }));

        setStudents(transformedStudents);

        // Fetch classes with auth header
        try {
          const classesRes = await axios.get(
            "http://localhost:8081/api/classSchedule/scheduledClasses",
            config
          );
          setClasses(classesRes.data);
        } catch (err) {
          console.error("Error fetching classes:", err);
          setClasses([]);
        }
      } catch (err) {
        console.error("Error fetching students:", err);
      } finally {
        setLoading(false);
      }
    };

    if (auth.token) { // Only fetch if token exists
      fetchData();
    }
  }, [auth.token]); 

  // Filter students
  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.studentId.toString().includes(searchQuery);
    const matchesClass = classFilter ? student.classId === classFilter : true;
    return matchesSearch && matchesClass;
  });

  // Status badge
  const StatusBadge = ({ status }) => {
    const statusConfig = {
      Active: "bg-green-100 text-green-700",
      Inactive: "bg-red-100 text-red-700",
      Suspended: "bg-yellow-100 text-yellow-700",
      Graduated: "bg-blue-100 text-blue-700",
    };
    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${statusConfig[status] || "bg-gray-100"}`}
      >
        {status}
      </span>
    );
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Students Management
          </h1>
          <p className="text-sm text-gray-500">Manage all student records</p>
        </div>
        <Link
          to="/dashboard/admin/register-student"
          className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition"
        >
          <Plus className="h-4 w-4" />
          Add Student
        </Link>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-gray-200 bg-white pl-10 pr-4 py-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <select
            value={classFilter}
            onChange={(e) => setClassFilter(e.target.value)}
            className="w-full md:w-48 rounded-lg border border-gray-200 bg-white pl-10 pr-4 py-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none"
          >
            <option value="">All Classes</option>
            {classes.map((cls) => (
              <option key={cls.ClassID} value={cls.ClassID}>
                {cls.ClassName}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                ID
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                Photo
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                Name
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                Grade
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                Address
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                Contact
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="8" className="px-4 py-8 text-center">
                  <div className="animate-spin h-5 w-5 mx-auto border-2 border-indigo-600 border-t-transparent rounded-full" />
                </td>
              </tr>
            ) : filteredStudents.length === 0 ? (
              <tr>
                <td colSpan="8" className="px-4 py-8 text-center text-gray-500">
                  No students found
                </td>
              </tr>
            ) : (
              filteredStudents.map((student) => (
                <tr
                  key={student.id}
                  className="border-t border-gray-100 hover:bg-gray-50 transition cursor-pointer"
                  onClick={() => navigate(`/dashboard/admin/students/${student.id}`)}
                >
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {student.studentId}
                  </td>
                  <td className="px-4 py-3">
                    <img
                      src={student.photo || "/default-student.png"}
                      alt={student.fullName}
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">
                    {student.fullName}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {student.grade}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {student.address}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {student.phone}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={student.status} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/dashboard/admin/students/${student.id}`);
                        }}
                        className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/dashboard/admin/students/${student.id}/edit`);
                        }}
                        className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          // Handle delete
                        }}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
