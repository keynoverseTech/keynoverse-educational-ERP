import type { AcademicsOverviewData } from './types';

const getAcademicsOverviewData = (): Promise<AcademicsOverviewData> => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        courseSummary: {
          totalCourses: 150,
          newCourses: 12,
          coursesWithNoStudents: 5,
        },
        upcomingClasses: [
          { id: '1', courseCode: 'CS101', courseName: 'Intro to Programming', lecturer: 'Dr. Smith', time: '10:00 AM', day: 'Monday', location: 'Hall 1', level: '100' },
          { id: '2', courseCode: 'MA203', courseName: 'Linear Algebra', lecturer: 'Prof. Jones', time: '11:00 AM', day: 'Monday', location: 'Room 203', level: '200' },
        ],
        attendanceReport: {
          overallAttendance: 85,
          bestPerformingCourse: { name: 'MA203', rate: 98 },
          worstPerformingCourse: { name: 'CS101', rate: 72 },
          dailyTrend: [
            { day: 'Mon', present: 1200, absent: 200 },
            { day: 'Tue', present: 1150, absent: 250 },
            { day: 'Wed', present: 1300, absent: 100 },
            { day: 'Thu', present: 1250, absent: 150 },
            { day: 'Fri', present: 1100, absent: 300 },
          ],
        },
        modules: [
          { 
            id: 'mod-1', 
            name: 'Sessions Management', 
            description: 'Configure academic years and session statuses.', 
            path: 'SessionsPage.tsx', 
            status: 'Active', 
            lastUpdated: '2 days ago', 
            type: 'Core',
            features: [
              'Create new academic sessions (e.g., 2024/2025)',
              'Set current active session',
              'Archive past sessions',
              'Define session start and end dates'
            ],
            stats: [
              { label: 'Current Session', value: '2024/2025' },
              { label: 'Total Sessions', value: 12 }
            ]
          },
          { 
            id: 'mod-2', 
            name: 'Semesters Management', 
            description: 'Define semester durations and exam periods.', 
            path: 'SemestersPage.tsx', 
            status: 'Active', 
            lastUpdated: '5 days ago', 
            type: 'Core',
            features: [
              'Configure First and Second Semesters',
              'Set semester duration and break periods',
              'Link semesters to academic sessions',
              'Open/Close registration windows'
            ],
            stats: [
              { label: 'Current', value: 'First Semester' },
              { label: 'Weeks Remaining', value: 8 }
            ]
          },
          { 
            id: 'mod-3', 
            name: 'Programmes', 
            description: 'Manage degree programmes and durations.', 
            path: 'ProgrammesPage.tsx', 
            status: 'Active', 
            lastUpdated: '1 week ago', 
            type: 'Core',
            features: [
              'Add new programmes (ND, HND)',
              'Set programme duration (years)',
              'Assign programmes to departments',
              'Define graduation requirements'
            ],
            stats: [
              { label: 'Active Programmes', value: 45 },
              { label: 'New (This Year)', value: 2 }
            ]
          },
          { 
            id: 'mod-4', 
            name: 'Faculties', 
            description: 'Manage faculties and deans.', 
            path: 'FacultiesPage.tsx', 
            status: 'Active', 
            lastUpdated: '2 weeks ago', 
            type: 'Core',
            features: [
              'Create and edit faculty records',
              'Assign Deans to faculties',
              'View faculty-wide statistics',
              'Manage faculty budget allocations'
            ],
            stats: [
              { label: 'Total Faculties', value: 8 },
              { label: 'Academic Staff', value: 120 }
            ]
          },
          { 
            id: 'mod-5', 
            name: 'Departments', 
            description: 'Create and link departments.', 
            path: 'DepartmentsPage.tsx', 
            status: 'Active', 
            lastUpdated: '2 weeks ago', 
            type: 'Core',
            features: [
              'Setup academic departments',
              'Link departments to parent faculties',
              'Assign Heads of Department (HOD)',
              'Manage departmental resources'
            ],
            stats: [
              { label: 'Departments', value: 32 },
              { label: 'Largest Dept', value: 'Comp. Sci' }
            ]
          },
          { 
            id: 'mod-6', 
            name: 'Levels', 
            description: 'Define academic levels (100L, 200L, etc.).', 
            path: 'LevelsPage.tsx', 
            status: 'Active', 
            lastUpdated: '1 month ago', 
            type: 'Core',
            features: [
              'Configure standard academic levels',
              'Set progression rules between levels',
              'Define max units per level',
              'Handle repeating students logic'
            ],
            stats: [
              { label: 'Defined Levels', value: '100L - 500L' },
              { label: 'Students', value: 4500 }
            ]
          },
          { 
            id: 'mod-7', 
            name: 'Courses', 
            description: 'Manage course catalog and units.', 
            path: 'CoursesPage.tsx', 
            status: 'Active', 
            lastUpdated: '3 days ago', 
            type: 'Core',
            features: [
              'Create, edit, and delete courses',
              'Assign credit units and prerequisites',
              'Categorize as Core, Elective, or Required',
              'Assign lecturers to courses'
            ],
            stats: [
              { label: 'Total Courses', value: 150 },
              { label: 'Unassigned', value: 5, trend: '-2' }
            ]
          },
          { 
            id: 'mod-8', 
            name: 'Course Registration Config', 
            description: 'Set credit limits and deadlines.', 
            path: 'CourseRegistrationConfig.tsx', 
            status: 'Active', 
            lastUpdated: '1 day ago', 
            type: 'Configuration',
            features: [
              'Set minimum and maximum credit load',
              'Configure late registration penalties',
              'Enable/Disable add & drop periods',
              'Define special waiver rules'
            ],
            stats: [
              { label: 'Status', value: 'Open' },
              { label: 'Deadline', value: '2 Weeks' }
            ]
          },
        ],
        courses: [
          { id: 'c-1', code: 'CS101', title: 'Intro to Programming', unit: 3, level: '100', semester: 'First', department: 'Computer Science', lecturer: 'Dr. Smith', studentsEnrolled: 120 },
          { id: 'c-2', code: 'MA101', title: 'General Mathematics I', unit: 3, level: '100', semester: 'First', department: 'Mathematics', lecturer: 'Dr. Euler', studentsEnrolled: 300 },
          { id: 'c-3', code: 'CS201', title: 'Data Structures', unit: 3, level: '200', semester: 'First', department: 'Computer Science', lecturer: 'Dr. Hopper', studentsEnrolled: 85 },
          { id: 'c-4', code: 'CS401', title: 'Software Engineering', unit: 4, level: '400', semester: 'First', department: 'Computer Science', lecturer: 'Prof. Knuth', studentsEnrolled: 45 },
        ],
        timetable: [
          { id: 'tt-1', courseCode: 'CS101', courseName: 'Intro to Programming', lecturer: 'Dr. Smith', time: '08:00 AM - 10:00 AM', day: 'Monday', location: 'Hall A', level: '100' },
          { id: 'tt-2', courseCode: 'MA101', courseName: 'General Mathematics I', lecturer: 'Dr. Euler', time: '10:00 AM - 12:00 PM', day: 'Monday', location: 'Hall B', level: '100' },
          { id: 'tt-3', courseCode: 'CS201', courseName: 'Data Structures', lecturer: 'Dr. Hopper', time: '02:00 PM - 04:00 PM', day: 'Tuesday', location: 'Lab 1', level: '200' },
          { id: 'tt-4', courseCode: 'CS401', courseName: 'Software Engineering', lecturer: 'Prof. Knuth', time: '09:00 AM - 11:00 AM', day: 'Wednesday', location: 'Room 305', level: '400' },
        ],
      });
    }, 1000);
  });
};

export const academicsOverviewService = {
  getAcademicsOverviewData,
};
