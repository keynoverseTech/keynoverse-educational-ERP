import { Suspense, lazy } from 'react';
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
  Settings as SettingsIcon,
  DollarSign,
  MessageSquare,
  Bus,
  CreditCard,
  IdCard,
  Stethoscope,
  ShoppingBag
} from 'lucide-react';
import './App.css';

// Context Providers
import { AuthProvider } from './state/authContext';
import { HRProvider } from './state/hrAccessControl';
import { FinanceProvider } from './state/financeProvider';
import { LibraryProvider } from './state/libraryProvider';
import { HostelProvider } from './state/hostelContext';
import { TransportProvider } from './state/transportContext';
import { StudentPortalFinanceProvider } from './state/studentPortalFinanceContext';
import { EventsProvider } from './state/eventsProvider';
import { AlumniProvider } from './state/alumniState';
import { ReceptionProvider } from './state/receptionContext';
import { AttendanceProvider } from './state/academics/attendanceContext';
import { HelpDeskProvider } from './state/helpdeskContext';

// Components
import LoadingFallback from './components/LoadingFallback';

// Layouts
import DashboardLayout from './layouts/DashboardLayout';
import FullScreenLayout from './layouts/FullScreenLayout';

// Lazy Load Pages
// Auth
const AuthSelection = lazy(() => import('./pages/auth/AuthSelection'));
const SuperAdminLogin = lazy(() => import('./pages/auth/SuperAdminLogin'));
const SchoolAdminLogin = lazy(() => import('./pages/auth/SchoolAdminLogin'));
const StudentLogin = lazy(() => import('./pages/auth/StudentLogin'));

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
const ProgramGovernance = lazy(() => import('./pages/super-admin/ProgramGovernance'));
const ReportsLayout = lazy(() => import('./pages/super-admin/reports/ReportsLayout'));
const SuperAdminFinanceDashboard = lazy(() => import('./pages/super-admin/finance/FinanceDashboard'));
const SuperAdminRevenue = lazy(() => import('./pages/super-admin/finance/Revenue'));
const SuperAdminSubscriptionPlans = lazy(() => import('./pages/super-admin/finance/SubscriptionPlans'));
const SuperAdminAcademicsOverview = lazy(() => import('./pages/super-admin/institution-tabs/academics-overview/AcademicsOverviewDashboard'));
const SuperAdminHROverview = lazy(() => import('./pages/super-admin/institution-tabs/hr-overview/HROverviewDashboard'));
const SuperAdminAssesmentAndResult = lazy(() => import('./pages/super-admin/institution-tabs/assesment-and-result/AssesmentAndResultDashboard'));
const SuperAdminStaffProfile = lazy(() => import('./pages/super-admin/institution-tabs/hr-overview/StaffProfile'));
const SuperAdminExamDetails = lazy(() => import('./pages/super-admin/institution-tabs/assesment-and-result/ExamDetails'));
const SuperAdminResultDetails = lazy(() => import('./pages/super-admin/institution-tabs/assesment-and-result/ResultDetails'));
const SuperAdminFinanceOverview = lazy(() => import('./pages/super-admin/institution-tabs/finance-overview/FinanceOverviewDashboard'));

// School Admin - General
const SchoolAdminDashboard = lazy(() => import('./pages/school-admin/Dashboard'));
const BasicReports = lazy(() => import('./pages/school-admin/reports/BasicReports'));
const Settings = lazy(() => import('./pages/school-admin/settings-modules/Settings'));
const SubscriptionPage = lazy(() => import('./pages/school-admin/subscription/SubscriptionPage'));
const HealthDashboard = lazy(() => import('./pages/school-admin/health-clinic/HealthDashboard'));

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
const CoursePrerequisites = lazy(() => import('./pages/school-admin/academics/CoursePrerequisites'));
const CourseMaterialsDashboard = lazy(() => import('./pages/school-admin/academics/modules/CourseMaterials/CourseMaterialsDashboard'));
const ArchivedMaterials = lazy(() => import('./pages/school-admin/academics/modules/CourseMaterials/ArchivedMaterials'));
const DownloadLog = lazy(() => import('./pages/school-admin/academics/modules/CourseMaterials/DownloadLog'));
const RegistrationApprovals = lazy(() => import('./pages/school-admin/academics/RegistrationApprovals'));
const CourseRegistration = lazy(() => import('./pages/school-admin/academics/CourseRegistration'));
const LecturesTimetable = lazy(() => import('./pages/school-admin/academics/LecturesTimetable'));
const AcademicCalendar = lazy(() => import('./pages/school-admin/academics/AcademicCalendar'));
const LevelPromotion = lazy(() => import('./pages/school-admin/academics/LevelPromotion'));
const AttendanceDashboard = lazy(() => import('./pages/school-admin/academics/attendance/AttendanceDashboard'));
const MarkAttendance = lazy(() => import('./pages/school-admin/academics/attendance/MarkAttendance'));
const AttendanceReport = lazy(() => import('./pages/school-admin/academics/attendance/AttendanceReport'));
const CGPAMonitoring = lazy(() => import('./pages/school-admin/academics/CGPAMonitoring'));

