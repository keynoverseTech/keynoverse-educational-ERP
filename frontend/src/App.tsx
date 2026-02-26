import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import {
  LayoutDashboard,
  Building2,
  BookOpen,
  UserPlus,
  ClipboardCheck,
  GraduationCap,
  Briefcase,
  Calendar,
  Users,
  FileText,
  Shield,
  Settings as SettingsIcon
} from 'lucide-react';
import './App.css';

// Layouts
import DashboardLayout from './layouts/DashboardLayout';

// Pages
import AuthSelection from './pages/auth/AuthSelection';
import SuperAdminLogin from './pages/auth/SuperAdminLogin';
import SchoolAdminLogin from './pages/auth/SchoolAdminLogin';
import BasicReports from './pages/school-admin/reports/BasicReports';
import Settings from './pages/school-admin/settings-modules/Settings';

// Super Admin Pages
import SuperAdminDashboard from './pages/super-admin/Dashboard';
import Institutions from './pages/super-admin/Institutions';
import NewRegistration from './pages/super-admin/NewRegistration';
import Applications from './pages/super-admin/Applications';
import ApplicationDetails from './pages/super-admin/ApplicationDetails';
import InstitutionDetails from './pages/super-admin/InstitutionDetails';
import InstitutionConfig from './pages/super-admin/InstitutionConfig';
import SubAdmins from './pages/super-admin/SubAdmins';
import SystemLogs from './pages/super-admin/SystemLogs';
import AdmissionsGovernance from './pages/super-admin/AdmissionsGovernance';
import ProgramGovernance from './pages/super-admin/ProgramGovernance';
import ReportsLayout from './pages/super-admin/reports/ReportsLayout';

// School Admin Pages
import SchoolAdminDashboard from './pages/school-admin/Dashboard';
import StudentPortalDashboard from './pages/student-portal/Dashboard';
import StaffPortalDashboard from './pages/staff-portal/Dashboard';
// Admissions
import AdmissionsDashboard from './pages/school-admin/admissions/AdmissionsDashboard';
import ApplicantProfile from './pages/school-admin/admissions/ApplicantProfile';
import ConfigureAdmissions from './pages/school-admin/admissions/ConfigureAdmissions';
import CreateAdmission from './pages/school-admin/admissions/CreateAdmission';
import MultipleImports from './pages/school-admin/admissions/MultipleImports';
import AdmissionIntake from './pages/school-admin/admissions/AdmissionIntake';
// Academics
import ConfigureAcademic from './pages/school-admin/academics/ConfigureAcademic';
import { AcademicDashboard } from './pages/school-admin/academics/AcademicDashboard';
import { SessionsPage } from './pages/school-admin/academics/modules/SessionsPage';
import { SemestersPage } from './pages/school-admin/academics/modules/SemestersPage';
import { FacultiesPage } from './pages/school-admin/academics/modules/FacultiesPage';
import { DepartmentsPage } from './pages/school-admin/academics/modules/DepartmentsPage';
import { ProgrammesPage } from './pages/school-admin/academics/modules/ProgrammesPage';
import { LevelsPage } from './pages/school-admin/academics/modules/LevelsPage';
import { CoursesPage } from './pages/school-admin/academics/modules/CoursesPage';
import CourseRegistrationConfig from './pages/school-admin/academics/modules/CourseRegistrationConfig';
import RegistrationApprovals from './pages/school-admin/academics/RegistrationApprovals';
import CourseManagement from './pages/school-admin/Courses'; // Reusing existing
import CourseRegistration from './pages/school-admin/academics/CourseRegistration';
import LecturesTimetable from './pages/school-admin/academics/LecturesTimetable';
import AcademicCalendar from './pages/school-admin/academics/AcademicCalendar';
import LevelPromotion from './pages/school-admin/academics/LevelPromotion';
// Examinations
import AssessmentConfiguration from './pages/school-admin/examinations/AssessmentConfiguration';
import ExaminationDashboard from './pages/school-admin/examinations/ExaminationDashboard';
import ExamCycleSetup from './pages/school-admin/examinations/ExamCycleSetup';
import TimetableScheduling from './pages/school-admin/examinations/TimetableScheduling';
import ScoreUpload from './pages/school-admin/examinations/ScoreUpload';
import ResultProcessing from './pages/school-admin/examinations/ResultProcessing';
import ResultPublication from './pages/school-admin/examinations/ResultPublication';
// Students
import StudentProfile from './pages/school-admin/students/StudentProfile';
import StudentList from './pages/school-admin/students/StudentList';
import CreateStudent from './pages/school-admin/students/CreateStudent';
// Staff
import StaffProfile from './pages/school-admin/HumanResources/StaffProfile';
import CreateStaff from './pages/school-admin/HumanResources/CreateStaff';
import StaffGrading from './pages/staff-portal/StaffGrading';
import { HRProvider } from './state/hrAccessControl';

