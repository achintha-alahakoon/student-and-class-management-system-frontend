// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   Camera,
//   X,
//   Calendar,
//   User,
//   Mail,
//   Phone,
//   Home,
//   IdCard,
// } from "lucide-react";
// import axios from "axios";

// export default function RegisterStudent() {
//   const [formData, setFormData] = useState({
//     firstName: "",
//     lastName: "",
//     dateOfBirth: "",
//     gender: "",
//     nic: "",
//     grade: "",
//     classId: "",
//     email: "",
//     phone: "",
//     address: "",
//     parentName: "",
//     parentPhone: "",
//     parentEmail: "",
//     photo: null,
//   });
//   const [classes, setClasses] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [photoPreview, setPhotoPreview] = useState(null);
//   const navigate = useNavigate();

//   // Fetch classes
//   useEffect(() => {
//     axios
//       .get("/api/classes")
//       .then((res) => setClasses(res.data))
//       .catch((err) => console.error("Error fetching classes:", err));
//   }, []);

//   // Handle input change
//   const handleChange = (e) => {
//     const { name, value, files } = e.target;
//     if (name === "photo") {
//       const file = files[0];
//       setFormData({ ...formData, photo: file });
//       if (file) {
//         const reader = new FileReader();
//         reader.onload = () => setPhotoPreview(reader.result);
//         reader.readAsDataURL(file);
//       } else {
//         setPhotoPreview(null);
//       }
//     } else {
//       setFormData({ ...formData, [name]: value });
//     }
//   };

//   // Handle submit
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");

//     try {
//       const data = new FormData();
//       Object.keys(formData).forEach((key) => {
//         if (formData[key]) data.append(key, formData[key]);
//       });

//       const res = await axios.post("/api/students", data, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });

//       navigate(`/students/${res.data.id}`);
//     } catch (err) {
//       setError(err.response?.data?.message || "Failed to register student");
//       setLoading(false);
//     }
//   };

//   // Form fields
//   const genders = ["Male", "Female", "Other"];
//   const grades = [
//     "Grade 1",
//     "Grade 2",
//     "Grade 3",
//     "Grade 4",
//     "Grade 5",
//     "Grade 6",
//     "Grade 7",
//     "Grade 8",
//     "Grade 9",
//     "Grade 10",
//     "Grade 11",
//     "Grade 12",
//   ];

//   return (
//     <div className="p-6 space-y-6">
//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900">
//             Register New Student
//           </h1>
//           <p className="text-sm text-gray-500">Fill in all required fields</p>
//         </div>
//       </div>

//       {/* Form */}
//       <form onSubmit={handleSubmit} className="space-y-6">
//         {error && (
//           <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
//             {error}
//           </div>
//         )}

//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//           {/* Photo Upload */}
//           <div className="md:col-span-1">
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Student Photo
//             </label>
//             <div className="relative">
//               <div className="h-48 w-full rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 flex items-center justify-center overflow-hidden">
//                 {photoPreview ? (
//                   <img
//                     src={photoPreview}
//                     alt="Preview"
//                     className="h-full w-full object-cover"
//                   />
//                 ) : (
//                   <div className="text-center text-gray-400">
//                     <Camera className="h-12 w-12 mx-auto mb-2" />
//                     <p className="text-sm">Upload Photo</p>
//                   </div>
//                 )}
//               </div>
//               <input
//                 type="file"
//                 name="photo"
//                 id="photo"
//                 accept="image/*"
//                 onChange={handleChange}
//                 className="hidden"
//               />
//               <label
//                 htmlFor="photo"
//                 className="absolute bottom-3 left-1/2 -translate-x-1/2 cursor-pointer flex items-center gap-2 px-3 py-1.5 bg-indigo-600 text-white text-xs rounded-lg hover:bg-indigo-700 transition"
//               >
//                 <Camera className="h-3.5 w-3.5" />
//                 Choose File
//               </label>
//               {photoPreview && (
//                 <button
//                   type="button"
//                   onClick={() => {
//                     setFormData({ ...formData, photo: null });
//                     setPhotoPreview(null);
//                   }}
//                   className="absolute top-2 right-2 h-6 w-6 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition"
//                 >
//                   <X className="h-3.5 w-3.5" />
//                 </button>
//               )}
//             </div>
//           </div>

