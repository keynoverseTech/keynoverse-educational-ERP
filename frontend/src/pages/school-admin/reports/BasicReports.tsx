import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  GraduationCap, 
  BookOpen, 
  ClipboardCheck, 
  Banknote
} from 'lucide-react';
import ReportsDashboard from './ReportsDashboard';
import AdmissionReports from './AdmissionReports';
import StudentReports from './StudentReports';
import AcademicReports from './AcademicReports';
import ExaminationReports from './ExaminationReports';
import FinanceReports from './FinanceReports';

const BasicReports: React.FC = () => {
  const [searchParams] = useSearchParams();
  const activeModule = searchParams.get('tab') || 'dashboard';

  const modules = [
    { id: 'dashboard', label: 'Report Dashboard', icon: LayoutDashboard },
    { id: 'admissions', label: 'Admission Reports', icon: Users },
    { id: 'students', label: 'Student Reports', icon: GraduationCap },
    { id: 'academics', label: 'Academic Performance', icon: BookOpen },
    { id: 'exams', label: 'Examination Reports', icon: ClipboardCheck },
    { id: 'finance', label: 'Financial Reports', icon: Banknote },
  ];

  const renderContent = () => {
    switch (activeModule) {
      case 'dashboard': return <ReportsDashboard />;
      case 'admissions': return <AdmissionReports />;
      case 'students': return <StudentReports />;
      case 'academics': return <AcademicReports />;
      case 'exams': return <ExaminationReports />;
      case 'finance': return <FinanceReports />;
      default: return <ReportsDashboard />;
    }
  };

  return (
    <div className="flex-1 overflow-auto bg-gray-50 dark:bg-[#0f172a]">
      <div className="p-8 max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {modules.find(m => m.id === activeModule)?.label}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            {activeModule === 'dashboard' 
              ? 'University-wide performance overview and key statistics.'
              : 'Generate detailed reports and analytics.'}
          </p>
        </div>
        
        {renderContent()}
      </div>
    </div>
  );
};

export default BasicReports;