// School Admin - Help Desk
const HelpDeskDashboard = lazy(() => import('./pages/school-admin/Help Desk/HelpDeskDashboard'));
const TicketCategories = lazy(() => import('./pages/school-admin/Help Desk/TicketCategories'));
const CreateTicket = lazy(() => import('./pages/school-admin/Help Desk/CreateTicket'));
const TicketWorkflow = lazy(() => import('./pages/school-admin/Help Desk/TicketWorkflow'));

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
const StaffSchedules = lazy(() => import('./pages/school-admin/HumanResources/StaffSchedules'));
const PermissionsManagement = lazy(() => import('./pages/school-admin/HumanResources/PermissionsManagement'));
const LeaveRequest = lazy(() => import('./pages/school-admin/HumanResources/LeaveRequest'));
const LeaveApprovals = lazy(() => import('./pages/school-admin/HumanResources/LeaveApprovals'));
const SalaryAdjustments = lazy(() => import('./pages/school-admin/HumanResources/SalaryAdjustments'));
const SalaryAdvances = lazy(() => import('./pages/school-admin/HumanResources/SalaryAdvances'));
const PayrollManagement = lazy(() => import('./pages/school-admin/HumanResources/PayrollManagement'));

// School Admin - Communication Centre
const AnnouncementsPage = lazy(() => import('./pages/school-admin/communication-centre/Announcements'));
const DirectMessagingPage = lazy(() => import('./pages/school-admin/communication-centre/DirectMessaging'));
const InboxPage = lazy(() => import('./pages/school-admin/communication-centre/Inbox').then(module => ({ default: module.default })));

// School Admin - Library
const LibraryDashboardPage = lazy(() => import('./pages/school-admin/library/LibraryDashboard'));
const BookCatalogPage = lazy(() => import('./pages/school-admin/library/BookCatalog'));
const BookCategoriesPage = lazy(() => import('./pages/school-admin/library/BookCategories'));
const BorrowingSystemPage = lazy(() => import('./pages/school-admin/library/BorrowingSystem'));
const ReservationSystemPage = lazy(() => import('./pages/school-admin/library/ReservationSystem'));

// School Admin - Events
const EventsDashboardPage = lazy(() => import('./pages/school-admin/events/EventsDashboard'));
const EventCategoriesPage = lazy(() => import('./pages/school-admin/events/EventCategories'));
const CreateEventPage = lazy(() => import('./pages/school-admin/events/CreateEvent'));
const UpcomingEventsPage = lazy(() => import('./pages/school-admin/events/UpcomingEvents'));

// School Admin - Alumni
const AlumniDashboard = lazy(() => import('./pages/school-admin/Alumni/AlumniDashboard'));
const AlumniList = lazy(() => import('./pages/school-admin/Alumni/AlumniList'));
const AlumniProfile = lazy(() => import('./pages/school-admin/Alumni/AlumniProfile'));
const EmploymentInfo = lazy(() => import('./pages/school-admin/Alumni/EmploymentInfo'));
const TranscriptRequests = lazy(() => import('./pages/school-admin/Alumni/TranscriptRequests'));
const AlumniCommunication = lazy(() => import('./pages/school-admin/Alumni/AlumniCommunication'));

// School Admin - Reception
const VisitorsLog = lazy(() => import('./pages/school-admin/Reception/VisitorsLog'));
const Appointments = lazy(() => import('./pages/school-admin/Reception/Appointments'));
const EnquiriesLog = lazy(() => import('./pages/school-admin/Reception/EnquiriesLog'));
const MailLog = lazy(() => import('./pages/school-admin/Reception/MailLog'));

// School Admin - Finance
const GeneralLedgerPage = lazy(() => import('./pages/school-admin/finance/administrative-accounting/GeneralLedger'));
const PayrollDisbursementPage = lazy(() => import('./pages/school-admin/finance/administrative-accounting/PayrollDisbursement'));
const AccountsPage = lazy(() => import('./pages/school-admin/finance/AccountsPage'));
const StudentFinanceDashboard = lazy(() => import('./pages/school-admin/finance/student-accounting/FinanceDashboard'));
const StudentFeeConfigurationPage = lazy(() => import('./pages/school-admin/finance/student-accounting/FeeConfigurationPage'));
const StudentInvoicesPage = lazy(() => import('./pages/school-admin/finance/student-accounting/InvoicesPage'));
const StudentInvoiceDetailsPage = lazy(() => import('./pages/school-admin/finance/student-accounting/InvoiceDetailsPage'));
const StudentPaymentsPage = lazy(() => import('./pages/school-admin/finance/student-accounting/PaymentsPage'));

// School Admin - Student Services
const HostelDashboard = lazy(() => import('./pages/school-admin/student-services/hostel/HostelDashboard'));
const HostelRooms = lazy(() => import('./pages/school-admin/student-services/hostel/HostelRooms'));
const HostelAllocations = lazy(() => import('./pages/school-admin/student-services/hostel/HostelAllocations'));
const HostelConfig = lazy(() => import('./pages/school-admin/student-services/hostel/HostelConfig'));

const TransportDashboard = lazy(() => import('./pages/school-admin/student-services/transport/TransportDashboard'));
const TransportRoutes = lazy(() => import('./pages/school-admin/student-services/transport/TransportRoutes'));
const TransportVehicles = lazy(() => import('./pages/school-admin/student-services/transport/TransportVehicles'));
const TransportSubscriptions = lazy(() => import('./pages/school-admin/student-services/transport/TransportSubscriptions'));
const TransportConfig = lazy(() => import('./pages/school-admin/student-services/transport/TransportConfig'));

