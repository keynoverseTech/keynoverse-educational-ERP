import React, { useEffect, useMemo, useState } from 'react';
import { BookOpen, Calendar, CheckCircle, Clock, FileText, Filter, Plus, Save, Trash2, Upload, X } from 'lucide-react';
import { getAssignedCourses } from '../academics/assignedCourses';

type SubmissionType = 'File Upload' | 'Text Entry' | 'Link';
type AssignmentStatus = 'Draft' | 'Active' | 'Closed';

interface StaffAssignment {
  id: string;
  courseCode: string;
  courseTitle: string;
  title: string;
  instructions: string;
  dueDate: string;
  dueTime: string;
  maxScore: number;
  submissionType: SubmissionType;
  status: AssignmentStatus;
  createdAt: string;
}

const STORAGE_KEY = 'staff_lms_assignments';

const loadAssignments = (): StaffAssignment[] => {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as StaffAssignment[];
  } catch {
    return [];
  }
};

const saveAssignments = (data: StaffAssignment[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

const StaffAssignments: React.FC = () => {
  const assignedCourses = useMemo(() => getAssignedCourses(), []);
  const [selectedCourse, setSelectedCourse] = useState<string>('All');
  const [activeTab, setActiveTab] = useState<'active' | 'draft' | 'closed'>('active');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [assignments, setAssignments] = useState<StaffAssignment[]>([]);

  const [formData, setFormData] = useState({
    courseCode: '',
    title: '',
    instructions: '',
    dueDate: '',
    dueTime: '23:59',
    maxScore: 100,
    submissionType: 'File Upload' as SubmissionType,
    status: 'Active' as AssignmentStatus,
  });

  useEffect(() => {
    const existing = loadAssignments();
    if (existing.length > 0) {
      setAssignments(existing);
      return;
    }

    const seeded: StaffAssignment[] = [
      {
        id: 'asg-1',
        courseCode: assignedCourses[0]?.code || 'CSC 401',
        courseTitle: assignedCourses[0]?.title || 'Advanced Software Engineering',
        title: 'Project Charter Submission',
        instructions: 'Submit a one-page project charter describing scope, risks, and milestones.',
        dueDate: new Date().toISOString().split('T')[0],
        dueTime: '23:59',
        maxScore: 20,
        submissionType: 'File Upload',
        status: 'Active',
        createdAt: new Date().toISOString(),
      },
    ];
    setAssignments(seeded);
    saveAssignments(seeded);
  }, [assignedCourses]);

  useEffect(() => {
    saveAssignments(assignments);
  }, [assignments]);

  const allowedCourseCodes = useMemo(() => new Set(assignedCourses.map(c => c.code)), [assignedCourses]);

  const filteredAssignments = useMemo(() => {
    let result = assignments.filter(a => allowedCourseCodes.has(a.courseCode));
    if (selectedCourse !== 'All') result = result.filter(a => a.courseCode === selectedCourse);
    if (activeTab === 'active') result = result.filter(a => a.status === 'Active');
    if (activeTab === 'draft') result = result.filter(a => a.status === 'Draft');
    if (activeTab === 'closed') result = result.filter(a => a.status === 'Closed');
    return result.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }, [activeTab, allowedCourseCodes, assignments, selectedCourse]);

  const openCreate = () => {
    setEditingId(null);
    setFormData({
      courseCode: assignedCourses[0]?.code || '',
      title: '',
      instructions: '',
      dueDate: '',
      dueTime: '23:59',
      maxScore: 100,
      submissionType: 'File Upload',
      status: 'Active',
    });
    setIsModalOpen(true);
  };

  const openEdit = (assignment: StaffAssignment) => {
    setEditingId(assignment.id);
    setFormData({
      courseCode: assignment.courseCode,
      title: assignment.title,
      instructions: assignment.instructions,
      dueDate: assignment.dueDate,
      dueTime: assignment.dueTime,
      maxScore: assignment.maxScore,
      submissionType: assignment.submissionType,
      status: assignment.status,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (!window.confirm('Delete this assignment? This cannot be undone.')) return;
    setAssignments(prev => prev.filter(a => a.id !== id));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.courseCode) return;
    if (!allowedCourseCodes.has(formData.courseCode)) return;

    const course = assignedCourses.find(c => c.code === formData.courseCode);
    const courseTitle = course?.title || formData.courseCode;

    if (editingId) {
      setAssignments(prev =>
        prev.map(a =>
          a.id === editingId
            ? {
                ...a,
                courseCode: formData.courseCode,
                courseTitle,
                title: formData.title,
                instructions: formData.instructions,
                dueDate: formData.dueDate,
                dueTime: formData.dueTime,
                maxScore: formData.maxScore,
                submissionType: formData.submissionType,
                status: formData.status,
              }
            : a
        )
      );
    } else {
      const newAssignment: StaffAssignment = {
        id: `asg-${Date.now()}`,
        courseCode: formData.courseCode,
        courseTitle,
        title: formData.title,
        instructions: formData.instructions,
        dueDate: formData.dueDate,
        dueTime: formData.dueTime,
        maxScore: formData.maxScore,
        submissionType: formData.submissionType,
        status: formData.status,
        createdAt: new Date().toISOString(),
      };
      setAssignments(prev => [newAssignment, ...prev]);
    }

    setIsModalOpen(false);
    setEditingId(null);
  };

  const badge = (status: AssignmentStatus) => {
    const map: Record<AssignmentStatus, { icon: any; className: string }> = {
      Active: { icon: CheckCircle, className: 'bg-green-100 text-green-700' },
      Draft: { icon: Clock, className: 'bg-gray-100 text-gray-700' },
      Closed: { icon: FileText, className: 'bg-red-100 text-red-700' },
    };
    const Icon = map[status].icon;
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${map[status].className}`}>
        <Icon size={12} />
        {status}
      </span>
    );
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Upload className="text-blue-600" />
            Assignments
          </h1>
          <p className="text-gray-500 dark:text-gray-400">Create and manage assignments for your assigned courses.</p>
        </div>
        <button
          onClick={openCreate}
          disabled={assignedCourses.length === 0}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors text-sm font-bold shadow-lg ${
            assignedCourses.length > 0
              ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-500/20'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          <Plus size={16} /> Create Assignment
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 flex flex-col lg:flex-row gap-4">
        <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-900 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('active')}
            className={`px-3 py-1.5 text-xs font-bold rounded ${
              activeTab === 'active' ? 'bg-white dark:bg-gray-700 text-blue-600 shadow-sm' : 'text-gray-500'
            }`}
          >
            Active
          </button>
          <button
            onClick={() => setActiveTab('draft')}
            className={`px-3 py-1.5 text-xs font-bold rounded ${
              activeTab === 'draft' ? 'bg-white dark:bg-gray-700 text-blue-600 shadow-sm' : 'text-gray-500'
            }`}
          >
            Drafts
          </button>
          <button
            onClick={() => setActiveTab('closed')}
            className={`px-3 py-1.5 text-xs font-bold rounded ${
              activeTab === 'closed' ? 'bg-white dark:bg-gray-700 text-blue-600 shadow-sm' : 'text-gray-500'
            }`}
          >
            Closed
          </button>
        </div>

        <div className="flex gap-3 items-center lg:ml-auto">
          <div className="relative">
            <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <select
              value={selectedCourse}
              onChange={e => setSelectedCourse(e.target.value)}
              className="pl-9 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All My Courses</option>
              {assignedCourses.map(c => (
                <option key={c.id} value={c.code}>
                  {c.code} - {c.title}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2 text-gray-500">
            <Filter size={16} />
            <span className="text-xs font-bold uppercase">Assigned Only</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAssignments.map(a => (
          <div key={a.id} className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-xs font-bold text-blue-600 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded-md mb-2 inline-block">
                  {a.courseCode}
                </span>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">{a.title}</h3>
                <p className="text-xs text-gray-500 mt-1">{a.courseTitle}</p>
              </div>
              {badge(a.status)}
            </div>

            <div className="mt-4 text-sm text-gray-600 dark:text-gray-300 line-clamp-3">{a.instructions}</div>

            <div className="mt-5 grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                <Calendar size={16} className="text-gray-400" />
                <span>{a.dueDate || '-'}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                <Clock size={16} className="text-gray-400" />
                <span>{a.dueTime || '-'}</span>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
              <div className="text-sm font-bold text-gray-900 dark:text-white">{a.maxScore} pts</div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openEdit(a)}
                  className="px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg text-sm font-bold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(a.id)}
                  className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 transition-colors"
                  title="Delete"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredAssignments.length === 0 && (
          <div className="col-span-full text-center py-16 text-gray-500">
            No assignments found for your assigned courses.
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl border border-gray-200 dark:border-gray-700">
            <div className="sticky top-0 bg-white dark:bg-gray-800 p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center z-10">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">{editingId ? 'Edit Assignment' : 'Create Assignment'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Course</label>
                  <select
                    value={formData.courseCode}
                    onChange={e => setFormData(prev => ({ ...prev, courseCode: e.target.value }))}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                  >
                    <option value="" disabled>
                      Select Course
                    </option>
                    {assignedCourses.map(c => (
                      <option key={c.id} value={c.code}>
                        {c.code} - {c.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Status</label>
                  <select
                    value={formData.status}
                    onChange={e => setFormData(prev => ({ ...prev, status: e.target.value as AssignmentStatus }))}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="Active">Active</option>
                    <option value="Draft">Draft</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Assignment Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Instructions</label>
                <textarea
                  value={formData.instructions}
                  onChange={e => setFormData(prev => ({ ...prev, instructions: e.target.value }))}
                  rows={4}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Due Date</label>
                  <input
                    type="date"
                    value={formData.dueDate}
                    onChange={e => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Due Time</label>
                  <input
                    type="time"
                    value={formData.dueTime}
                    onChange={e => setFormData(prev => ({ ...prev, dueTime: e.target.value }))}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Maximum Score</label>
                  <input
                    type="number"
                    value={formData.maxScore}
                    onChange={e => setFormData(prev => ({ ...prev, maxScore: Number(e.target.value) }))}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
                    min={1}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Submission Type</label>
                <select
                  value={formData.submissionType}
                  onChange={e => setFormData(prev => ({ ...prev, submissionType: e.target.value as SubmissionType }))}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="File Upload">File Upload</option>
                  <option value="Text Entry">Text Entry</option>
                  <option value="Link">Link</option>
                </select>
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
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors shadow-lg shadow-blue-500/20 flex items-center gap-2"
                >
                  <Save size={16} /> Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffAssignments;