import HRDashboard from './pages/school-admin/HumanResources/HRDashboard';
import HRConfig from './pages/school-admin/HumanResources/HRConfig';
import PermissionsManagement from './pages/school-admin/HumanResources/PermissionsManagement';
import LeaveRequest from './pages/school-admin/HumanResources/LeaveRequest';
import LeaveApprovals from './pages/school-admin/HumanResources/LeaveApprovals';

// Finance
import FinanceDashboard from './pages/school-admin/finance/FinanceDashboard';
import FeeStructurePage from './pages/school-admin/finance/FeeStructurePage';
import InvoicesPage from './pages/school-admin/finance/InvoicesPage';
import PaymentsPage from './pages/school-admin/finance/PaymentsPage';
import PayrollScaffold from './pages/school-admin/finance/PayrollScaffold';
import { FinanceProvider } from './state/financeContext';
import { DollarSign } from 'lucide-react';

const superAdminItems = [
  { name: 'Overview', path: '/super-admin/dashboard', icon: LayoutDashboard },
  { 
    name: 'Registrations', 
    path: '/super-admin/applications',
    icon: ClipboardCheck 
  },
  { 
    name: 'All Institutes', 
    path: '/super-admin/institutions',
    icon: Building2
  },
  { 
    name: 'Configuration', 
    path: '/super-admin/config',
    icon: SettingsIcon 
  },
  { 
    name: 'Admissions Governance', 
    path: '/super-admin/admissions-governance',
    icon: Shield 
  },
  { 
    name: 'Program Governance', 
    path: '/super-admin/academic-catalog',
    icon: BookOpen 
  },
  { 
    name: 'Reports', 
    path: '/super-admin/reports',
    icon: FileText 
  },
];

const schoolAdminItems = [
  { name: 'Overview', path: '/school-admin/dashboard', icon: LayoutDashboard },
  { 
    name: 'Academics', 
    icon: BookOpen,
    subItems: [
      { name: 'Dashboard', path: '/school-admin/academics/dashboard' },
      { name: 'Configure Academic', path: '/school-admin/academics/configure' },
      { name: 'Course Management', path: '/school-admin/academics/courses' },
      { name: 'Course Registration', path: '/school-admin/academics/registration' },
      { name: 'Level Promotion', path: '/school-admin/academics/promotion' },
      { name: 'Academic Calendar', path: '/school-admin/academics/calendar' }
    ]
  },
  { 
    name: 'Admissions', 
    icon: UserPlus,
    subItems: [
      { name: 'Dashboard', path: '/school-admin/admissions/dashboard' },
      { name: 'Configure Admissions', path: '/school-admin/admissions/configure' },
      { name: 'Intake Management', path: '/school-admin/admissions/intake' },
      { name: 'Create Admission', path: '/school-admin/admissions/create' },
      { name: 'Multiple Imports', path: '/school-admin/admissions/imports' }
    ]
  },
  { 
    name: 'Examinations', 
    icon: ClipboardCheck,
    subItems: [
      { name: 'Dashboard', path: '/school-admin/examinations/dashboard' },
      { name: 'Exam Cycle', path: '/school-admin/examinations/cycle' },
      { name: 'Configuration', path: '/school-admin/examinations/assessment-config' },
      { name: 'Timetable', path: '/school-admin/examinations/timetable' },
      { name: 'Score Upload', path: '/school-admin/examinations/scores' },
      { name: 'Result Processing', path: '/school-admin/examinations/processing' },
      { name: 'Publication', path: '/school-admin/examinations/publication' },
    ]
  },
  { 
    name: 'Student Management', 
    icon: GraduationCap,
    subItems: [
      { name: 'All Students', path: '/school-admin/students/list' },
      { name: 'Student Profile', path: '/school-admin/students/profile' }
    ]
  },
  { 
    name: 'Finance', 
    icon: DollarSign,
    subItems: [
      { name: 'Dashboard', path: '/school-admin/finance/dashboard' },
      { name: 'Fee Structure', path: '/school-admin/finance/fee-structure' },
      { name: 'Invoices', path: '/school-admin/finance/invoices' },
      { name: 'Payments & Receipts', path: '/school-admin/finance/payments' },
      { name: 'Payroll Management', path: '/school-admin/finance/payroll' }
    ]
  },
  { 
    name: 'Reports', 
    path: '/school-admin/reports', 
    icon: FileText,
    subItems: [
      { name: 'Report Dashboard', path: '/school-admin/reports' },
      { name: 'Admission Reports', path: '/school-admin/reports?tab=admissions' },
      { name: 'Student Reports', path: '/school-admin/reports?tab=students' },
      { name: 'Academic Performance', path: '/school-admin/reports?tab=academics' },
      { name: 'Examination Reports', path: '/school-admin/reports?tab=exams' },
      { name: 'Financial Reports', path: '/school-admin/reports?tab=finance' }
    ]
  },
  { 
    name: 'Human Resources', 
    icon: Briefcase,
    subItems: [
      { name: 'HR Dashboard', path: '/school-admin/human-resources/dashboard' },
      { name: 'Staff Profile', path: '/school-admin/staff/profile' },
      { name: 'Add Staff', path: '/school-admin/staff/create' },
      { name: 'Leave Request', path: '/school-admin/human-resources/leave/request' },
      { name: 'Leave Approvals', path: '/school-admin/human-resources/leave/approvals' },
      { name: 'Configuration', path: '/school-admin/human-resources/config' }
    ]
  },
  { 
    name: 'Settings', 
    icon: SettingsIcon,
    subItems: [
      { name: 'General Settings', path: '/school-admin/settings' }
    ]
  }
];