// School Admin - ID Cards
const StaffIDCardDashboard = lazy(() => import('./pages/school-admin/id-cards/StaffIDCardDashboard'));
const StudentIDCardDashboard = lazy(() => import('./pages/school-admin/id-cards/StudentIDCardDashboard'));
const IDCardTemplateDesigner = lazy(() => import('./pages/school-admin/id-cards/components/IDCardTemplateDesigner'));

// School Admin - Procurement
const ProcurementDashboard = lazy(() => import('./pages/school-admin/procurement/ProcurementDashboard'));
const PurchaseRequests = lazy(() => import('./pages/school-admin/procurement/PurchaseRequests'));
const PurchaseOrders = lazy(() => import('./pages/school-admin/procurement/PurchaseOrders'));
const InventoryManagement = lazy(() => import('./pages/school-admin/procurement/InventoryManagement'));
const AssetManagement = lazy(() => import('./pages/school-admin/procurement/AssetManagement'));

// Portals
const StudentPortalDashboard = lazy(() => import('./pages/student-portal/Dashboard'));
const StudentFeesDashboard = lazy(() => import('./pages/student-portal/fees/FeesDashboard'));
const StudentInvoiceDetails = lazy(() => import('./pages/student-portal/fees/StudentInvoiceDetailsPage'));
const StudentPaymentCheckout = lazy(() => import('./pages/student-portal/fees/PaymentCheckoutPage'));
const StudentPaymentConfirmation = lazy(() => import('./pages/student-portal/fees/PaymentConfirmationPage'));
const StudentReceipts = lazy(() => import('./pages/student-portal/fees/ReceiptsPage'));
const StudentReceiptDetails = lazy(() => import('./pages/student-portal/fees/ReceiptDetailsPage'));
const StudentPaymentHistory = lazy(() => import('./pages/student-portal/fees/PaymentHistoryPage'));
const StudentAcademicsDashboard = lazy(() => import('./pages/student-portal/academics/AcademicsDashboard'));
const StudentAcademicsCourses = lazy(() => import('./pages/student-portal/academics/EnrolledCourses'));
const StudentAcademicsMaterials = lazy(() => import('./pages/student-portal/academics/CourseMaterials'));
const StudentAcademicsResults = lazy(() => import('./pages/student-portal/academics/Results'));
const StudentAcademicsTimetable = lazy(() => import('./pages/student-portal/academics/Timetable'));
const StudentExamsTimetable = lazy(() => import('./pages/student-portal/timetable/ExamTimetablePage'));
const StudentPortalProfile = lazy(() => import('./pages/student-portal/profile/ProfilePage'));
const StudentSubmitTicket = lazy(() => import('./pages/student-portal/helpdesk/SubmitTicket'));
const StudentTickets = lazy(() => import('./pages/student-portal/helpdesk/Tickets'));
const StudentBookCatalog = lazy(() => import('./pages/student-portal/library/StudentBookCatalog'));
const StudentBorrowingHistory = lazy(() => import('./pages/student-portal/library/StudentBorrowingHistory'));
const StaffPortal = lazy(() => import('./pages/staff-portal/StaffPortal'));
// const StaffGrading = lazy(() => import('./pages/staff-portal/StaffGrading'));

// Staff Portal - Academics
const StaffMyCourses = lazy(() => import('./pages/staff-portal/academics/MyCourses'));
const StaffCourseMaterials = lazy(() => import('./pages/staff-portal/academics/CourseMaterials'));
const StaffTimetable = lazy(() => import('./pages/staff-portal/academics/Timetable'));
const StaffAttendance = lazy(() => import('./pages/staff-portal/academics/attendance/AttendanceDashboard'));
const StaffStudents = lazy(() => import('./pages/staff-portal/academics/Students'));

// Staff Portal - Assessment
const StaffMarksEntry = lazy(() => import('./pages/staff-portal/assessment/MarksEntry'));
const StaffExamTimetable = lazy(() => import('./pages/staff-portal/assessment/ExamTimetable'));

// Staff Portal - HR Self Service
const StaffMySalary = lazy(() => import('./pages/staff-portal/hr/MySalary'));
const StaffLeaveRequest = lazy(() => import('./pages/staff-portal/hr/LeaveRequest'));
const StaffSalaryRequests = lazy(() => import('./pages/staff-portal/hr/SalaryRequests'));
const StaffProfileView = lazy(() => import('./pages/staff-portal/hr/ProfileView'));

// Staff Portal - Communication
const StaffInbox = lazy(() => import('./pages/staff-portal/communication/StaffInbox'));
const StaffDirectMessaging = lazy(() => import('./pages/staff-portal/communication/StaffDirectMessaging'));

// Staff Portal - Events
const StaffEvents = lazy(() => import('./pages/staff-portal/events/StaffEvents'));

