import React, { Suspense, lazy } from 'react';
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
  Settings as SettingsIcon,
  DollarSign
} from 'lucide-react';
import './App.css';

// Context Providers
import { HRProvider } from './state/hrAccessControl';
import { FinanceProvider } from './state/financeContext';

// Components
import LoadingFallback from './components/LoadingFallback';

// Layouts
import DashboardLayout from './layouts/DashboardLayout';

// Lazy Load Pages
// Auth
const AuthSelection = lazy(() => import('./pages/auth/AuthSelection'));
const SuperAdminLogin = lazy(() => import('./pages/auth/SuperAdminLogin'));
const SchoolAdminLogin = lazy(() => import('./pages/auth/SchoolAdminLogin'));

// Super Admin
const SuperAdminDashboard = lazy(() => import('./pages/super-admin/Dashboard'));
const Institutions = lazy(() => import('./pages/super-admin/Institutions'));
const NewRegistration = lazy(() => import('./pages/super-admin/NewRegistration'));
const Applications = lazy(() => import('./pages/super-admin/Applications'));
const ApplicationDetails = lazy(() => import('./pages/super-admin/ApplicationDetails'));
const InstitutionDetails = lazy(() => import('./pages/super-admin/InstitutionDetails'));
const InstitutionConfig = lazy(() => import('./pages/super-admin/InstitutionConfig'));
const SubAdmins = lazy(() => import('./pages/super-admin/SubAdmins'));
const SystemLogs = lazy(() => import('./pages/super-admin/SystemLogs'));
const AdmissionsGovernance = lazy(() => import('./pages/super-admin/AdmissionsGovernance'));
const ProgramGovernance = lazy(() => import('./pages/super-admin/ProgramGovernance'));
const ReportsLayout = lazy(() => import('./pages/super-admin/reports/ReportsLayout'));

// School Admin - General
const SchoolAdminDashboard = lazy(() => import('./pages/school-admin/Dashboard'));
const BasicReports = lazy(() => import('./pages/school-admin/reports/BasicReports'));
const Settings = lazy(() => import('./pages/school-admin/settings-modules/Settings'));

// School Admin - Admissions
const AdmissionsDashboard = lazy(() => import('./pages/school-admin/admissions/AdmissionsDashboard'));
const ApplicantProfile = lazy(() => import('./pages/school-admin/admissions/ApplicantProfile'));
const ConfigureAdmissions = lazy(() => import('./pages/school-admin/admissions/ConfigureAdmissions'));
const CreateAdmission = lazy(() => import('./pages/school-admin/admissions/CreateAdmission'));
const MultipleImports = lazy(() => import('./pages/school-admin/admissions/MultipleImports'));
const AdmissionIntake = lazy(() => import('./pages/school-admin/admissions/AdmissionIntake'));

// School Admin - Academics
const ConfigureAcademic = lazy(() => import('./pages/school-admin/academics/ConfigureAcademic'));
const AcademicDashboard = lazy(() => import('./pages/school-admin/academics/AcademicDashboard').then(module => ({ default: module.AcademicDashboard })));
const SessionsPage = lazy(() => import('./pages/school-admin/academics/modules/SessionsPage').then(module => ({ default: module.SessionsPage })));
const SemestersPage = lazy(() => import('./pages/school-admin/academics/modules/SemestersPage').then(module => ({ default: module.SemestersPage })));
const FacultiesPage = lazy(() => import('./pages/school-admin/academics/modules/FacultiesPage').then(module => ({ default: module.FacultiesPage })));
const DepartmentsPage = lazy(() => import('./pages/school-admin/academics/modules/DepartmentsPage').then(module => ({ default: module.DepartmentsPage })));
const ProgrammesPage = lazy(() => import('./pages/school-admin/academics/modules/ProgrammesPage').then(module => ({ default: module.ProgrammesPage })));
const LevelsPage = lazy(() => import('./pages/school-admin/academics/modules/LevelsPage').then(module => ({ default: module.LevelsPage })));
const CoursesPage = lazy(() => import('./pages/school-admin/academics/modules/CoursesPage').then(module => ({ default: module.CoursesPage })));
const CourseRegistrationConfig = lazy(() => import('./pages/school-admin/academics/modules/CourseRegistrationConfig'));
const RegistrationApprovals = lazy(() => import('./pages/school-admin/academics/RegistrationApprovals'));
const CourseManagement = lazy(() => import('./pages/school-admin/Courses'));
const CourseRegistration = lazy(() => import('./pages/school-admin/academics/CourseRegistration'));
const LecturesTimetable = lazy(() => import('./pages/school-admin/academics/LecturesTimetable'));
const AcademicCalendar = lazy(() => import('./pages/school-admin/academics/AcademicCalendar'));
const LevelPromotion = lazy(() => import('./pages/school-admin/academics/LevelPromotion'));

// School Admin - Examinations
const AssessmentConfiguration = lazy(() => import('./pages/school-admin/examinations/AssessmentConfiguration'));
const ExaminationDashboard = lazy(() => import('./pages/school-admin/examinations/ExaminationDashboard'));
const ExamCycleSetup = lazy(() => import('./pages/school-admin/examinations/ExamCycleSetup'));
const TimetableScheduling = lazy(() => import('./pages/school-admin/examinations/TimetableScheduling'));
const ScoreUpload = lazy(() => import('./pages/school-admin/examinations/ScoreUpload'));
const ResultProcessing = lazy(() => import('./pages/school-admin/examinations/ResultProcessing'));
const ResultPublication = lazy(() => import('./pages/school-admin/examinations/ResultPublication'));