//           {/* Personal Info */}
//           <div className="md:col-span-2 space-y-4">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   First Name *
//                 </label>
//                 <div className="relative">
//                   <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
//                   <input
//                     type="text"
//                     name="firstName"
//                     value={formData.firstName}
//                     onChange={handleChange}
//                     required
//                     className="w-full rounded-lg border border-gray-200 bg-white pl-10 pr-4 py-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none"
//                     placeholder="John"
//                   />
//                 </div>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Last Name *
//                 </label>
//                 <div className="relative">
//                   <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
//                   <input
//                     type="text"
//                     name="lastName"
//                     value={formData.lastName}
//                     onChange={handleChange}
//                     required
//                     className="w-full rounded-lg border border-gray-200 bg-white pl-10 pr-4 py-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none"
//                     placeholder="Doe"
//                   />
//                 </div>
//               </div>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Date of Birth *
//                 </label>
//                 <div className="relative">
//                   <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
//                   <input
//                     type="date"
//                     name="dateOfBirth"
//                     value={formData.dateOfBirth}
//                     onChange={handleChange}
//                     required
//                     className="w-full rounded-lg border border-gray-200 bg-white pl-10 pr-4 py-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Gender *
//                   </label>
//                   <select
//                     name="gender"
//                     value={formData.gender}
//                     onChange={handleChange}
//                     required
//                     className="w-full rounded-lg border border-gray-200 bg-white pl-3 pr-4 py-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none"
//                   >
//                     <option value="">Select Gender</option>
//                     {genders.map((g) => (
//                       <option key={g} value={g}>
//                         {g}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   NIC
//                 </label>
//                 <div className="relative">
//                   <IdCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
//                   <input
//                     type="text"
//                     name="nic"
//                     value={formData.nic}
//                     onChange={handleChange}
//                     required
//                     className="w-full rounded-lg border border-gray-200 bg-white pl-10 pr-4 py-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none"
//                     placeholder="123456789000"
//                   />
//                 </div>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Grade *
//                   </label>
//                   <select
//                     name="grade"
//                     value={formData.grade}
//                     onChange={handleChange}
//                     required
//                     className="w-full rounded-lg border border-gray-200 bg-white pl-3 pr-4 py-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none"
//                   >
//                     <option value="">Select Grade</option>
//                     {grades.map((g) => (
//                       <option key={g} value={g}>
//                         {g}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Class *
//                   </label>
//                   <select
//                     name="classId"
//                     value={formData.classId}
//                     onChange={handleChange}
//                     required
//                     className="w-full rounded-lg border border-gray-200 bg-white pl-3 pr-4 py-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none"
//                   >
//                     <option value="">Select Class</option>
//                     {classes.map((cls) => (
//                       <option key={cls.id} value={cls.id}>
//                         {cls.name}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Contact Info */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Email
//               </label>
//               <div className="relative">
//                 <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
//                 <input
//                   type="email"
//                   name="email"
//                   value={formData.email}
//                   onChange={handleChange}
//                   className="w-full rounded-lg border border-gray-200 bg-white pl-10 pr-4 py-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none"
//                   placeholder="john@gmail.com"
//                 />
//               </div>
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Phone *
//               </label>
//               <div className="relative">
//                 <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
//                 <input
//                   type="tel"
//                   name="phone"
//                   value={formData.phone}
//                   onChange={handleChange}
//                   required
//                   className="w-full rounded-lg border border-gray-200 bg-white pl-10 pr-4 py-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none"
//                   placeholder="+94 12 345 6789"
//                 />
//               </div>
//             </div>
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Address
//             </label>
//             <div className="relative">
//               <Home className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
//               <textarea
//                 name="address"
//                 value={formData.address}
//                 onChange={handleChange}
//                 rows={3}
//                 className="w-full rounded-lg border border-gray-200 bg-white pl-10 pr-4 py-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none resize-none"
//                 placeholder="123 Main Street, City"
//               />
//             </div>
//           </div>

//           {/* Parent Info */}
//           <div className="border-t border-gray-200 pt-6">
//             <h3 className="text-lg font-semibold text-gray-900 mb-4">
//               Parent / Guardian Information
//             </h3>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Parent Name *
//                 </label>
//                 <input
//                   type="text"
//                   name="parentName"
//                   value={formData.parentName}
//                   onChange={handleChange}
//                   required
//                   className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none"
//                   placeholder="Parent's Full Name"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Parent Phone *
//                 </label>
//                 <input
//                   type="tel"
//                   name="parentPhone"
//                   value={formData.parentPhone}
//                   onChange={handleChange}
//                   required
//                   className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none"
//                   placeholder="+94 12 345 6789"
//                 />
//               </div>
//             </div>
//             <div className="mt-4">
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Parent Email
//               </label>
//               <input
//                 type="email"
//                 name="parentEmail"
//                 value={formData.parentEmail}
//                 onChange={handleChange}
//                 className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none"
//                 placeholder="parent@gmail.com"
//               />
//             </div>
//           </div>

