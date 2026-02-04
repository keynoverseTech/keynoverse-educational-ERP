import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Building2, 
  Users, 
  BookOpen, 
  UserPlus,
  ClipboardCheck,
  GraduationCap,
  Briefcase
} from 'lucide-react';
import './App.css';

// Layouts
import DashboardLayout from './layouts/DashboardLayout';

// Pages
import AuthSelection from './pages/auth/AuthSelection';
import SuperAdminLogin from './pages/auth/SuperAdminLogin';
import SchoolAdminLogin from './pages/auth/SchoolAdminLogin';

// Super Admin Pages
import SuperAdminDashboard from './pages/super-admin/Dashboard';
import Institutions from './pages/super-admin/Institutions';
import NewRegistration from './pages/super-admin/NewRegistration';
import Applications from './pages/super-admin/Applications';
import ApplicationDetails from './pages/super-admin/ApplicationDetails';
import InstitutionDetails from './pages/super-admin/InstitutionDetails';
import SubAdmins from './pages/super-admin/SubAdmins';
import SystemLogs from './pages/super-admin/SystemLogs';

// School Admin Pages
import SchoolAdminDashboard from './pages/school-admin/Dashboard';
// Admissions
import ConfigureAdmissions from './pages/school-admin/admissions/ConfigureAdmissions';
import CreateAdmission from './pages/school-admin/admissions/CreateAdmission';
import MultipleImports from './pages/school-admin/admissions/MultipleImports';
// Academics
import ConfigureAcademic from './pages/school-admin/academics/ConfigureAcademic';
import CourseManagement from './pages/school-admin/Courses'; // Reusing existing
import CourseRegistration from './pages/school-admin/academics/CourseRegistration';
import AcademicCalendar from './pages/school-admin/academics/AcademicCalendar';
// Examinations
import AssessmentConfiguration from './pages/school-admin/examinations/AssessmentConfiguration';
import ExamCreation from './pages/school-admin/Exams'; // Reusing existing
import ResultsEntry from './pages/school-admin/examinations/ResultsEntry';
import ResultPublication from './pages/school-admin/examinations/ResultPublication';
// Students
import StudentList from './pages/school-admin/Students'; // Reusing existing
import StudentProfile from './pages/school-admin/students/StudentProfile';
// Teachers
import TeacherList from './pages/school-admin/teachers/TeacherList';
import TeacherProfile from './pages/school-admin/teachers/TeacherProfile';
// Staff
import StaffList from './pages/school-admin/Staff'; // Reusing existing
import StaffProfile from './pages/school-admin/staff/StaffProfile';

const superAdminItems = [
  { name: 'Overview', path: '/super-admin/dashboard', icon: LayoutDashboard },
  { 
    name: 'Institutions', 
    icon: Building2,
    subItems: [
      { name: 'All Institutions', path: '/super-admin/institutions' },
      { name: 'Registrations', path: '/super-admin/applications' }
    ]
  },
];