// Navigation Config
const superAdminItems = [
  { name: 'Overview', path: '/super-admin/dashboard', icon: LayoutDashboard },
  { name: 'Registrations', path: '/super-admin/applications', icon: ClipboardCheck },
  { name: 'All Institutes', path: '/super-admin/institutions', icon: Building2 },
  { name: 'Program Governance', path: '/super-admin/academic-catalog', icon: BookOpen },
  { 
    name: 'Finance', 
    icon: DollarSign, 
    subItems: [
      { name: 'Dashboard', path: '/super-admin/finance/dashboard' },
      { name: 'Revenue', path: '/super-admin/finance/revenue' },
      { name: 'Subscription Plans', path: '/super-admin/finance/plans' }
    ]
  },
  { name: 'Reports', path: '/super-admin/reports', icon: FileText },
  { name: 'Configuration', path: '/super-admin/config', icon: SettingsIcon }
];

const schoolAdminItems = [
  { name: 'Overview', path: '/school-admin/dashboard', icon: LayoutDashboard },
  { 
    name: 'Student Management', 
    icon: GraduationCap,
    subItems: [
      { name: 'All Students', path: '/school-admin/students/list' },
      { name: 'Student Profile', path: '/school-admin/students/profile' }
    ]
  },
  { 
    name: 'Academics', 
    icon: BookOpen,
    subItems: [
      { name: 'Dashboard', path: '/school-admin/academics/dashboard' },
      { name: 'Academic Setup', path: '/school-admin/academics/configure' },
      { 
        name: 'Courses',
        subItems: [
          { name: 'Course Catalogue', path: '/school-admin/academics/courses' },
          { name: 'Course Registrations', path: '/school-admin/academics/registration' },
          { name: 'Course Materials', path: '/school-admin/academics/course-materials' },
        ]
      },
      { 
        name: 'Timetable & Attendance',
        subItems: [
          { name: 'Timetable', path: '/school-admin/academics/lectures-timetable' },
          { name: 'Attendance Sessions', path: '/school-admin/academics/attendance' },
          { name: 'Attendance Report', path: '/school-admin/academics/attendance/report' }
        ]
      },
      {
        name: 'Academic Progress',
        subItems: [
          { name: 'Level Promotion', path: '/school-admin/academics/promotion' },
          { name: 'CGPA Monitoring', path: '/school-admin/academics/cgpa-monitoring' }
        ]
      }
    ]
  },
  { 
    name: 'Assessment & Results', 
    icon: ClipboardCheck,
    subItems: [
      { name: 'Dashboard', path: '/school-admin/examinations/dashboard' },
      { name: 'Assessment Setup', path: '/school-admin/examinations/assessment-config' },
      { name: 'Assessment Cycle', path: '/school-admin/examinations/cycle' },
      { name: 'Timetable', path: '/school-admin/examinations/timetable' },
      {
        name: 'Result Computation',
        subItems: [
          { name: 'Marks Entry', path: '/school-admin/examinations/scores' },
          { name: 'Result Compilation', path: '/school-admin/examinations/processing' },
          { name: 'Result Release', path: '/school-admin/examinations/publication' }
        ]
      }
    ]
  },
  { 
    name: 'Admissions', 
    icon: UserPlus,
    subItems: [
      { name: 'Dashboard', path: '/school-admin/admissions/dashboard' },
      { name: 'Admission Setup', path: '/school-admin/admissions/configure' },
      { name: 'Intake', path: '/school-admin/admissions/intake' },
      { name: 'Create Admission', path: '/school-admin/admissions/create' },
      { name: 'Multiple Imports', path: '/school-admin/admissions/imports' }
    ]
  },
  { 
    name: 'Human Resources', 
    icon: Briefcase,
    subItems: [
      { name: 'Dashboard', path: '/school-admin/human-resources/dashboard' },
      { name: 'HR Setup', path: '/school-admin/human-resources/config' },
      {
        name: 'Staff',
        subItems: [
          { name: 'Add Staff', path: '/school-admin/staff/create' },
          { name: 'Staff Profile', path: '/school-admin/staff/profile' },
          { name: 'Staff Schedules', path: '/school-admin/human-resources/staff-schedules' }
        ]
      },
      {
        name: 'Payroll & Compensation',
        subItems: [
          { name: 'Payroll', path: '/school-admin/human-resources/payroll' },
          { name: 'Salary Adjustments', path: '/school-admin/human-resources/salary/adjustments' },
          { name: 'Salary Advances', path: '/school-admin/human-resources/salary/advances' }
        ]
      },
      {
        name: 'Leave & Attendance',
        subItems: [
          { name: 'Leave Request', path: '/school-admin/human-resources/leave/request' },
          { name: 'Leave Approvals', path: '/school-admin/human-resources/leave/approvals' }
        ]
      }
    ]
  },
  { 
    name: 'Finance', 
    icon: DollarSign,
    subItems: [
      { name: 'Bank Accounts', path: '/school-admin/finance/accounts' },
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
      }
    ]
  },
  {
    name: 'Procurement',
    icon: ShoppingBag,
    subItems: [
      { name: 'Dashboard', path: '/school-admin/procurement/dashboard' },
      { name: 'Purchase Requests', path: '/school-admin/procurement/requests' },
      { name: 'Purchase Orders', path: '/school-admin/procurement/orders' },
      { name: 'Inventory', path: '/school-admin/procurement/inventory' },
      { name: 'Fixed Assets', path: '/school-admin/procurement/assets' }
    ]
  },
  { 
    name: 'Communication Centre', 
    icon: MessageSquare,
    subItems: [
      { name: 'Inbox', path: '/school-admin/communication-centre/inbox' },
      { name: 'Announcements', path: '/school-admin/communication-centre/announcements' },
      { name: 'Direct Messaging', path: '/school-admin/communication-centre/direct-messaging' }
    ]
  },
  { 
    name: 'Student Services', 
    icon: Bus,
    subItems: [
      { name: 'Hostel', path: '/school-admin/student-services/hostel' },
      { name: 'Transport', path: '/school-admin/student-services/transport' }
    ]
  },
  { 
    name: 'Library', 
    icon: BookOpen,
    subItems: [
      { name: 'Dashboard', path: '/school-admin/library/dashboard' },
      { name: 'Book Categories', path: '/school-admin/library/categories' },
      { name: 'Book Catalogue', path: '/school-admin/library/catalog' },
      { name: 'Circulations', path: '/school-admin/library/borrowing' },
      { name: 'Reservations', path: '/school-admin/library/reservations' }
    ]
  },
  { 
    name: 'Events', 
    icon: Calendar,
    subItems: [
      { name: 'Dashboard', path: '/school-admin/events/dashboard' },
      { name: 'Event Categories', path: '/school-admin/events/categories' },
      { name: 'Create Event', path: '/school-admin/events/create' },
      { name: 'Upcoming Events', path: '/school-admin/events/upcoming' }
    ]
  },
  {
    name: 'Help Desk',
    icon: MessageSquare,
    subItems: [
      { name: 'Dashboard', path: '/school-admin/helpdesk/dashboard' },
      { name: 'Ticket Categories', path: '/school-admin/helpdesk/categories' },
      { name: 'New Ticket', path: '/school-admin/helpdesk/create' },
      { name: 'Tickets', path: '/school-admin/helpdesk/tickets' }
    ]
  },
  {
    name: 'Reception',
    icon: Users,
    subItems: [
        { name: 'Visitors Log', path: '/school-admin/reception/visitors' },
        { name: 'Appointments', path: '/school-admin/reception/appointments' },
        { name: 'Enquiries Log', path: '/school-admin/reception/enquiries' },
        { name: 'Mail Log', path: '/school-admin/reception/mail' }
    ]
  },
  { name: 'Health & Clinic', path: '/school-admin/health', icon: Stethoscope },
  {
    name: 'Alumni',
    icon: GraduationCap,
    subItems: [
        { name: 'Dashboard', path: '/school-admin/alumni/dashboard' },
        { name: 'Alumni List', path: '/school-admin/alumni/list' },
        { name: 'Alumni Profile', path: '/school-admin/alumni/profile' },
        { name: 'Employment Info', path: '/school-admin/alumni/employment' },
        { name: 'Transcript Requests', path: '/school-admin/alumni/transcripts' },
        { name: 'Communication', path: '/school-admin/alumni/communication' }
    ]
  },
  {
    name: 'ID Cards',
    icon: IdCard,
    subItems: [
      { name: 'Staff ID Cards', path: '/school-admin/id-cards/staff' },
      { name: 'Staff Template', path: '/school-admin/id-cards/staff/template' },
      { name: 'Student ID Cards', path: '/school-admin/id-cards/students' },
      { name: 'Student Template', path: '/school-admin/id-cards/students/template' },
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
    name: 'Settings', 
    icon: SettingsIcon,
    subItems: [
      { name: 'General Settings', path: '/school-admin/settings' }
    ]
  },
  { name: 'Subscription', path: '/school-admin/subscription', icon: CreditCard }
];

