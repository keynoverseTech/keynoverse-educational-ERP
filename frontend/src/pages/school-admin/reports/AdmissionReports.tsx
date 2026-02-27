import React, { useState } from 'react';
import ReportFilter, { type FilterState } from './ReportFilter';
import { Download, FileText, Printer } from 'lucide-react';

type AdmissionReportRow = {
  id: number;
  name: string;
  regNo: string;
  score: number;
  status: string;
  programme: string;
};

const AdmissionReports: React.FC = () => {
  const [activeTab, setActiveTab] = useState('applicants');

  const tabs = [
    { id: 'applicants', label: 'Applicants Report' },
    { id: 'matriculated', label: 'Matriculated Students' },
    { id: 'jamb', label: 'JAMB Statistics' },
  ];

  const [reportData, setReportData] = useState<AdmissionReportRow[]>([]);

  const handleGenerate = (filters: FilterState) => {
    console.log('Generating report with filters:', filters);
    // Simulate data generation
    setReportData([
      { id: 1, name: 'John Doe', regNo: 'APP/2024/001', score: 280, status: 'Admitted', programme: 'Computer Science' },
      { id: 2, name: 'Jane Smith', regNo: 'APP/2024/002', score: 265, status: 'Pending', programme: 'Biochemistry' },
      { id: 3, name: 'Mike Johnson', regNo: 'APP/2024/003', score: 240, status: 'Rejected', programme: 'Mass Communication' },
      { id: 4, name: 'Sarah Wilson', regNo: 'APP/2024/004', score: 290, status: 'Admitted', programme: 'Computer Science' },
      { id: 5, name: 'David Brown', regNo: 'APP/2024/005', score: 255, status: 'Pending', programme: 'Economics' },
    ]);
  };

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex space-x-2 border-b border-gray-200 dark:border-gray-700 pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              activeTab === tab.id
                ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <ReportFilter onGenerate={handleGenerate} />

      {/* Report Content Placeholder - Would be a table in real implementation */}
      <div className="bg-white dark:bg-[#151e32] p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            {tabs.find(t => t.id === activeTab)?.label}
          </h3>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700">
              <Printer className="w-3.5 h-3.5" /> Print
            </button>
            <button className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 rounded-lg hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/30">
              <FileText className="w-3.5 h-3.5" /> PDF
            </button>
            <button className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-green-700 bg-green-50 rounded-lg hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400 dark:hover:bg-green-900/30">
              <Download className="w-3.5 h-3.5" /> Excel
            </button>
          </div>
        </div>

        <div className="min-h-[300px] border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
          {reportData.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 dark:bg-gray-900/50">
                  <tr>
                    <th className="p-4 font-medium text-gray-500">Applicant Name</th>
                    <th className="p-4 font-medium text-gray-500">Reg No</th>
                    <th className="p-4 font-medium text-gray-500">Programme</th>
                    <th className="p-4 font-medium text-gray-500">JAMB Score</th>
                    <th className="p-4 font-medium text-gray-500">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {reportData.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/20">
                      <td className="p-4 font-medium text-gray-900 dark:text-white">{item.name}</td>
                      <td className="p-4 text-gray-600 dark:text-gray-400">{item.regNo}</td>
                      <td className="p-4 text-gray-600 dark:text-gray-400">{item.programme}</td>
                      <td className="p-4 text-gray-600 dark:text-gray-400">{item.score}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          item.status === 'Admitted' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                          item.status === 'Rejected' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                          'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex items-center justify-center h-[300px] text-center text-gray-500">
              <div>
                <p className="mb-2">Select filters and click "Generate Report" to view data</p>
                <p className="text-sm text-gray-400">Showing sample layout for {activeTab}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdmissionReports;
