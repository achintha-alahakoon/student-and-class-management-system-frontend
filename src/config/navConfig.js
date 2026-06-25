import {
  LayoutDashboard,
  BookOpen,
  CalendarCheck,
  ClipboardList,
  CreditCard,
  BarChart3,
  Settings,
  UserCircle,
} from "lucide-react";

const navConfig = {
  Admin: [
    { icon: LayoutDashboard, label: "Dashboard",      path: "/dashboard/admin",                end: true },
    { icon: BookOpen,        label: "Students",       path: "/dashboard/admin/students"                 },
    { icon: CalendarCheck,   label: "Attendance",     path: "/dashboard/admin/attendance"               },
    { icon: CreditCard,      label: "Payments",       path: "/dashboard/admin/payments"                 },
    { icon: BarChart3,       label: "Reports",        path: "/dashboard/admin/reports"                  },
    { icon: BookOpen,        label: "Class Schedule", path: "/dashboard/admin/class-schedule"           },
    { icon: Settings,        label: "Settings",       path: "/dashboard/admin/settings"                 },
  ],

  Tutor: [
    { icon: LayoutDashboard, label: "Dashboard",      path: "/dashboard/tutor",                end: true },
    { icon: BookOpen,        label: "My Classes",     path: "/dashboard/tutor/classes"                  },
    { icon: CalendarCheck,   label: "Class Schedule", path: "/dashboard/tutor/class-schedule"           },
    { icon: ClipboardList,   label: "Grades",         path: "/dashboard/tutor/grades"                   },
  ],

  Student: [
    { icon: LayoutDashboard, label: "Dashboard",      path: "/dashboard/student",              end: true },
    { icon: BookOpen,        label: "My Classes",     path: "/dashboard/student/classes"                },
    { icon: CalendarCheck,   label: "Class Schedule", path: "/dashboard/student/class-schedule"         },
    { icon: ClipboardList,   label: "Grades",         path: "/dashboard/student/grades"                 },
    { icon: UserCircle,      label: "Profile",        path: "/dashboard/student/profile"                },
  ],

  Parent: [
    { icon: LayoutDashboard, label: "Dashboard",      path: "/dashboard/parent",               end: true },
    { icon: CalendarCheck,   label: "Class Schedule", path: "/dashboard/parent/class-schedule"          },
    { icon: ClipboardList,   label: "Grades",         path: "/dashboard/parent/grades"                  },
    { icon: CreditCard,      label: "Payments",       path: "/dashboard/parent/payments"                },
  ],
};

export default navConfig;