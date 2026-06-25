import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ChevronLeft, Upload, X } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

function Field({ label, required, error, children }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      {children}
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}

const inputClass =
  "w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100";

const SUBJECTS = ["Mathematics", "Science", "English", "ICT", "Commerce", "History", "Geography", "Other"];

export default function RegisterTutor() {
  const { token } = useAuth();
  const navigate  = useNavigate();

  const [form, setForm] = useState({
    FirstName: "", LastName: "", NICNo: "", Gender: "",
    DOB: "", TelNo: "", Email: "", Address: "", Subject: "", Username: "", Password: "",
  });
  const [photo,    setPhoto]    = useState(null);
  const [preview,  setPreview]  = useState(null);
  const [errors,   setErrors]   = useState({});
  const [loading,  setLoading]  = useState(false);
  const [apiError, setApiError] = useState("");

  const set = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPhoto(file);
    setPreview(URL.createObjectURL(file));
  };

  const validate = () => {
    const e = {};
    if (!form.FirstName.trim()) e.FirstName = "First name is required";
    if (!form.LastName.trim())  e.LastName  = "Last name is required";
    if (!form.NICNo.trim())     e.NICNo     = "NIC is required";
    if (!form.Gender)           e.Gender    = "Gender is required";
    if (!form.TelNo.trim())     e.TelNo     = "Phone number is required";
    if (!form.Subject)          e.Subject   = "Subject is required";
    if (!form.Username.trim())  e.Username  = "Username is required";
    if (!form.Password.trim())  e.Password  = "Password is required";
    if (form.Password && form.Password.length < 6)
      e.Password = "Password must be at least 6 characters";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);

    try {
      const data = new FormData();
      Object.entries(form).forEach(([k, v]) => data.append(k, v));
      if (photo) data.append("photo", photo);

      await axios.post("http://localhost:8081/api/tutors/register", data, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
      });
      navigate("/dashboard/admin/tutors");
    } catch (err) {
      setApiError(err.response?.data?.message ?? "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">

      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate("/dashboard/admin/tutors")}
          className="rounded-xl border border-gray-200 p-2 text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Register Tutor</h1>
          <p className="text-sm text-gray-400 mt-0.5">Fill in the details to add a new tutor</p>
        </div>
      </div>

      {apiError && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {apiError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">

        {/* Photo upload */}
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-sm font-semibold text-gray-900">Profile Photo</h2>
          <div className="flex items-center gap-5">
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full border-2 border-dashed border-gray-200 bg-gray-50">
              {preview ? (
                <>
                  <img src={preview} alt="Preview" className="h-full w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => { setPhoto(null); setPreview(null); }}
                    className="absolute right-0 top-0 rounded-full bg-red-500 p-0.5 text-white"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </>
              ) : (
                <div className="flex h-full items-center justify-center text-gray-300">
                  <Upload className="h-6 w-6" />
                </div>
              )}
            </div>
            <div>
              <label className="cursor-pointer rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 transition">
                Choose photo
                <input type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
              </label>
              <p className="mt-1.5 text-xs text-gray-400">JPG, PNG up to 5MB</p>
            </div>
          </div>
        </div>

        {/* Personal info */}
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm space-y-4">
          <h2 className="text-sm font-semibold text-gray-900">Personal Information</h2>
          <div className="grid grid-cols-2 gap-4">
            <Field label="First Name" required error={errors.FirstName}>
              <input className={inputClass} placeholder="Kasun" value={form.FirstName} onChange={set("FirstName")} />
            </Field>
            <Field label="Last Name" required error={errors.LastName}>
              <input className={inputClass} placeholder="Perera" value={form.LastName} onChange={set("LastName")} />
            </Field>
            <Field label="NIC Number" required error={errors.NICNo}>
              <input className={inputClass} placeholder="983456789V" value={form.NICNo} onChange={set("NICNo")} />
            </Field>
            <Field label="Gender" required error={errors.Gender}>
              <select className={inputClass} value={form.Gender} onChange={set("Gender")}>
                <option value="">Select gender</option>
                <option>Male</option>
                <option>Female</option>
              </select>
            </Field>
            <Field label="Date of Birth" error={errors.DOB}>
              <input type="date" className={inputClass} value={form.DOB} onChange={set("DOB")} />
            </Field>
            <Field label="Phone Number" required error={errors.TelNo}>
              <input className={inputClass} placeholder="0771234567" value={form.TelNo} onChange={set("TelNo")} />
            </Field>
            <Field label="Email Address" error={errors.Email}>
              <input type="email" className={inputClass} placeholder="kasun@email.com" value={form.Email} onChange={set("Email")} />
            </Field>
            <Field label="Subject" required error={errors.Subject}>
              <select className={inputClass} value={form.Subject} onChange={set("Subject")}>
                <option value="">Select subject</option>
                {SUBJECTS.map((s) => <option key={s}>{s}</option>)}
              </select>
            </Field>
          </div>
          <Field label="Address" error={errors.Address}>
            <textarea
              rows={2}
              className={inputClass}
              placeholder="No. 12, Galle Road, Colombo"
              value={form.Address}
              onChange={set("Address")}
            />
          </Field>
        </div>

        {/* Account credentials */}
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm space-y-4">
          <h2 className="text-sm font-semibold text-gray-900">Account Credentials</h2>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Username" required error={errors.Username}>
              <input className={inputClass} placeholder="kasun.perera" value={form.Username} onChange={set("Username")} />
            </Field>
            <Field label="Password" required error={errors.Password}>
              <input type="password" className={inputClass} placeholder="Min. 6 characters" value={form.Password} onChange={set("Password")} />
            </Field>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pb-6">
          <button
            type="button"
            onClick={() => navigate("/dashboard/admin/tutors")}
            className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60 transition"
          >
            {loading ? "Registering…" : "Register Tutor"}
          </button>
        </div>
      </form>
    </div>
  );
}