const studentItems = [
  { name: 'Dashboard', path: '/student/dashboard', icon: LayoutDashboard },
  { name: 'My Courses', path: '/student/courses', icon: BookOpen },
  { name: 'Results', path: '/student/results', icon: ClipboardCheck },
  { name: 'Timetable', path: '/student/timetable', icon: Calendar },
  { name: 'Fees', path: '/student/fees', icon: Briefcase }, // Using Briefcase as generic icon for now
  { name: 'Profile', path: '/student/profile', icon: Users },
];

const staffItems = [
  { name: 'Dashboard', path: '/staff/dashboard', icon: LayoutDashboard },
  { name: 'My Classes', path: '/staff/classes', icon: Users },
  { name: 'Grading', path: '/staff/grading', icon: ClipboardCheck },
  { name: 'Timetable', path: '/staff/timetable', icon: Calendar },
  { name: 'Profile', path: '/staff/profile', icon: Briefcase },
];

function App() {
  return (
    <HRProvider>
      <FinanceProvider>
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
          <Route path="/super-admin/admissions-governance" element={<AdmissionsGovernance />} />
          <Route path="/super-admin/academic-catalog" element={<ProgramGovernance />} />
          <Route path="/super-admin/system-logs" element={<SystemLogs />} />
          <Route path="/super-admin/config" element={<InstitutionConfig />} />
          <Route path="/super-admin/reports" element={<ReportsLayout />} />
        </Route>

        {/* Super Admin Application Details (Full Page) */}
        <Route path="/super-admin/applications/:id" element={<ApplicationDetails />} />
        <Route path="/super-admin/institutions/:id" element={<InstitutionDetails />} />

        {/* School Admin Routes */}
        <Route
          element={
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
          }
        >
          <Route path="/school-admin/dashboard" element={<SchoolAdminDashboard />} />

          {/* Admissions */}
          <Route path="/school-admin/admissions/dashboard" element={<AdmissionsDashboard />} />
          <Route path="/school-admin/admissions/intake" element={<AdmissionIntake />} />
          <Route path="/school-admin/admissions/profile/:id" element={<ApplicantProfile />} />
          <Route path="/school-admin/admissions/configure" element={<ConfigureAdmissions />} />
          <Route path="/school-admin/admissions/create" element={<CreateAdmission />} />
          <Route path="/school-admin/admissions/imports" element={<MultipleImports />} />

          {/* Academics */}
          <Route path="/school-admin/academics/dashboard" element={<AcademicDashboard />} />
          <Route path="/school-admin/academics/configure" element={<ConfigureAcademic />} />
          <Route path="/school-admin/academics/sessions" element={<SessionsPage />} />
          <Route path="/school-admin/academics/semesters" element={<SemestersPage />} />
          <Route path="/school-admin/academics/faculties" element={<FacultiesPage />} />
          <Route path="/school-admin/academics/departments" element={<DepartmentsPage />} />
          <Route path="/school-admin/academics/programmes" element={<ProgrammesPage />} />
          <Route path="/school-admin/academics/levels" element={<LevelsPage />} />
          <Route path="/school-admin/academics/courses" element={<CoursesPage />} />
          <Route path="/school-admin/academics/registration-config" element={<CourseRegistrationConfig />} />
          <Route path="/school-admin/academics/registration-approvals" element={<RegistrationApprovals />} />
          <Route path="/school-admin/academics/courses-management" element={<CourseManagement />} />
          <Route path="/school-admin/academics/lectures-timetable" element={<LecturesTimetable />} />
          <Route path="/school-admin/academics/registration" element={<CourseRegistration />} />
          <Route path="/school-admin/academics/promotion" element={<LevelPromotion />} />
          <Route path="/school-admin/academics/calendar" element={<AcademicCalendar />} />

          {/* Examinations */}
          <Route path="/school-admin/examinations/dashboard" element={<ExaminationDashboard />} />
          <Route path="/school-admin/examinations/cycle" element={<ExamCycleSetup />} />
          <Route path="/school-admin/examinations/timetable" element={<TimetableScheduling />} />
          <Route path="/school-admin/examinations/scores" element={<ScoreUpload />} />
          <Route path="/school-admin/examinations/processing" element={<ResultProcessing />} />
          <Route path="/school-admin/examinations/publication" element={<ResultPublication />} />
          <Route path="/school-admin/examinations/assessment-config" element={<AssessmentConfiguration />} />

          {/* Student Management */}
          <Route path="/school-admin/students/list" element={<StudentList />} />
          <Route path="/school-admin/students/profile" element={<StudentProfile />} />
          <Route path="/school-admin/students/create" element={<CreateStudent />} />

          {/* Staff Management */}
          <Route path="/school-admin/staff/profile" element={<StaffProfile />} />
          <Route path="/school-admin/staff/create" element={<CreateStaff />} />

          {/* HR */}
          <Route path="/school-admin/human-resources/dashboard" element={<HRDashboard />} />
          <Route path="/school-admin/human-resources/config" element={<HRConfig />} />
          <Route path="/school-admin/human-resources/permissions" element={<PermissionsManagement />} />
          {/* LeaveTypes is now a tab in HRConfig */}
          <Route path="/school-admin/human-resources/leave/request" element={<LeaveRequest />} />
          <Route path="/school-admin/human-resources/leave/approvals" element={<LeaveApprovals />} />

          {/* Finance */}
          <Route path="/school-admin/finance/dashboard" element={<FinanceDashboard />} />
          <Route path="/school-admin/finance/fee-structure" element={<FeeStructurePage />} />
          <Route path="/school-admin/finance/invoices" element={<InvoicesPage />} />
          <Route path="/school-admin/finance/payments" element={<PaymentsPage />} />
          <Route path="/school-admin/finance/payroll" element={<PayrollScaffold />} />

          {/* Other Pages */}
          <Route path="/school-admin/reports" element={<BasicReports />} />
          <Route path="/school-admin/settings" element={<Settings />} />
        </Route>

        {/* Student Portal Routes */}
        <Route element={
          <DashboardLayout 
            sidebarItems={studentItems}
            role="Student"
            roleSubtitle="Undergraduate"
            userInitials="SJ"
            sidebarTitle="Student Portal"
            sidebarLogo={<GraduationCap className="w-5 h-5 fill-current" />}
          >
            <Outlet />
          </DashboardLayout>
        }>
          <Route path="/student/dashboard" element={<StudentPortalDashboard />} />
          {/* Add other student routes here as placeholders for now */}
        </Route>

        {/* Staff Portal Routes */}
        <Route
          element={
            <DashboardLayout
              sidebarItems={staffItems}
              role="Staff"
              roleSubtitle="Academic Staff"
              userInitials="DS"
              sidebarTitle="Staff Portal"
              sidebarLogo={<Briefcase className="w-5 h-5 fill-current" />}
            >
              <Outlet />
            </DashboardLayout>
          }
        >
          <Route path="/staff/dashboard" element={<StaffPortalDashboard />} />
          <Route path="/staff/grading" element={<StaffGrading />} />
          <Route path="/staff/score-upload" element={<ScoreUpload />} />
          {/* Add other staff routes here as placeholders for now */}
        </Route>

        </Routes>
        </Router>
      </FinanceProvider>
    </HRProvider>
  );
}

export default App;
