import { useState } from 'react';
import { Calendar, Plus, Trash2, Edit2 } from 'lucide-react';

interface ExamCycle {
  id: string;
  session: string;
  semester: 'First' | 'Second';
  type: 'Mid-Semester' | 'Final Exam';
  startDate: string;
  endDate: string;
  status: 'Draft' | 'Active' | 'Completed';
}

const ExamCycleSetup = () => {
  const [cycles, setCycles] = useState<ExamCycle[]>([
    {
      id: '1',
      session: '2024/2025',
      semester: 'First',
      type: 'Final Exam',
      startDate: '2025-05-12',
      endDate: '2025-05-30',
      status: 'Active',
    },
    {
      id: '2',
      session: '2024/2025',
      semester: 'First',
      type: 'Mid-Semester',
      startDate: '2025-03-10',
      endDate: '2025-03-15',
      status: 'Completed',
    }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCycle, setNewCycle] = useState<Partial<ExamCycle>>({
    session: '2025/2026',
    semester: 'First',
    type: 'Mid-Semester',
    startDate: '',
    endDate: '',
    status: 'Draft'
  });

  const handleCreateCycle = () => {
    if (!newCycle.startDate || !newCycle.endDate) {
      alert('Please select start and end dates');
      return;
    }

    const cycle: ExamCycle = {
      id: (cycles.length + 1).toString(),
      session: newCycle.session || '2025/2026',
      semester: newCycle.semester as 'First' | 'Second',
      type: newCycle.type as 'Mid-Semester' | 'Final Exam',
      startDate: newCycle.startDate,
      endDate: newCycle.endDate,
      status: 'Draft'
    };

    setCycles([...cycles, cycle]);
    setIsModalOpen(false);
    setNewCycle({
      session: '2025/2026',
      semester: 'First',
      type: 'Mid-Semester',
      startDate: '',
      endDate: '',
      status: 'Draft'
    });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Exam Cycle Setup</h1>
          <p className="text-gray-500 dark:text-gray-400">Manage academic sessions and examination periods.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus size={18} />
          Create New Cycle
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 dark:bg-gray-900/50">
            <tr>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Session / Semester</th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Exam Type</th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Duration</th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {cycles.map((cycle) => (
              <tr key={cycle.id}>
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900 dark:text-white">{cycle.session}</div>
                  <div className="text-sm text-gray-500">{cycle.semester} Semester</div>
                </td>
                <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                  {cycle.type}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <Calendar size={14} />
                    {cycle.startDate} - {cycle.endDate}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    cycle.status === 'Active' ? 'bg-green-100 text-green-700' :
                    cycle.status === 'Completed' ? 'bg-gray-100 text-gray-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {cycle.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button className="p-1 text-blue-600 hover:bg-blue-50 rounded"><Edit2 size={16} /></button>
                    <button className="p-1 text-red-600 hover:bg-red-50 rounded"><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4 dark:text-white">Create Exam Cycle</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Academic Session</label>
                <select 
                  value={newCycle.session}
                  onChange={(e) => setNewCycle({...newCycle, session: e.target.value})}
                  className="w-full border rounded-lg p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option>2024/2025</option>
                  <option>2025/2026</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Semester</label>
                <select 
                  value={newCycle.semester}
                  onChange={(e) => setNewCycle({...newCycle, semester: e.target.value as any})}
                  className="w-full border rounded-lg p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option>First</option>
                  <option>Second</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Exam Type</label>
                <select 
                  value={newCycle.type}
                  onChange={(e) => setNewCycle({...newCycle, type: e.target.value as any})}
                  className="w-full border rounded-lg p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option>Mid-Semester (CA)</option>
                  <option>Final Exam</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Start Date</label>
                  <input 
                    type="date" 
                    value={newCycle.startDate}
                    onChange={(e) => setNewCycle({...newCycle, startDate: e.target.value})}
                    className="w-full border rounded-lg p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">End Date</label>
                  <input 
                    type="date" 
                    value={newCycle.endDate}
                    onChange={(e) => setNewCycle({...newCycle, endDate: e.target.value})}
                    className="w-full border rounded-lg p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white" 
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
                <button 
                  onClick={handleCreateCycle}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Create Cycle
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExamCycleSetup;