const studentItems = [
  { name: 'Dashboard', path: '/student/dashboard', icon: LayoutDashboard },
  { 
    name: 'Academics', 
    icon: BookOpen,
    subItems: [
      { name: 'Enrolled Courses', path: '/student/academics/courses' },
      { name: 'Course Materials', path: '/student/academics/materials' },
      { name: 'Timetable', path: '/student/academics/timetable' },
      { name: 'Results', path: '/student/academics/results' }
    ]
  },
  {
    name: 'Fees',
    icon: DollarSign,
    subItems: [
      { name: 'Overview', path: '/student/fees' },
      { name: 'Payment History', path: '/student/fees/history' },
      { name: 'Receipts', path: '/student/fees/receipts' },
    ],
  },
  {
    name: 'Library',
    icon: BookOpen,
    subItems: [
      { name: 'Book Catalog', path: '/student/library/catalog' },
      { name: 'My Borrows', path: '/student/library/borrows' }
    ]
  },
  {
    name: 'Student Services',
    icon: Bus,
    subItems: [
      { name: 'Hostel', path: '/student/services/hostel' },
      { name: 'Transport', path: '/student/services/transport' }
    ]
  },
  {
    name: 'Communication',
    icon: MessageSquare,
    subItems: [
      { name: 'Inbox', path: '/student/communication/inbox' }
    ]
  },
  { 
    name: 'Help Desk', 
    icon: MessageSquare,
    subItems: [
      { name: 'Submit Ticket', path: '/student/helpdesk' },
      { name: 'Tickets', path: '/student/helpdesk/tickets' }
    ]
  },
  { name: 'Events', path: '/student/events', icon: Calendar },
  { name: 'Profile', path: '/student/profile', icon: Users },
];