// School Admin - Students
const StudentProfile = lazy(() => import('./pages/school-admin/students/StudentProfile'));
const StudentList = lazy(() => import('./pages/school-admin/students/StudentList'));
const CreateStudent = lazy(() => import('./pages/school-admin/students/CreateStudent'));

// School Admin - Staff / HR
const StaffProfile = lazy(() => import('./pages/school-admin/HumanResources/StaffProfile'));
const CreateStaff = lazy(() => import('./pages/school-admin/HumanResources/CreateStaff'));
const HRDashboard = lazy(() => import('./pages/school-admin/HumanResources/HRDashboard'));
const HRConfig = lazy(() => import('./pages/school-admin/HumanResources/HRConfig'));
const PermissionsManagement = lazy(() => import('./pages/school-admin/HumanResources/PermissionsManagement'));
const LeaveRequest = lazy(() => import('./pages/school-admin/HumanResources/LeaveRequest'));
const LeaveApprovals = lazy(() => import('./pages/school-admin/HumanResources/LeaveApprovals'));

// School Admin - Finance
const GeneralLedgerPage = lazy(() => import('./pages/school-admin/finance/administrative-accounting/GeneralLedger'));
const PayrollDisbursementPage = lazy(() => import('./pages/school-admin/finance/administrative-accounting/PayrollDisbursement'));
const AccountsPage = lazy(() => import('./pages/school-admin/finance/AccountsPage'));
const StudentFinanceDashboard = lazy(() => import('./pages/school-admin/finance/student-accounting/FinanceDashboard'));
const StudentFeeConfigurationPage = lazy(() => import('./pages/school-admin/finance/student-accounting/FeeConfigurationPage'));
const StudentInvoicesPage = lazy(() => import('./pages/school-admin/finance/student-accounting/InvoicesPage'));
const StudentInvoiceDetailsPage = lazy(() => import('./pages/school-admin/finance/student-accounting/InvoiceDetailsPage'));
const StudentPaymentsPage = lazy(() => import('./pages/school-admin/finance/student-accounting/PaymentsPage'));

// Portals
const StudentPortalDashboard = lazy(() => import('./pages/student-portal/Dashboard'));
const StaffPortalDashboard = lazy(() => import('./pages/staff-portal/Dashboard'));
const StaffGrading = lazy(() => import('./pages/staff-portal/StaffGrading'));

// Navigation Config
const superAdminItems = [
  { name: 'Overview', path: '/super-admin/dashboard', icon: LayoutDashboard },
  { name: 'Registrations', path: '/super-admin/applications', icon: ClipboardCheck },
  { name: 'All Institutes', path: '/super-admin/institutions', icon: Building2 },
  { name: 'Configuration', path: '/super-admin/config', icon: SettingsIcon },
  { name: 'Admissions Governance', path: '/super-admin/admissions-governance', icon: Shield },
  { name: 'Program Governance', path: '/super-admin/academic-catalog', icon: BookOpen },
  { name: 'Reports', path: '/super-admin/reports', icon: FileText },
];

const schoolAdminItems = [
  { name: 'Overview', path: '/school-admin/dashboard', icon: LayoutDashboard },
  { 
    name: 'Academics', 
    icon: BookOpen,
    subItems: [
      { name: 'Dashboard', path: '/school-admin/academics/dashboard' },
      { name: 'Configure Academic', path: '/school-admin/academics/configure' },
      { name: 'Course Management', path: '/school-admin/academics/courses-management' },
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
      {
        name: 'Student Accounting',
        subItems: [
          { name: 'Dashboard', path: '/school-admin/finance/student-accounting/dashboard' },
          { name: 'Fee Configuration', path: '/school-admin/finance/student-accounting/fee-structure' },
          { name: 'Invoices', path: '/school-admin/finance/student-accounting/invoices' },
          { name: 'Payments & Receipts', path: '/school-admin/finance/student-accounting/payments' },
        ]
      },
      {
        name: 'Administrative Accounting',
        subItems: [
          { name: 'General Ledger', path: '/school-admin/finance/administrative-accounting/ledger' },
          { name: 'Payroll Disbursement', path: '/school-admin/finance/administrative-accounting/disbursement' }
        ]
      },
      { name: 'Bank Accounts', path: '/school-admin/finance/accounts' }
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
  { name: 'Fees', path: '/student/fees', icon: Briefcase },
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
          <Suspense fallback={<LoadingFallback />}>
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
                <Route path="/school-admin/human-resources/leave/request" element={<LeaveRequest />} />
                <Route path="/school-admin/human-resources/leave/approvals" element={<LeaveApprovals />} />

                {/* Finance - Student Accounting */}
                <Route path="/school-admin/finance/student-accounting/dashboard" element={<StudentFinanceDashboard />} />
                <Route path="/school-admin/finance/student-accounting/fee-structure" element={<StudentFeeConfigurationPage />} />
                <Route path="/school-admin/finance/student-accounting/invoices" element={<StudentInvoicesPage />} />
                <Route path="/school-admin/finance/student-accounting/invoices/:id" element={<StudentInvoiceDetailsPage />} />
                <Route path="/school-admin/finance/student-accounting/payments" element={<StudentPaymentsPage />} />

                {/* Finance - Administrative Accounting */}
                <Route path="/school-admin/finance/administrative-accounting/ledger" element={<GeneralLedgerPage />} />
                <Route path="/school-admin/finance/administrative-accounting/disbursement" element={<PayrollDisbursementPage />} />
                
                <Route path="/school-admin/finance/accounts" element={<AccountsPage />} />
                
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
              </Route>
            </Routes>
          </Suspense>
        </Router>
      </FinanceProvider>
    </HRProvider>
  );
}

export default App;
