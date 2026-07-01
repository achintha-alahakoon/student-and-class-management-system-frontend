import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  User,
  Hash,
  Building,
  Clock,
  DollarSign,
  Type,
  ArrowLeft,
  CheckCircle,
  XCircle,
} from "lucide-react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

export default function CreateClass() {
  const navigate = useNavigate();
  const { token } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    grade: "",
    subject: "",
    tutorId: "",
    roomNumber: "",
    days: [],
    startTime: "",
    endTime: "",
    classFee: 0,
    status: "Active",
    description: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [tutors, setTutors] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [grades, setGrades] = useState([]);
  const [showNotification, setShowNotification] = useState(false);
const [notification, setNotification] = useState({ type: '', message: '' });

  // Days of week
  const daysOfWeek = [
    { id: "Monday", label: "Mon" },
    { id: "Tuesday", label: "Tue" },
    { id: "Wednesday", label: "Wed" },
    { id: "Thursday", label: "Thu" },
    { id: "Friday", label: "Fri" },
    { id: "Saturday", label: "Sat" },
    { id: "Sunday", label: "Sun" },
  ];

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const authToken = token || localStorage.getItem("token");
        const config = { headers: { Authorization: `Bearer ${authToken}` } };

        // Fetch grades, subjects, and tutors in parallel
        const [subjectsRes, tutorsRes] = await Promise.all([
          axios.get("http://localhost:8081/api/subjects/subjectslist", config),
          axios.get("http://localhost:8081/api/tutors/tutorslist", config),
        ]);

        // Transform tutor data from API response
        const transformedTutors =
          tutorsRes.data?.tutors?.map((t) => ({
            id: t.TutorID,
            name: `${t.FirstName} ${t.LastName}`,
            subject: t.Subject,
            isActive: t.isActive,
          })) || [];

        const mockGrades = [
          "05",
          "04",
          "06",
          "07",
          "08",
          "09",
          "10",
          "11",
        ];

        setGrades(mockGrades);
        setSubjects(subjectsRes.data.map(s => s.Subject) || []);
        setTutors(transformedTutors);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    if (token) {
      fetchData();
    }
  }, [token]);

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Class name is required";
    if (!formData.grade) newErrors.grade = "Grade is required";
    if (!formData.subject) newErrors.subject = "Subject is required";
    if (!formData.tutorId) newErrors.tutorId = "Tutor is required";
    if (!formData.roomNumber.trim())
      newErrors.roomNumber = "Room number is required";
    if (formData.days.length === 0)
      newErrors.days = "At least one day is required";
    if (!formData.startTime) newErrors.startTime = "Start time is required";
    if (!formData.endTime) newErrors.endTime = "End time is required";
    if (formData.classFee < 0) newErrors.classFee = "Fee cannot be negative";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      setFormData({
        ...formData,
        [name]: checked
          ? [...formData[name], value]
          : formData[name].filter((item) => item !== value),
      });
    } else {
      setFormData({
        ...formData,
        [name]: type === "number" ? parseFloat(value) || 0 : value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setLoading(true);
      const authToken = token || localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      };

      // Transform schedule data for backend
      const payload = {
        name: formData.name,
        grade: formData.grade,
        subject: formData.subject,
        tutorId: formData.tutorId,
        roomNumber: formData.roomNumber,
        schedule: {
          days: formData.days,
          startTime: formData.startTime,
          endTime: formData.endTime,
        },
        classFee: formData.classFee,
        status: formData.status,
        description: formData.description,
      };

      await axios.post("http://localhost:8081/api/classSchedule/add-class", payload, config);

      navigate("/dashboard/admin/class-management");
    } catch (err) {
      console.error("Error creating class:", err);
      alert("Failed to create class. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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
      </div>

      {/* Form */}
      <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Create New Class</h1>
          <p className="text-sm text-gray-500 mt-1">
            Fill in the details to create a new class
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Class Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Class Name *
            </label>
            <div className="relative">
              <BookOpen className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., Grade 6 - Mathematics"
                className={`w-full rounded-lg border ${
                  errors.name ? "border-red-500" : "border-gray-200"
                } bg-white pl-10 pr-4 py-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none`}
              />
              {errors.name && (
                <p className="mt-1 text-xs text-red-500">{errors.name}</p>
              )}
            </div>
          </div>

          {/* Grade and Subject */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Grade *
              </label>
              <div className="relative">
                <Hash className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <select
                  name="grade"
                  value={formData.grade}
                  onChange={handleChange}
                  className={`w-full rounded-lg border ${
                    errors.grade ? "border-red-500" : "border-gray-200"
                  } bg-white pl-10 pr-4 py-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none`}
                >
                  <option value="">Select Grade</option>
                  {grades.map((grade) => (
                    <option key={grade} value={grade}>
                      Grade {grade}
                    </option>
                  ))}
                </select>
                {errors.grade && (
                  <p className="mt-1 text-xs text-red-500">{errors.grade}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subject *
              </label>
              <div className="relative">
                <Type className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className={`w-full rounded-lg border ${
                    errors.subject ? "border-red-500" : "border-gray-200"
                  } bg-white pl-10 pr-4 py-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none`}
                >
                  <option value="">Select Subject</option>
                  {subjects.map((subject) => (
                    <option key={subject} value={subject}>
                      {subject}
                    </option>
                  ))}
                </select>
                {errors.subject && (
                  <p className="mt-1 text-xs text-red-500">{errors.subject}</p>
                )}
              </div>
            </div>
          </div>

          {/* Tutor */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Assigned Tutor *
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <select
                name="tutorId"
                value={formData.tutorId}
                onChange={handleChange}
                className={`w-full rounded-lg border ${
                  errors.tutorId ? "border-red-500" : "border-gray-200"
                } bg-white pl-10 pr-4 py-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none`}
              >
                <option value="">Select Tutor</option>
                {tutors.map((tutor) => (
                  <option key={tutor.id} value={tutor.id}>
                    {tutor.name} ({tutor.subject})
                  </option>
                ))}
              </select>
              {errors.tutorId && (
                <p className="mt-1 text-xs text-red-500">{errors.tutorId}</p>
              )}
            </div>
          </div>

          {/* Room Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Room Number *
            </label>
            <div className="relative">
              <Building className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                name="roomNumber"
                value={formData.roomNumber}
                onChange={handleChange}
                placeholder="e.g., Room 101 or Lab A"
                className={`w-full rounded-lg border ${
                  errors.roomNumber ? "border-red-500" : "border-gray-200"
                } bg-white pl-10 pr-4 py-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none`}
              />
              {errors.roomNumber && (
                <p className="mt-1 text-xs text-red-500">{errors.roomNumber}</p>
              )}
            </div>
          </div>

          {/* Schedule - Days of Week */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Class Days *
            </label>
            <div className="flex flex-wrap gap-2">
              {daysOfWeek.map((day) => (
                <label
                  key={day.id}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium cursor-pointer transition ${
                    formData.days.includes(day.id)
                      ? "bg-indigo-100 text-indigo-700"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  <input
                    type="checkbox"
                    name="days"
                    value={day.id}
                    checked={formData.days.includes(day.id)}
                    onChange={handleChange}
                    className="hidden"
                  />
                  {day.label}
                </label>
              ))}
            </div>
            {errors.days && (
              <p className="mt-1 text-xs text-red-500">{errors.days}</p>
            )}
          </div>

          {/* Schedule - Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Time *
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="time"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleChange}
                  className={`w-full rounded-lg border ${
                    errors.startTime ? "border-red-500" : "border-gray-200"
                  } bg-white pl-10 pr-4 py-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none`}
                />
                {errors.startTime && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.startTime}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Time *
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="time"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleChange}
                  className={`w-full rounded-lg border ${
                    errors.endTime ? "border-red-500" : "border-gray-200"
                  } bg-white pl-10 pr-4 py-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none`}
                />
                {errors.endTime && (
                  <p className="mt-1 text-xs text-red-500">{errors.endTime}</p>
                )}
              </div>
            </div>
          </div>

          {/* Class Fee and Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Class Fee (LKR) *
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="number"
                  name="classFee"
                  value={formData.classFee}
                  onChange={handleChange}
                  min="0"
                  step="100"
                  placeholder="0.00"
                  className={`w-full rounded-lg border ${
                    errors.classFee ? "border-red-500" : "border-gray-200"
                  } bg-white pl-10 pr-4 py-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none`}
                />
                {errors.classFee && (
                  <p className="mt-1 text-xs text-red-500">{errors.classFee}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <div className="flex gap-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="status"
                    value="Active"
                    checked={formData.status === "Active"}
                    onChange={handleChange}
                    className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                  />
                  <span className="text-sm text-gray-700">Active</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="status"
                    value="Inactive"
                    checked={formData.status === "Inactive"}
                    onChange={handleChange}
                    className="h-4 w-4 text-gray-400 border-gray-300 focus:ring-gray-500"
                  />
                  <span className="text-sm text-gray-500">Inactive</span>
                </label>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <div className="relative">
              <Type className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                placeholder="Brief description of the class..."
                className="w-full rounded-lg border border-gray-200 bg-white pl-10 pr-4 py-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none resize-none"
              />
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => navigate("/dashboard/admin/classes")}
              className="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 px-6 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60 transition whitespace-nowrap"            >
              {loading ? (
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
              ) : (
                <>
                  Create Class
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