const staffItems = [
  { name: 'Dashboard', path: '/staff/dashboard', icon: LayoutDashboard },
  { 
    name: 'Academics', 
    icon: BookOpen,
    subItems: [
      { name: 'My Courses', path: '/staff/academics/courses' },
      { name: 'Course Materials', path: '/staff/academics/materials' },
      { name: 'Timetable', path: '/staff/academics/timetable' },
      { name: 'Attendance', path: '/staff/academics/attendance' },
      { name: 'Students', path: '/staff/academics/students' },
    ]
  },
  { 
    name: 'Assessment & Results', 
    icon: ClipboardCheck,
    subItems: [
      { name: 'Marks Entry', path: '/staff/assessment/marks' },
      { name: 'Exam Timetable', path: '/staff/assessment/timetable' },
    ]
  },
  { 
    name: 'HR Self Service', 
    icon: Briefcase,
    subItems: [
      { name: 'My Salary', path: '/staff/hr/salary' },
      { name: 'Leave Request', path: '/staff/hr/leave' },
      { name: 'Salary Requests', path: '/staff/hr/requests' },
      { name: 'My Profile', path: '/staff/hr/profile' },
    ]
  },
  {
    name: 'Communication',
    icon: MessageSquare,
    subItems: [
      { name: 'Inbox', path: '/staff/communication/inbox' },
      { name: 'Direct Messaging', path: '/staff/communication/dm' },
    ]
  },
  { name: 'Events', path: '/staff/events', icon: Calendar },
  { name: 'Profile', path: '/staff/profile', icon: Users },
];