//           {/* Submit */}
//           <div className="flex justify-end gap-3 pt-4">
//             <button
//               type="button"
//               onClick={() => navigate("/dashboard/admin/students")}
//               className="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               disabled={loading}
//               className="rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 px-6 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60 transition"
//             >
//               {loading ? (
//                 <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
//               ) : (
//                 <>Register Student</>
//               )}
//             </button>
//           </div>
//         </div>
//       </form>
//     </div>
//   );
// }

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Camera,
  X,
  Calendar,
  User,
  Mail,
  Phone,
  Home,
  IdCard,
  BookOpen,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

export default function RegisterStudent() {
  const { token } = useAuth();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "",
    nic: "",
    grade: "",
    email: "",
    phone: "",
    address: "",
    parentName: "",
    parentPhone: "",
    parentEmail: "",
    photo: null,
    username: "",
    password: "",
  });
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [photoPreview, setPhotoPreview] = useState(null);
  const [selectedClasses, setSelectedClasses] = useState([]);
  const [showClassSelector, setShowClassSelector] = useState(false);
  const navigate = useNavigate();

  // Fetch classes
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const authToken = token || localStorage.getItem("token");
        const res = await axios.get(
          "http://localhost:8081/api/classSchedule/scheduledClasses",
          { headers: { Authorization: `Bearer ${authToken}` } },
        );
        setClasses(res.data ?? []);
      } catch (err) {
        console.error("Error fetching classes:", err);
        setError("Failed to load classes. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchClasses();
  }, [token]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "photo") {
      const file = files[0];
      setFormData({ ...formData, photo: file });
      if (file) {
        const reader = new FileReader();
        reader.onload = () => setPhotoPreview(reader.result);
        reader.readAsDataURL(file);
      } else {
        setPhotoPreview(null);
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleClassSelect = (classId) => {
    if (!selectedClasses.includes(classId)) {
      setSelectedClasses((prev) => [...prev, classId]);
    }
  };

  const removeSelectedClass = (classId) => {
    setSelectedClasses((prev) => prev.filter((id) => id !== classId));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const authToken = token || localStorage.getItem("token");
      
      const payload = {
      ...formData,
      classIds: selectedClasses.length > 0 ? selectedClasses : undefined
    };

      const res = await axios.post(
        "http://localhost:8081/api/registration/student",
        payload,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        },
      );

      navigate(`/dashboard/admin/students/${res.data.StudentID}`);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to register student");
      setLoading(false);
    }
  };

  const genders = ["Male", "Female", "Other"];
  const grades = [
    "Grade 4",
    "Grade 5",
    "Grade 6",
    "Grade 7",
    "Grade 8",
    "Grade 9",
    "Grade 10",
    "Grade 11",
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Register New Student
          </h1>
          <p className="text-sm text-gray-500">Fill in all required fields</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Photo + Personal Info Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Photo Upload */}
          <div className="lg:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Student Photo
            </label>
            <div className="relative">
              <div className="h-48 w-full rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 flex items-center justify-center overflow-hidden">
                {photoPreview ? (
                  <img
                    src={photoPreview}
                    alt="Preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="text-center text-gray-400">
                    <Camera className="h-12 w-12 mx-auto mb-2" />
                    <p className="text-sm">Upload Photo</p>
                  </div>
                )}
              </div>
              <input
                type="file"
                name="photo"
                id="photo"
                accept="image/*"
                onChange={handleChange}
                className="hidden"
              />
              <label
                htmlFor="photo"
                className="absolute bottom-3 left-1/2 -translate-x-1/2 cursor-pointer flex items-center gap-2 px-3 py-1.5 bg-indigo-600 text-white text-xs rounded-lg hover:bg-indigo-700 transition"
              >
                <Camera className="h-3.5 w-3.5" />
                Choose File
              </label>
              {photoPreview && (
                <button
                  type="button"
                  onClick={() => {
                    setFormData({ ...formData, photo: null });
                    setPhotoPreview(null);
                  }}
                  className="absolute top-2 right-2 h-6 w-6 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Personal Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-gray-200 bg-white pl-10 pr-4 py-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none"
                    placeholder="John"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-gray-200 bg-white pl-10 pr-4 py-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none"
                    placeholder="Doe"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date of Birth *
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleChange}
                      required
                      className="w-full rounded-lg border border-gray-200 bg-white pl-10 pr-4 py-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Gender *
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-gray-200 bg-white pl-3 pr-4 py-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none"
                  >
                    <option value="">Select Gender</option>
                    {genders.map((g) => (
                      <option key={g} value={g}>
                        {g}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  NIC
                </label>
                <div className="relative">
                  <IdCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    name="nic"
                    value={formData.nic}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-200 bg-white pl-10 pr-4 py-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none"
                    placeholder="123456789000"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Grade *
                </label>
                <select
                  name="grade"
                  value={formData.grade}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-gray-200 bg-white pl-3 pr-4 py-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none"
                >
                  <option value="">Select Grade</option>
                  {grades.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-200 bg-white pl-10 pr-4 py-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none"
                placeholder="john@gmail.com"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone *
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-gray-200 bg-white pl-10 pr-4 py-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none"
                placeholder="+94 12 345 6789"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Address
          </label>
          <div className="relative">
            <Home className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows={3}
              className="w-full rounded-lg border border-gray-200 bg-white pl-10 pr-4 py-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none resize-none"
              placeholder="123 Main Street, City"
            />
          </div>
        </div>

        {/* Account Credentials */}
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Account Credentials
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Username *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-gray-200 bg-white pl-10 pr-4 py-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none"
                  placeholder="johndoe"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password *
              </label>
              <div className="relative">
                <IdCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-gray-200 bg-white pl-10 pr-4 py-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none"
                  placeholder="Min. 6 characters"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Optional Class Assignment */}
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Assign to Classes{" "}
              <span className="text-xs text-gray-400 font-normal">
                (Optional - select multiple)
              </span>
            </h2>
            <button
              type="button"
              onClick={() => setShowClassSelector(!showClassSelector)}
              className="flex items-center gap-1 px-3 py-1.5 text-sm text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition"
            >
              {showClassSelector ? (
                <>
                  <ChevronUp className="h-4 w-4" />
                  Hide
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4" />
                  Show
                </>
              )}
            </button>
          </div>

          {showClassSelector && (
            <>
              {classes.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-4">
                  No classes available
                </p>
              ) : (
                <>
                  {/* Class list with max height and scroll */}
                  <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2">
                    {classes.map((cls) => (
                      <div
                        key={cls.ClassID}
                        onClick={() => handleClassSelect(cls.ClassID)}
                        className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition ${
                          selectedClasses.includes(cls.ClassID)
                            ? "bg-indigo-50 border border-indigo-200 opacity-60 cursor-not-allowed"
                            : "hover:bg-gray-50"
                        }`}
                      >
                        <div className="min-w-0">
                          <p className="font-medium text-gray-900 truncate">
                            <BookOpen className="h-4 w-4 inline mr-1 text-indigo-500" />
                            {cls.ClassName || `${cls.Grade} - ${cls.Subject}`}
                          </p>
                          <p className="text-xs text-gray-500">
                            Grade {cls.Grade} · {cls.Subject}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Selected classes display */}
                  {selectedClasses.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <p className="text-xs text-gray-500 mb-2">
                        Selected: {selectedClasses.length} class(es)
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {classes
                          .filter((cls) =>
                            selectedClasses.includes(cls.ClassID),
                          )
                          .map((cls) => (
                            <span
                              key={cls.ClassID}
                              className="flex items-center gap-1 px-2 py-1 bg-indigo-100 text-indigo-700 text-xs rounded-lg"
                            >
                              <BookOpen className="h-3 w-3" />
                              {cls.ClassName || `${cls.Grade} - ${cls.Subject}`}
                              <button
                                type="button"
                                onClick={() => removeSelectedClass(cls.ClassID)}
                                className="text-indigo-500 hover:text-red-500"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </span>
                          ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>

        {/* Parent Info */}
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Parent / Guardian Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Parent Name *
              </label>
              <input
                type="text"
                name="parentName"
                value={formData.parentName}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none"
                placeholder="Parent's Full Name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Parent Phone *
              </label>
              <input
                type="tel"
                name="parentPhone"
                value={formData.parentPhone}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none"
                placeholder="+94 12 345 6789"
              />
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Parent Email
            </label>
            <input
              type="email"
              name="parentEmail"
              value={formData.parentEmail}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none"
              placeholder="parent@gmail.com"
            />
          </div>
        </div>

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Submit */}
        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={() => navigate("/dashboard/admin/students")}
            className="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 px-6 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60 transition"
          >
            {loading ? (
              <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
            ) : (
              "Register Student"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
