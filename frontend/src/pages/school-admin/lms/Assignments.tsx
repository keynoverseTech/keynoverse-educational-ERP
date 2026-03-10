import React, { useState } from 'react';
import { 
  FileText, 
  Plus, 
  Calendar, 
  Clock, 
  MoreVertical,
  Filter,
  BookOpen,
  X
} from 'lucide-react';

interface Assignment {
  id: number;
  title: string;
  courseCode: string;
  dueDate: string;
  dueTime: string;
  points: number;
  submissions: number;
  totalStudents: number;
  status: 'Active' | 'Closed' | 'Draft';
  submissionType: 'File Upload' | 'Text Entry' | 'Link';
}

const Assignments: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'active' | 'past'>('active');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filters State
  const [selectedFaculty, setSelectedFaculty] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedProgramme, setSelectedProgramme] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    courseCode: '',
    instructions: '',
    dueDate: '',
    dueTime: '23:59',
    maxScore: 100,
    submissionType: 'File Upload' // File Upload, Text Entry, Link
  });

  // Mock Data for Dropdowns
  const faculties = ['Faculty of Science', 'Faculty of Engineering', 'Faculty of Arts'];
  const departments = ['Computer Science', 'Electrical Engineering', 'English'];
  const programmes = ['HND Computer Science', 'B.Eng. Electrical', 'B.A. English'];
  const courses = [
    { code: 'CSC 401', title: 'Advanced Software Engineering' },
    { code: 'CSC 402', title: 'Artificial Intelligence' },
    { code: 'ENG 301', title: 'Digital Logic Design' }
  ];

  const [assignments, setAssignments] = useState<Assignment[]>([
    {
      id: 1,
      title: 'Research Proposal Draft',
      courseCode: 'CSC 401',
      dueDate: '2024-03-25',
      dueTime: '11:59 PM',
      points: 20,
      submissions: 15,
      totalStudents: 45,
      status: 'Active',
      submissionType: 'File Upload'
    },
    {
      id: 2,
      title: 'Linear Transformations Problem Set',
      courseCode: 'MTH 302',
      dueDate: '2024-03-28',
      dueTime: '10:00 AM',
      points: 10,
      submissions: 5,
      totalStudents: 30,
      status: 'Active',
      submissionType: 'File Upload'
    },
  ]);

  const handleOpenModal = () => {
    setFormData({
      title: '',
      courseCode: selectedCourse || '',
      instructions: '',
      dueDate: '',
      dueTime: '23:59',
      maxScore: 100,
      submissionType: 'File Upload'
    });
    setIsModalOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Creating Assignment:', formData);
    
    // Mock adding assignment
    const newAssignment: Assignment = {
      id: Date.now(),
      title: formData.title,
      courseCode: formData.courseCode,
      dueDate: formData.dueDate,
      dueTime: formData.dueTime,
      points: Number(formData.maxScore),
      submissions: 0,
      totalStudents: 45, // Mock total
      status: 'Active',
      submissionType: formData.submissionType as any
    };

    setAssignments(prev => [...prev, newAssignment]);
    setIsModalOpen(false);
    alert('Assignment created successfully (Mock)');
  };

  // Filter assignments based on selected course and active tab
  const filteredAssignments = assignments.filter(a => {
    const matchesCourse = selectedCourse ? a.courseCode === selectedCourse : true;
    // In a real app, date comparison would determine active/past
    return matchesCourse; 
  });

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <FileText className="text-purple-600" />
            Assignments
          </h1>
          <p className="text-gray-500 dark:text-gray-400">Manage coursework and student submissions.</p>
        </div>
        <button 
          onClick={handleOpenModal}
          disabled={!selectedCourse}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors text-sm font-bold shadow-lg ${
            selectedCourse 
              ? 'bg-purple-600 text-white hover:bg-purple-700 shadow-purple-500/20' 
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          <Plus size={16} /> Create Assignment
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Faculty</label>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <select 
              value={selectedFaculty}
              onChange={(e) => setSelectedFaculty(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">Select Faculty</option>
              {faculties.map(f => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Department</label>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <select 
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">Select Department</option>
              {departments.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Programme</label>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <select 
              value={selectedProgramme}
              onChange={(e) => setSelectedProgramme(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">Select Programme</option>
              {programmes.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Course</label>
          <div className="relative">
            <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <select 
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">Select Course</option>
              {courses.map(c => <option key={c.code} value={c.code}>{c.code} - {c.title}</option>)}
            </select>
          </div>
        </div>
      </div>

      {!selectedCourse ? (
        <div className="flex flex-col items-center justify-center py-20 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700">
          <FileText size={48} className="text-gray-300 mb-4" />
          <h3 className="text-lg font-bold text-gray-500 dark:text-gray-400">Select a course to manage assignments</h3>
          <p className="text-sm text-gray-400">Use the filters above to navigate to a specific course.</p>
        </div>
      ) : (
        <>
          <div className="flex gap-4 border-b border-gray-200 dark:border-gray-700 pb-1">
            <button 
              onClick={() => setActiveTab('active')}
              className={`pb-3 text-sm font-bold px-2 relative ${
                activeTab === 'active' ? 'text-purple-600' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              Active
              {activeTab === 'active' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-purple-600 rounded-t-full" />}
            </button>
            <button 
              onClick={() => setActiveTab('past')}
              className={`pb-3 text-sm font-bold px-2 relative ${
                activeTab === 'past' ? 'text-purple-600' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              Past
              {activeTab === 'past' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-purple-600 rounded-t-full" />}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredAssignments.map((assignment) => (
              <div key={assignment.id} className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all group relative">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="text-xs font-bold text-purple-600 bg-purple-50 dark:bg-purple-900/20 px-2 py-1 rounded-md mb-2 inline-block">
                      {assignment.courseCode}
                    </span>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">{assignment.title}</h3>
                  </div>
                  <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                    <MoreVertical size={20} />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                    <Calendar size={16} className="text-gray-400" />
                    <span>{assignment.dueDate}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                    <Clock size={16} className="text-gray-400" />
                    <span>{assignment.dueTime}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold text-gray-500">
                    <span>Submissions</span>
                    <span>{assignment.submissions} / {assignment.totalStudents}</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-purple-500 rounded-full" 
                      style={{ width: `${(assignment.submissions / assignment.totalStudents) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-gray-900 dark:text-white">{assignment.points} Points</span>
                    <span className="text-xs text-gray-400">• {assignment.submissionType}</span>
                  </div>
                  <button className="text-sm font-bold text-purple-600 hover:text-purple-700">View Submissions</button>
                </div>
              </div>
            ))}
            {filteredAssignments.length === 0 && (
              <div className="col-span-full py-12 text-center text-gray-400 italic">
                No assignments found for this course.
              </div>
            )}
          </div>
        </>
      )}

      {/* Create Assignment Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl border border-gray-200 dark:border-gray-700">
            <div className="sticky top-0 bg-white dark:bg-gray-800 p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center z-10">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Create New Assignment</h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Course</label>
                  <input 
                    type="text" 
                    value={courses.find(c => c.code === selectedCourse)?.title || selectedCourse}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-700 text-gray-500 cursor-not-allowed"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Submission Type</label>
                  <select 
                    name="submissionType"
                    value={formData.submissionType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-purple-500 outline-none"
                  >
                    <option value="File Upload">File Upload</option>
                    <option value="Text Entry">Text Entry</option>
                    <option value="Link">Website Link</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Assignment Title</label>
                <input 
                  type="text" 
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g. Mid-Semester Research Paper"
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-purple-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Instructions</label>
                <textarea 
                  name="instructions"
                  value={formData.instructions}
                  onChange={handleInputChange}
                  rows={4}
                  placeholder="Detailed instructions for the assignment..."
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-purple-500 outline-none resize-none"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Due Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                      type="date" 
                      name="dueDate"
                      value={formData.dueDate}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-purple-500 outline-none"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Due Time</label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                      type="time" 
                      name="dueTime"
                      value={formData.dueTime}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-purple-500 outline-none"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Maximum Score</label>
                  <input 
                    type="number" 
                    name="maxScore"
                    value={formData.maxScore}
                    onChange={handleInputChange}
                    min="1"
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-purple-500 outline-none"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2 mr-3 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors shadow-lg shadow-purple-500/20"
                >
                  Create Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Assignments;