const schoolAdminItems = [
  { name: 'Overview', path: '/school-admin/dashboard', icon: LayoutDashboard },
  { 
    name: 'Admissions', 
    icon: UserPlus,
    subItems: [
      { name: 'Configure Admissions', path: '/school-admin/admissions/configure' },
      { name: 'Create Admission', path: '/school-admin/admissions/create' },
      { name: 'Multiple Imports', path: '/school-admin/admissions/imports' }
    ]
  },
  { 
    name: 'Academics', 
    icon: BookOpen,
    subItems: [
      { name: 'Configure Academic', path: '/school-admin/academics/configure' },
      { name: 'Course Management', path: '/school-admin/academics/courses' },
      { name: 'Course Registration', path: '/school-admin/academics/registration' },
      { name: 'Academic Calendar', path: '/school-admin/academics/calendar' }
    ]
  },
  { 
    name: 'Examination', 
    icon: ClipboardCheck,
    subItems: [
      { name: 'Assessment Config', path: '/school-admin/examinations/assessment-config' },
      { name: 'Exam Creation', path: '/school-admin/examinations/exam-creation' },
      { name: 'Results Entry', path: '/school-admin/examinations/results-entry' },
      { name: 'Result Publication', path: '/school-admin/examinations/result-publication' }
    ]
  },
  { 
    name: 'Student Management', 
    icon: GraduationCap,
    subItems: [
      { name: 'Student List', path: '/school-admin/students/list' },
      { name: 'Student Profile', path: '/school-admin/students/profile' }
    ]
  },
  { 
    name: 'Teacher Management', 
    icon: Users,
    subItems: [
      { name: 'Teacher List', path: '/school-admin/teachers/list' },
      { name: 'Teacher Profile', path: '/school-admin/teachers/profile' }
    ]
  },
  { 
    name: 'Staff Management', 
    icon: Briefcase,
    subItems: [
      { name: 'Staff List', path: '/school-admin/staff/list' },
      { name: 'Staff Profile', path: '/school-admin/staff/profile' }
    ]
  }
];

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Navigate to="/auth" replace />} />
        <Route path="/auth" element={<AuthSelection />} />
        <Route path="/auth/super-admin" element={<SuperAdminLogin />} />
        <Route path="/auth/school-admin" element={<SchoolAdminLogin />} />

        {/* Super Admin Routes */}
        <Route element={
          <DashboardLayout sidebarItems={superAdminItems}>
            <Outlet />
          </DashboardLayout>
        }>
          <Route path="/super-admin/dashboard" element={<SuperAdminDashboard />} />
          <Route path="/super-admin/institutions" element={<Institutions />} />
          <Route path="/super-admin/new-registration" element={<NewRegistration />} />
          <Route path="/super-admin/applications" element={<Applications />} />
          <Route path="/super-admin/sub-admins" element={<SubAdmins />} />
          <Route path="/super-admin/system-logs" element={<SystemLogs />} />
        </Route>

        {/* Super Admin Application Details (Full Page) */}
        <Route path="/super-admin/applications/:id" element={<ApplicationDetails />} />
        <Route path="/super-admin/institutions/:id" element={<InstitutionDetails />} />

        {/* School Admin Routes */}
        <Route element={
          <DashboardLayout 
            sidebarItems={schoolAdminItems}
            role="School Admin"
            roleSubtitle="Administrator"
            userInitials="AD"
            sidebarTitle="School Name"
            sidebarLogo={<GraduationCap className="w-5 h-5 fill-current" />}
          >
            <Outlet />
          </DashboardLayout>
        }>
          <Route path="/school-admin/dashboard" element={<SchoolAdminDashboard />} />
          
          {/* Admissions */}
          <Route path="/school-admin/admissions/configure" element={<ConfigureAdmissions />} />
          <Route path="/school-admin/admissions/create" element={<CreateAdmission />} />
          <Route path="/school-admin/admissions/imports" element={<MultipleImports />} />

          {/* Academics */}
          <Route path="/school-admin/academics/configure" element={<ConfigureAcademic />} />
          <Route path="/school-admin/academics/courses" element={<CourseManagement />} />
          <Route path="/school-admin/academics/registration" element={<CourseRegistration />} />
          <Route path="/school-admin/academics/calendar" element={<AcademicCalendar />} />

          {/* Examinations */}
          <Route path="/school-admin/examinations/assessment-config" element={<AssessmentConfiguration />} />
          <Route path="/school-admin/examinations/exam-creation" element={<ExamCreation />} />
          <Route path="/school-admin/examinations/results-entry" element={<ResultsEntry />} />
          <Route path="/school-admin/examinations/result-publication" element={<ResultPublication />} />

          {/* Student Management */}
          <Route path="/school-admin/students/list" element={<StudentList />} />
          <Route path="/school-admin/students/profile" element={<StudentProfile />} />

          {/* Teacher Management */}
          <Route path="/school-admin/teachers/list" element={<TeacherList />} />
          <Route path="/school-admin/teachers/profile" element={<TeacherProfile />} />

          {/* Staff Management */}
          <Route path="/school-admin/staff/list" element={<StaffList />} />
          <Route path="/school-admin/staff/profile" element={<StaffProfile />} />
        </Route>

      </Routes>
    </Router>
  );
}

export default App;
