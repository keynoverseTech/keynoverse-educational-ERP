import { useState } from 'react';
import { AlertTriangle, FileText, Plus, Search } from 'lucide-react';

interface MalpracticeCase {
  id: string;
  studentName: string;
  matricNumber: string;
  courseCode: string;
  incidentDate: string;
  type: 'Cheating' | 'Impersonation' | 'Disruptive Behavior' | 'Unauthorized Material';
  status: 'Pending Investigation' | 'Disciplinary Committee' | 'Expelled' | 'Exonerated' | 'Rusticated';
  reportedBy: string;
}

const Malpractice = () => {
  const [cases] = useState<MalpracticeCase[]>([
    {
      id: '1',
      studentName: 'Michael Johnson',
      matricNumber: 'SCI/20/0882',
      courseCode: 'PHY 102',
      incidentDate: '2025-05-12',
      type: 'Unauthorized Material',
      status: 'Pending Investigation',
      reportedBy: 'Mr. James (Invigilator)'
    },
    {
      id: '2',
      studentName: 'Sarah Connor',
      matricNumber: 'ENG/21/0091',
      courseCode: 'MTH 201',
      incidentDate: '2025-05-14',
      type: 'Impersonation',
      status: 'Disciplinary Committee',
      reportedBy: 'Dr. Wilson (Chief Examiner)'
    }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Examination Malpractice</h1>
          <p className="text-gray-500 dark:text-gray-400">Record and track examination misconduct cases.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2"
        >
          <Plus size={18} />
          Report Incident
        </button>
      </div>

      <div className="flex gap-4 items-center bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
        <Search className="text-gray-400" size={20} />
        <input 
          type="text" 
          placeholder="Search by student or matric number..." 
          className="bg-transparent border-none focus:ring-0 text-gray-900 dark:text-white flex-1"
        />
        <select className="bg-transparent border-none text-gray-500 focus:ring-0">
          <option>All Statuses</option>
          <option>Pending Investigation</option>
          <option>Disciplinary Committee</option>
        </select>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 dark:bg-gray-900/50">
            <tr>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Student Details</th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Incident</th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Reported By</th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {cases.map((incident) => (
              <tr key={incident.id}>
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900 dark:text-white">{incident.studentName}</div>
                  <div className="text-sm text-gray-500">{incident.matricNumber}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900 dark:text-white">{incident.type}</div>
                  <div className="text-sm text-gray-500">{incident.courseCode} • {incident.incidentDate}</div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    incident.status === 'Pending Investigation' ? 'bg-yellow-100 text-yellow-700' :
                    incident.status === 'Disciplinary Committee' ? 'bg-purple-100 text-purple-700' :
                    incident.status === 'Exonerated' ? 'bg-green-100 text-green-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {incident.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                  {incident.reportedBy}
                </td>
                <td className="px-6 py-4">
                  <button className="text-blue-600 hover:underline text-sm flex items-center gap-1">
                    <FileText size={14} /> View Report
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4 dark:text-white flex items-center gap-2">
              <AlertTriangle className="text-red-600" />
              Report Malpractice
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Student Matric Number</label>
                <input type="text" className="w-full border rounded-lg p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="e.g. SCI/20/0123" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Course Code</label>
                  <input type="text" className="w-full border rounded-lg p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="e.g. MTH 101" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Incident Date</label>
                  <input type="date" className="w-full border rounded-lg p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Offense Type</label>
                <select className="w-full border rounded-lg p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                  <option>Unauthorized Material (Cheat sheet, Phone)</option>
                  <option>Impersonation</option>
                  <option>Disruptive Behavior</option>
                  <option>Plagiarism</option>
                  <option>Helping/Abetting</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description of Incident</label>
                <textarea className="w-full border rounded-lg p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white h-24" placeholder="Describe what happened..."></textarea>
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
                <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">Submit Report</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Malpractice;