function App() {
  return (
    <HRProvider>
      <ReceptionProvider>
        <AttendanceProvider>
          <HelpDeskProvider>
            <AlumniProvider>
              <FinanceProvider>
                <StudentPortalFinanceProvider>
                  <HostelProvider>
                    <TransportProvider>
                      <LibraryProvider>
                        <EventsProvider>
                          <AuthProvider>
                            <Router>
                              <Suspense fallback={<LoadingFallback />}>
                                <Routes>
                          {/* Public Routes */}
                          <Route path="/" element={<Navigate to="/auth" replace />} />
                          <Route path="/auth" element={<AuthSelection />} />
                          <Route path="/auth/super-admin" element={<SuperAdminLogin />} />
                          <Route path="/auth/school-admin" element={<SchoolAdminLogin />} />
                          <Route path="/auth/student" element={<StudentLogin />} />

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
                            <Route path="/super-admin/academic-catalog" element={<ProgramGovernance />} />
                            <Route path="/super-admin/system-logs" element={<SystemLogs />} />
                            <Route path="/super-admin/config" element={<InstitutionConfig />} />
                            <Route path="/super-admin/finance/dashboard" element={<SuperAdminFinanceDashboard />} />
                            <Route path="/super-admin/finance/revenue" element={<SuperAdminRevenue />} />
                            <Route path="/super-admin/finance/plans" element={<SuperAdminSubscriptionPlans />} />
                            <Route path="/super-admin/reports" element={<ReportsLayout />} />
                          </Route>

                          <Route 
                            path="/super-admin/academics-overview" 
                            element={
                              <FullScreenLayout title="Academics Overview">
                                <SuperAdminAcademicsOverview />
                              </FullScreenLayout>
                            } 
                          />
                          <Route 
                            path="/super-admin/hr-overview" 
                            element={
                              <FullScreenLayout title="Human Resources Overview">
                                <SuperAdminHROverview />
                              </FullScreenLayout>
                            } 
                          />
                          <Route 
                            path="/super-admin/assesment-and-result" 
                            element={
                              <FullScreenLayout title="Assesment and Result Overview">
                                <SuperAdminAssesmentAndResult />
                              </FullScreenLayout>
                            } 
                          />
                          <Route 
                            path="/super-admin/hr-overview/staff-profile" 
                            element={
                              <FullScreenLayout title="Staff Profile">
                                <SuperAdminStaffProfile />
                              </FullScreenLayout>
                            } 
                          />
                          <Route 
                            path="/super-admin/assesment-and-result/exam-details" 
                            element={
                              <FullScreenLayout title="Exam Details">
                                <SuperAdminExamDetails />
                              </FullScreenLayout>
                            } 
                          />
                          <Route 
                            path="/super-admin/assesment-and-result/result-details" 
                            element={
                              <FullScreenLayout title="Result Details">
                                <SuperAdminResultDetails />
                              </FullScreenLayout>
                            } 
                          />
                          <Route 
                            path="/super-admin/finance-overview" 
                            element={
                              <FullScreenLayout title="Finance Overview">
                                <SuperAdminFinanceOverview />
                              </FullScreenLayout>
                            } 
                          />

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
                        <Route path="/school-admin/academics/prerequisites" element={<CoursePrerequisites />} />
                        <Route path="/school-admin/academics/registration-approvals" element={<RegistrationApprovals />} />
                        <Route path="/school-admin/academics/course-materials" element={<CourseMaterialsDashboard />} />
                        <Route path="/school-admin/academics/course-materials/archive" element={<ArchivedMaterials />} />
                        <Route path="/school-admin/academics/course-materials/log" element={<DownloadLog />} />
                        <Route path="/school-admin/academics/lectures-timetable" element={<LecturesTimetable />} />
                        <Route path="/school-admin/academics/registration" element={<CourseRegistration />} />
                        <Route path="/school-admin/academics/promotion" element={<LevelPromotion />} />
                        <Route path="/school-admin/academics/calendar" element={<AcademicCalendar />} />
                        <Route path="/school-admin/academics/attendance" element={<AttendanceDashboard />} />
                        <Route path="/school-admin/academics/attendance/report" element={<AttendanceReport />} />
                        <Route path="/school-admin/academics/attendance/mark/:id" element={<MarkAttendance />} />
                        <Route path="/school-admin/academics/cgpa-monitoring" element={<CGPAMonitoring />} />

                        {/* HelpDesk */}
                        <Route path="/school-admin/helpdesk/dashboard" element={<HelpDeskDashboard />} />
                        <Route path="/school-admin/helpdesk/categories" element={<TicketCategories />} />
                        <Route path="/school-admin/helpdesk/create" element={<CreateTicket />} />
                        <Route path="/school-admin/helpdesk/tickets" element={<TicketWorkflow />} />

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

                        {/* Student Services */}
                        <Route path="/school-admin/student-services/hostel" element={<HostelDashboard />} />
                        <Route path="/school-admin/student-services/hostel/rooms" element={<HostelRooms />} />
                        <Route path="/school-admin/student-services/hostel/allocations" element={<HostelAllocations />} />
                        <Route path="/school-admin/student-services/hostel/config" element={<HostelConfig />} />

                        <Route path="/school-admin/student-services/transport" element={<TransportDashboard />} />
                        <Route path="/school-admin/student-services/transport/routes" element={<TransportRoutes />} />
                        <Route path="/school-admin/student-services/transport/vehicles" element={<TransportVehicles />} />
                        <Route path="/school-admin/student-services/transport/subscriptions" element={<TransportSubscriptions />} />
                        <Route path="/school-admin/student-services/transport/config" element={<TransportConfig />} />

                        {/* Staff Management */}
                        <Route path="/school-admin/staff/profile" element={<StaffProfile />} />
                        <Route path="/school-admin/staff/create" element={<CreateStaff />} />

                        {/* ID Cards */}
                        <Route path="/school-admin/id-cards/staff" element={<StaffIDCardDashboard />} />
                        <Route path="/school-admin/id-cards/staff/template" element={<IDCardTemplateDesigner type="Staff" />} />
                        <Route path="/school-admin/id-cards/students" element={<StudentIDCardDashboard />} />
                        <Route path="/school-admin/id-cards/students/template" element={<IDCardTemplateDesigner type="Student" />} />

                        {/* Procurement */}
                        <Route path="/school-admin/procurement/dashboard" element={<ProcurementDashboard />} />
                        <Route path="/school-admin/procurement/requests" element={<PurchaseRequests />} />
                        <Route path="/school-admin/procurement/orders" element={<PurchaseOrders />} />
                        <Route path="/school-admin/procurement/inventory" element={<InventoryManagement />} />
                        <Route path="/school-admin/procurement/assets" element={<AssetManagement />} />

                        {/* HR */}
                        <Route path="/school-admin/human-resources/dashboard" element={<HRDashboard />} />
                        <Route path="/school-admin/human-resources/staff-schedules" element={<StaffSchedules />} />
                        <Route path="/school-admin/human-resources/config" element={<HRConfig />} />
                        <Route path="/school-admin/human-resources/permissions" element={<PermissionsManagement />} />
                        <Route path="/school-admin/human-resources/leave/request" element={<LeaveRequest />} />
                        <Route path="/school-admin/human-resources/leave/approvals" element={<LeaveApprovals />} />
                        <Route path="/school-admin/human-resources/salary/adjustments" element={<SalaryAdjustments />} />
                        <Route path="/school-admin/human-resources/salary/advances" element={<SalaryAdvances />} />
                        <Route path="/school-admin/human-resources/payroll" element={<PayrollManagement />} />

                        <Route path="/school-admin/communication-centre/announcements" element={<AnnouncementsPage />} />
                        <Route path="/school-admin/communication-centre/direct-messaging" element={<DirectMessagingPage />} />
                        <Route path="/school-admin/communication-centre/inbox" element={<InboxPage />} />

                        {/* Alumni */}
                        <Route path="/school-admin/alumni/dashboard" element={<AlumniDashboard />} />
                        <Route path="/school-admin/alumni/list" element={<AlumniList />} />
                        <Route path="/school-admin/alumni/profile" element={<AlumniProfile />} />
                        <Route path="/school-admin/alumni/employment" element={<EmploymentInfo />} />
                        <Route path="/school-admin/alumni/transcripts" element={<TranscriptRequests />} />
                        <Route path="/school-admin/alumni/communication" element={<AlumniCommunication />} />

                        {/* Reception */}
                        <Route path="/school-admin/reception/visitors" element={<VisitorsLog />} />
                        <Route path="/school-admin/reception/appointments" element={<Appointments />} />
                        <Route path="/school-admin/reception/enquiries" element={<EnquiriesLog />} />
                        <Route path="/school-admin/reception/mail" element={<MailLog />} />

                        {/* Library */}
                        <Route path="/school-admin/library/dashboard" element={<LibraryDashboardPage />} />
                        <Route path="/school-admin/library/catalog" element={<BookCatalogPage />} />
                        <Route path="/school-admin/library/categories" element={<BookCategoriesPage />} />
                        <Route path="/school-admin/library/borrowing" element={<BorrowingSystemPage />} />
                        <Route path="/school-admin/library/reservations" element={<ReservationSystemPage />} />

                        {/* Events */}
                        <Route path="/school-admin/events/dashboard" element={<EventsDashboardPage />} />
                        <Route path="/school-admin/events/categories" element={<EventCategoriesPage />} />
                        <Route path="/school-admin/events/create" element={<CreateEventPage />} />
                        <Route path="/school-admin/events/upcoming" element={<UpcomingEventsPage />} />

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
                        <Route path="/school-admin/subscription" element={<SubscriptionPage />} />
                        <Route path="/school-admin/health" element={<HealthDashboard />} />
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
                        <Route path="/student" element={<Navigate to="/student/dashboard" replace />} />
                        <Route path="/student/dashboard" element={<StudentPortalDashboard />} />
                        <Route path="/student/academics" element={<StudentAcademicsDashboard />} />
                        <Route path="/student/academics/courses" element={<StudentAcademicsCourses />} />
                        <Route path="/student/academics/materials" element={<StudentAcademicsMaterials />} />
                        <Route path="/student/academics/results" element={<StudentAcademicsResults />} />
                        <Route path="/student/academics/timetable" element={<StudentAcademicsTimetable />} />
                        <Route path="/student/academics/timetable/exams" element={<StudentExamsTimetable />} />
                        <Route path="/student/courses" element={<Navigate to="/student/academics/courses" replace />} />
                        <Route path="/student/courses/materials" element={<Navigate to="/student/academics/materials" replace />} />
                        <Route path="/student/results" element={<Navigate to="/student/academics/results" replace />} />
                        <Route path="/student/timetable" element={<Navigate to="/student/academics/timetable" replace />} />
                        <Route path="/student/fees" element={<StudentFeesDashboard />} />
                        <Route path="/student/fees/invoices/:id" element={<StudentInvoiceDetails />} />
                        <Route path="/student/fees/pay/:invoiceId" element={<StudentPaymentCheckout />} />
                        <Route path="/student/fees/pay/confirm/:intentId" element={<StudentPaymentConfirmation />} />
                        <Route path="/student/fees/receipts" element={<StudentReceipts />} />
                        <Route path="/student/fees/receipts/:receiptId" element={<StudentReceiptDetails />} />
                        <Route path="/student/fees/history" element={<StudentPaymentHistory />} />
                        <Route path="/student/profile" element={<StudentPortalProfile />} />

                        {/* Student Communication */}
                        <Route path="/student/communication/inbox" element={<InboxPage />} />
                        
                        {/* Student Library */}
                        <Route path="/student/library/catalog" element={<StudentBookCatalog />} />
                        <Route path="/student/library/borrows" element={<StudentBorrowingHistory />} />

                        {/* Student Services */}
                        <Route path="/student/services/hostel" element={<HostelDashboard />} />
                        <Route path="/student/services/transport" element={<TransportDashboard />} />

                        {/* Student Events */}
                        <Route path="/student/events" element={<UpcomingEventsPage />} />

                        {/* Student Help Desk */}
                        <Route path="/student/helpdesk" element={<StudentSubmitTicket />} />
                        <Route path="/student/helpdesk/tickets" element={<StudentTickets />} />
                      </Route>

                      {/* Staff Portal Routes */}
                      <Route
                        path="/staff"
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
                        <Route index element={<Navigate to="dashboard" replace />} />
                        <Route path="dashboard" element={<StaffPortal />} />
                        <Route path="academics/courses" element={<StaffMyCourses />} />
                        <Route path="academics/materials" element={<StaffCourseMaterials />} />
                        <Route path="academics/timetable" element={<StaffTimetable />} />
                        <Route path="academics/attendance" element={<StaffAttendance />} />
                        <Route path="academics/students" element={<StaffStudents />} />
                        <Route path="assessment/marks" element={<StaffMarksEntry />} />
                        <Route path="assessment/timetable" element={<StaffExamTimetable />} />
                        <Route path="hr/salary" element={<StaffMySalary />} />
                        <Route path="hr/leave" element={<StaffLeaveRequest />} />
                        <Route path="hr/requests" element={<StaffSalaryRequests />} />
                        <Route path="hr/profile" element={<StaffProfileView />} />
                        <Route path="communication/inbox" element={<StaffInbox />} />
                        <Route path="communication/dm" element={<StaffDirectMessaging />} />
                        <Route path="events" element={<StaffEvents />} />
                      </Route>
                    </Routes>
                  </Suspense>
                </Router>
              </AuthProvider>
            </EventsProvider>
          </LibraryProvider>
        </TransportProvider>
      </HostelProvider>
    </StudentPortalFinanceProvider>
  </FinanceProvider>
            </AlumniProvider>
          </HelpDeskProvider>
        </AttendanceProvider>
      </ReceptionProvider>
    </HRProvider>
  );
}

export default App;
