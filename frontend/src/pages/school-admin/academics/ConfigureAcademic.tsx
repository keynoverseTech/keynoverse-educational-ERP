import { useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  Clock, 
  Building2, 
  Building, 
  GraduationCap, 
  Layers, 
  BookOpen, 
  Users, 
  UserPlus,
  Settings,
  ArrowRight,
  CheckCircle,
  FileText
} from 'lucide-react';

export default function ConfigureAcademic() {
  const navigate = useNavigate();

  const modules = [
    { 
      title: 'Academic Sessions', 
      desc: 'Manage academic years (e.g., 2024/2025) and statuses.', 
      icon: Calendar, 
      path: '/school-admin/academics/sessions',
      color: 'bg-blue-600'
    },
    { 
      title: 'Semesters', 
      desc: 'Configure semesters, durations, and exam periods.', 
      icon: Clock, 
      path: '/school-admin/academics/semesters',
      color: 'bg-purple-600'
    },
    { 
      title: 'Faculties', 
      desc: 'Manage faculties and assign deans.', 
      icon: Building2, 
      path: '/school-admin/academics/faculties',
      color: 'bg-indigo-600'
    },
    { 
      title: 'Departments', 
      desc: 'Create departments and link them to faculties.', 
      icon: Building, 
      path: '/school-admin/academics/departments',
      color: 'bg-cyan-600'
    },
    { 
      title: 'Programmes', 
      desc: 'Set up degree programmes and durations.', 
      icon: GraduationCap, 
      path: '/school-admin/academics/programmes',
      color: 'bg-teal-600'
    },
    { 
      title: 'Levels', 
      desc: 'Define academic levels (100, 200, etc.).', 
      icon: Layers, 
      path: '/school-admin/academics/levels',
      color: 'bg-emerald-600'
    },
    { 
      title: 'Courses', 
      desc: 'Manage course catalog, codes, and credit units.', 
      icon: BookOpen, 
      path: '/school-admin/academics/courses',
      color: 'bg-orange-600'
    },
    { 
      title: 'Staff Management', 
      desc: 'Manage lecturers, HODs, and administrative staff.', 
      icon: Users, 
      path: '/school-admin/staff/list', // Linking to existing page
      color: 'bg-pink-600'
    },
    { 
      title: 'Student Management', 
      desc: 'Manage student enrollments and profiles.', 
      icon: UserPlus, 
      path: '/school-admin/students/list', // Linking to existing page
      color: 'bg-rose-600'
    },
    { 
      title: 'Course Registration Config', 
      desc: 'Manage credit limits, deadlines, and approval workflows.', 
      icon: FileText, 
      path: '/school-admin/academics/registration-config',
      color: 'bg-blue-600'
    },
    { 
      title: 'Registration Approvals', 
      desc: 'Review and approve student course registrations.', 
      icon: CheckCircle, 
      path: '/school-admin/academics/registration-approvals',
      color: 'bg-teal-600'
    },
    { 
      title: 'Grading System', 
      desc: 'Configure grading scales and CGPA policies.', 
      icon: GraduationCap, 
      path: '/school-admin/examinations/grading',
      color: 'bg-purple-600'
    },
    { 
      title: 'Exam Creation', 
      desc: 'Schedule exams and manage venues.', 
      icon: Calendar, 
      path: '/school-admin/examinations/create',
      color: 'bg-indigo-600'
    },
    { 
      title: 'Exam Timetable', 
      desc: 'View and manage exam timetables.', 
      icon: Clock, 
      path: '/school-admin/examinations/timetable',
      color: 'bg-cyan-600'
    }
  ];

  return (
    <div className="space-y-8 p-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
          <Settings className="w-8 h-8 text-gray-700 dark:text-gray-300" />
          Academics Configuration
        </h1>
        <p className="text-lg text-gray-500 dark:text-gray-400 mt-2 max-w-3xl">
          Manage your university's academic structure independently. Configure each module as needed without forced workflows.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map((module, index) => (
          <button
            key={index}
            onClick={() => navigate(module.path)}
            className="group flex flex-col p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-lg hover:border-blue-500 dark:hover:border-blue-500 transition-all text-left h-full"
          >
            <div className={`w-14 h-14 rounded-xl ${module.color} flex items-center justify-center text-white shadow-lg mb-4 group-hover:scale-110 transition-transform duration-300`}>
              <module.icon size={28} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {module.title}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6 flex-grow">
              {module.desc}
            </p>
            <div className="flex items-center text-sm font-semibold text-blue-600 dark:text-blue-400 group-hover:translate-x-2 transition-transform">
              Configure
              <ArrowRight size={16} className="ml-2" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
