import React, { useState } from 'react';
import { 
  FileText, 
  Calendar, 
  Clock, 
  Upload,
  BookOpen,
  X,
  Link as LinkIcon,
  Type
} from 'lucide-react';

const StudentAssignments: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'active' | 'past'>('active');
  const [selectedCourse, setSelectedCourse] = useState<string>('');
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<any>(null);
  const [submissionType, setSubmissionType] = useState<'file' | 'text' | 'link'>('file');

  // Mock Courses (Enrolled)
  const courses = [
    { code: 'CSC 401', title: 'Advanced Software Engineering' },
    { code: 'MTH 302', title: 'Linear Algebra' },
    { code: 'PHY 201', title: 'General Physics' }
  ];

  const assignments = [
    {
      id: 1,
      title: 'Research Proposal Draft',
      courseCode: 'CSC 401',
      dueDate: '2024-03-25',
      time: '11:59 PM',
      points: 20,
      status: 'Pending',
      statusColor: 'text-amber-600 bg-amber-50 dark:bg-amber-900/20',
      allowedTypes: ['file', 'link']
    },
    {
      id: 2,
      title: 'Linear Transformations Problem Set',
      courseCode: 'MTH 302',
      dueDate: '2024-03-28',
      time: '10:00 AM',
      points: 10,
      status: 'Submitted',
      statusColor: 'text-green-600 bg-green-50 dark:bg-green-900/20',
      allowedTypes: ['file']
    },
    {
      id: 3,
      title: 'Physics Lab Report 1',
      courseCode: 'PHY 201',
      dueDate: '2024-02-15',
      time: '11:59 PM',
      points: 15,
      status: 'Graded',
      statusColor: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20',
      allowedTypes: ['file']
    }
  ];

  const filteredAssignments = assignments.filter(a => {
    const matchesCourse = selectedCourse ? a.courseCode === selectedCourse : true;
    const matchesTab = activeTab === 'active' 
      ? (a.status === 'Pending' || a.status === 'Submitted') 
      : (a.status === 'Graded' || a.status === 'Late');
    return matchesCourse && matchesTab;
  });

  const handleOpenSubmit = (assignment: any) => {
    setSelectedAssignment(assignment);
    setSubmissionType(assignment.allowedTypes[0]); // Default to first allowed type
    setIsSubmitModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock submission logic
    setIsSubmitModalOpen(false);
    alert('Assignment submitted successfully!');
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <FileText className="text-purple-600" />
            Assignments
          </h1>
          <p className="text-gray-500 dark:text-gray-400">View and submit your coursework.</p>
        </div>

        {/* Course Filter */}
        <div className="relative min-w-[250px]">
          <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <select 
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm"
          >
            <option value="">All My Courses</option>
            {courses.map(c => <option key={c.code} value={c.code}>{c.code} - {c.title}</option>)}
          </select>
        </div>
      </div>

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
          Past / Graded
          {activeTab === 'past' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-purple-600 rounded-t-full" />}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredAssignments.length === 0 ? (
           <div className="col-span-full text-center py-12 bg-white dark:bg-gray-800 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700">
             <FileText size={48} className="mx-auto text-gray-300 mb-4" />
             <p className="text-gray-500 dark:text-gray-400 font-medium">No assignments found.</p>
           </div>
        ) : (
          filteredAssignments.map((assignment) => (
            <div key={assignment.id} className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all group relative">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="text-xs font-bold text-purple-600 bg-purple-50 dark:bg-purple-900/20 px-2 py-1 rounded-md mb-2 inline-block">
                    {assignment.courseCode}
                  </span>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">{assignment.title}</h3>
                </div>
                {/* Status Badge */}
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${assignment.statusColor}`}>
                  {assignment.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                  <Calendar size={16} className="text-gray-400" />
                  <span>{assignment.dueDate}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                  <Clock size={16} className="text-gray-400" />
                  <span>{assignment.time}</span>
                </div>
              </div>

              <div className="flex items-center justify-between mt-auto">
                <span className="text-sm font-bold text-gray-900 dark:text-white">{assignment.points} Points</span>
                {assignment.status === 'Pending' && (
                  <button 
                    onClick={() => handleOpenSubmit(assignment)}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-bold hover:bg-purple-700 transition-colors shadow-lg shadow-purple-500/20 flex items-center gap-2"
                  >
                    <Upload size={16} /> Submit
                  </button>
                )}
                {assignment.status !== 'Pending' && (
                  <button className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg text-sm font-bold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                    View Submission
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Submit Assignment Modal */}
      {isSubmitModalOpen && selectedAssignment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-lg shadow-xl border border-gray-200 dark:border-gray-700">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Submit Assignment</h2>
              <button 
                onClick={() => setIsSubmitModalOpen(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{selectedAssignment.title}</h3>
                <p className="text-sm text-gray-500">Due: {selectedAssignment.dueDate} at {selectedAssignment.time}</p>
              </div>

              {/* Submission Type Tabs */}
              <div className="flex gap-2 bg-gray-100 dark:bg-gray-900 p-1 rounded-lg">
                {selectedAssignment.allowedTypes.includes('file') && (
                  <button
                    type="button"
                    onClick={() => setSubmissionType('file')}
                    className={`flex-1 py-2 text-sm font-bold rounded-md flex items-center justify-center gap-2 transition-all ${
                      submissionType === 'file' 
                        ? 'bg-white dark:bg-gray-800 text-purple-600 shadow-sm' 
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <Upload size={16} /> File Upload
                  </button>
                )}
                {selectedAssignment.allowedTypes.includes('text') && (
                  <button
                    type="button"
                    onClick={() => setSubmissionType('text')}
                    className={`flex-1 py-2 text-sm font-bold rounded-md flex items-center justify-center gap-2 transition-all ${
                      submissionType === 'text' 
                        ? 'bg-white dark:bg-gray-800 text-purple-600 shadow-sm' 
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <Type size={16} /> Text Entry
                  </button>
                )}
                {selectedAssignment.allowedTypes.includes('link') && (
                  <button
                    type="button"
                    onClick={() => setSubmissionType('link')}
                    className={`flex-1 py-2 text-sm font-bold rounded-md flex items-center justify-center gap-2 transition-all ${
                      submissionType === 'link' 
                        ? 'bg-white dark:bg-gray-800 text-purple-600 shadow-sm' 
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <LinkIcon size={16} /> Website URL
                  </button>
                )}
              </div>

              {/* Dynamic Input Area */}
              <div>
                {submissionType === 'file' && (
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 text-center hover:border-purple-500 dark:hover:border-purple-400 transition-colors cursor-pointer bg-gray-50 dark:bg-gray-900/50">
                    <input type="file" id="assignment-upload" className="hidden" />
                    <label htmlFor="assignment-upload" className="cursor-pointer">
                      <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Upload size={24} />
                      </div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">Click to upload file</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">PDF, DOCX, ZIP (Max. 50MB)</p>
                    </label>
                  </div>
                )}

                {submissionType === 'text' && (
                  <textarea 
                    className="w-full h-40 p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-purple-500 outline-none resize-none"
                    placeholder="Type your submission here..."
                  ></textarea>
                )}

                {submissionType === 'link' && (
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Website URL</label>
                    <div className="relative">
                      <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <input 
                        type="url" 
                        placeholder="https://..." 
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-purple-500 outline-none"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
                <button 
                  type="button"
                  onClick={() => setIsSubmitModalOpen(false)}
                  className="px-6 py-2 mr-3 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors shadow-lg shadow-purple-500/20"
                >
                  Submit Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentAssignments;
