import React, { useState } from 'react';
import { 
  BookOpen, 
  Upload, 
  Download,
  Save,
  Clock,
  CheckCircle
} from 'lucide-react';

interface Course {
  id: string;
  code: string;
  title: string;
  level: string;
  students: number;
  status: 'Pending' | 'Draft' | 'Submitted' | 'Approved' | 'Published';
  deadline: string;
}

interface StudentScore {
  matricNumber: string;
  name: string;
  caScore: number;
  examScore: number;
  total: number;
  grade: string;
}

const StaffGrading = () => {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [activeTab, setActiveTab] = useState<'upload' | 'manual'>('manual');

  // Upload State
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.name.endsWith('.xlsx') || droppedFile.name.endsWith('.csv')) {
        setFile(droppedFile);
        setUploadStatus('idle');
      } else {
        alert('Please upload an Excel or CSV file.');
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setUploadStatus('idle');
    }
  };

  const handleUpload = () => {
    if (!file) return;
    setUploadStatus('uploading');
    setTimeout(() => {
      setUploadStatus('success');
    }, 2000);
  };
  
  // Mock Data for Lecturer's Courses
  const myCourses: Course[] = [
    { 
      id: '1', 
      code: 'CSC 401', 
      title: 'Advanced Software Engineering', 
      level: '400', 
      students: 45, 
      status: 'Draft',
      deadline: '2025-10-30'
    },
    { 
      id: '2', 
      code: 'CSC 202', 
      title: 'Introduction to Algorithms', 
      level: '200', 
      students: 82, 
      status: 'Submitted',
      deadline: '2025-10-30'
    },
    { 
      id: '3', 
      code: 'CSC 499', 
      title: 'Final Year Project', 
      level: '400', 
      students: 15, 
      status: 'Pending',
      deadline: '2025-11-15'
    }
  ];

  // Mock Students for Manual Entry
  const [students, setStudents] = useState<StudentScore[]>([
    { matricNumber: 'CSC/2021/001', name: 'Musa Ibrahim', caScore: 24, examScore: 0, total: 24, grade: 'F' },
    { matricNumber: 'CSC/2021/002', name: 'Sarah Okon', caScore: 26, examScore: 0, total: 26, grade: 'F' },
    { matricNumber: 'CSC/2021/003', name: 'Emeka Nnamdi', caScore: 22, examScore: 0, total: 22, grade: 'F' },
    { matricNumber: 'CSC/2021/004', name: 'Zainab Ali', caScore: 28, examScore: 0, total: 28, grade: 'F' },
    { matricNumber: 'CSC/2021/005', name: 'David West', caScore: 25, examScore: 0, total: 25, grade: 'F' },
  ]);

  const handleScoreChange = (index: number, field: 'caScore' | 'examScore', value: string) => {
    const numValue = Math.min(Math.max(0, Number(value)), field === 'caScore' ? 30 : 70);
    
    const updatedStudents = [...students];
    updatedStudents[index] = {
      ...updatedStudents[index],
      [field]: numValue,
      total: field === 'caScore' 
        ? numValue + updatedStudents[index].examScore 
        : updatedStudents[index].caScore + numValue
    };
    
    // Recalculate Grade
    const total = updatedStudents[index].total;
    let grade = 'F';
    if (total >= 70) grade = 'A';
    else if (total >= 60) grade = 'B';
    else if (total >= 50) grade = 'C';
    else if (total >= 45) grade = 'D';
    
    updatedStudents[index].grade = grade;
    setStudents(updatedStudents);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Published': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'Approved': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'Submitted': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'Draft': return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Grading & Results</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage and upload scores for your assigned courses.</p>
        </div>
      </div>

      {!selectedCourse ? (
        // Course List View
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myCourses.map((course) => (
            <div 
              key={course.id}
              onClick={() => setSelectedCourse(course)}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 cursor-pointer hover:shadow-md transition-shadow group"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg group-hover:bg-blue-100 dark:group-hover:bg-blue-900/40 transition-colors">
                  <BookOpen className="text-blue-600 dark:text-blue-400" size={24} />
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(course.status)}`}>
                  {course.status}
                </span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{course.code}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">{course.title}</p>
              
              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 border-t border-gray-100 dark:border-gray-700 pt-4">
                <span>{course.students} Students</span>
                <span className="flex items-center gap-1 text-orange-600">
                  <Clock size={12} />
                  Due: {course.deadline}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        // Course Detail / Grading View
        <div className="space-y-6">
          <button 
            onClick={() => setSelectedCourse(null)}
            className="text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white flex items-center gap-2"
          >
            ← Back to Courses
          </button>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">{selectedCourse.code} - Grading</h2>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedCourse.status)}`}>
                    {selectedCourse.status}
                  </span>
                </div>
                <p className="text-gray-500 dark:text-gray-400 mt-1">{selectedCourse.title}</p>
              </div>
              
              <div className="flex gap-3">
                 <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
                  <Download size={18} />
                  <span>Template</span>
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                  <Save size={18} />
                  <span>Save Draft</span>
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
              <button
                onClick={() => setActiveTab('manual')}
                className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'manual'
                    ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                Manual Entry
              </button>
              <button
                onClick={() => setActiveTab('upload')}
                className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'upload'
                    ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                Bulk Upload
              </button>
            </div>

            {activeTab === 'manual' ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
                      <th className="px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Matric No.</th>
                      <th className="px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Student Name</th>
                      <th className="px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase w-32">CA (30)</th>
                      <th className="px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase w-32">Exam (70)</th>
                      <th className="px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase w-24">Total</th>
                      <th className="px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase w-24">Grade</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {students.map((student, index) => (
                      <tr key={student.matricNumber} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-white font-medium">{student.matricNumber}</td>
                        <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{student.name}</td>
                        <td className="px-4 py-3">
                          <input 
                            type="number" 
                            max="30"
                            value={student.caScore}
                            onChange={(e) => handleScoreChange(index, 'caScore', e.target.value)}
                            className="w-full px-2 py-1 text-sm border border-gray-200 dark:border-gray-700 rounded bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <input 
                            type="number" 
                            max="70"
                            value={student.examScore}
                            onChange={(e) => handleScoreChange(index, 'examScore', e.target.value)}
                            className="w-full px-2 py-1 text-sm border border-gray-200 dark:border-gray-700 rounded bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </td>
                        <td className="px-4 py-3 text-sm font-bold text-gray-900 dark:text-white">{student.total}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded text-xs font-bold ${
                            student.grade === 'F' ? 'bg-red-100 text-red-700' : 
                            student.grade === 'A' ? 'bg-green-100 text-green-700' : 
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {student.grade}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div 
                className={`border-2 border-dashed rounded-xl p-12 flex flex-col items-center justify-center transition-colors ${
                  isDragging 
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                    : 'border-gray-300 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-600'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-4">
                  <Upload className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {file ? file.name : 'Drag and drop your file here'}
                </h3>
                
                <p className="text-gray-500 dark:text-gray-400 text-center max-w-md mb-6">
                  {file 
                    ? `${(file.size / 1024).toFixed(2)} KB` 
                    : 'Upload the Excel template containing student scores. Ensure all matric numbers match.'}
                </p>

                {!file && (
                  <label className="cursor-pointer">
                    <span className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors inline-block">
                      Browse Files
                    </span>
                    <input 
                      type="file" 
                      className="hidden" 
                      accept=".xlsx,.csv"
                      onChange={handleFileSelect}
                    />
                  </label>
                )}

                {file && uploadStatus !== 'success' && (
                  <div className="flex gap-3">
                    <button 
                      onClick={() => setFile(null)}
                      className="px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={handleUpload}
                      disabled={uploadStatus === 'uploading'}
                      className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {uploadStatus === 'uploading' ? 'Uploading...' : 'Upload Scores'}
                    </button>
                  </div>
                )}

                {uploadStatus === 'success' && (
                  <div className="flex flex-col items-center animate-in fade-in zoom-in duration-300">
                    <div className="flex items-center gap-2 text-green-600 dark:text-green-400 font-bold text-lg mb-4">
                      <CheckCircle size={24} />
                      Upload Successful!
                    </div>
                    <button 
                      onClick={() => {
                        setFile(null);
                        setUploadStatus('idle');
                      }}
                      className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
                    >
                      Upload another file
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffGrading;
