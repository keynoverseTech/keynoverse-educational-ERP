import React, { useState, useMemo } from 'react';
import { Upload, FileSpreadsheet, CheckCircle, AlertCircle, Download, Save, Search, ChevronDown } from 'lucide-react';

interface StudentScore {
  id: string;
  matricNo: string;
  name: string;
  caScore: string; // string to handle empty inputs
  examScore: string;
}

const ScoreUpload = () => {
  const [activeTab, setActiveTab] = useState<'upload' | 'manual'>('upload');
  
  // File Upload State
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');

  // Manual Entry State
  const [selectedCourse, setSelectedCourse] = useState('CSC 301');
  const [searchTerm, setSearchTerm] = useState('');
  const [manualScores, setManualScores] = useState<StudentScore[]>([
    { id: '1', matricNo: 'SCI/20/0123', name: 'Adewale Johnson', caScore: '24', examScore: '58' },
    { id: '2', matricNo: 'SCI/20/0124', name: 'Chioma Okonkwo', caScore: '18', examScore: '' },
    { id: '3', matricNo: 'SCI/20/0125', name: 'Ibrahim Musa', caScore: '', examScore: '' },
    { id: '4', matricNo: 'SCI/20/0126', name: 'Sarah Williams', caScore: '28', examScore: '65' },
    { id: '5', matricNo: 'SCI/20/0127', name: 'Emmanuel Eze', caScore: '15', examScore: '42' },
  ]);

  const courses = [
    { code: 'CSC 301', title: 'Operating Systems' },
    { code: 'MTH 201', title: 'Linear Algebra' },
    { code: 'PHY 101', title: 'General Physics' },
    { code: 'GNS 101', title: 'Use of English' },
  ];

  // Helper Functions for Manual Entry
  const calculateTotal = (ca: string, exam: string) => {
    const caNum = parseFloat(ca) || 0;
    const examNum = parseFloat(exam) || 0;
    return caNum + examNum;
  };

  const getGrade = (total: number) => {
    if (total >= 70) return { grade: 'A', color: 'text-green-600 bg-green-50' };
    if (total >= 60) return { grade: 'B', color: 'text-blue-600 bg-blue-50' };
    if (total >= 50) return { grade: 'C', color: 'text-yellow-600 bg-yellow-50' };
    if (total >= 45) return { grade: 'D', color: 'text-orange-600 bg-orange-50' };
    if (total >= 40) return { grade: 'E', color: 'text-gray-600 bg-gray-50' };
    return { grade: 'F', color: 'text-red-600 bg-red-50' };
  };

  const handleScoreChange = (id: string, field: 'caScore' | 'examScore', value: string) => {
    // Validation: Only numbers, max limits (CA: 30, Exam: 70)
    const numValue = parseFloat(value);
    if (value !== '' && isNaN(numValue)) return;
    
    if (field === 'caScore' && numValue > 30) return;
    if (field === 'examScore' && numValue > 70) return;

    setManualScores(prev => prev.map(student => 
      student.id === id ? { ...student, [field]: value } : student
    ));
  };

  const filteredStudents = useMemo(() => {
    return manualScores.filter(student => 
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.matricNo.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [manualScores, searchTerm]);

  // File Upload Handlers
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
    // Simulate upload
    setTimeout(() => {
      setUploadStatus('success');
    }, 2000);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Score Upload</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage student results via file upload or manual entry.</p>
        </div>
        <div className="bg-gray-100 dark:bg-gray-800 p-1 rounded-lg inline-flex">
          <button
            onClick={() => setActiveTab('upload')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === 'upload'
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            Batch Upload
          </button>
          <button
            onClick={() => setActiveTab('manual')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === 'manual'
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            Manual Entry
          </button>
        </div>
      </div>

      {activeTab === 'upload' ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
           <div className="flex justify-end mb-6">
             <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <Download size={16} />
              Download Template
            </button>
           </div>
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
                : 'Support for .xlsx and .csv files. Ensure you use the standard template format.'}
            </p>

            {!file && (
              <label className="cursor-pointer">
                <span className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
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

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-900/50">
              <FileSpreadsheet className="w-6 h-6 text-green-600 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white text-sm">Excel Template</h4>
                <p className="text-xs text-gray-500 mt-1">Download the official template to avoid formatting errors.</p>
              </div>
            </div>
            <div className="flex gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-900/50">
              <CheckCircle className="w-6 h-6 text-blue-600 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white text-sm">Auto-Validation</h4>
                <p className="text-xs text-gray-500 mt-1">System automatically checks for duplicate matric numbers.</p>
              </div>
            </div>
            <div className="flex gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-900/50">
              <AlertCircle className="w-6 h-6 text-orange-600 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white text-sm">Error Handling</h4>
                <p className="text-xs text-gray-500 mt-1">Detailed error reports for invalid entries or mismatches.</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Manual Entry Header */}
          <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row gap-4 justify-between items-center">
             <div className="relative w-full sm:w-64">
                <select 
                  value={selectedCourse}
                  onChange={(e) => setSelectedCourse(e.target.value)}
                  className="w-full appearance-none pl-4 pr-10 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
                >
                  {courses.map(course => (
                    <option key={course.code} value={course.code}>{course.code} - {course.title}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
             </div>
             
             <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search students..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none dark:text-white"
                />
             </div>
          </div>

          {/* Scores Table */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50 dark:bg-gray-900/50">
                  <tr>
                    <th className="px-6 py-4 text-xs font-medium text-gray-500 uppercase">Student</th>
                    <th className="px-6 py-4 text-xs font-medium text-gray-500 uppercase w-32">CA Score (30)</th>
                    <th className="px-6 py-4 text-xs font-medium text-gray-500 uppercase w-32">Exam Score (70)</th>
                    <th className="px-6 py-4 text-xs font-medium text-gray-500 uppercase w-24">Total</th>
                    <th className="px-6 py-4 text-xs font-medium text-gray-500 uppercase w-24">Grade</th>
                    <th className="px-6 py-4 text-xs font-medium text-gray-500 uppercase w-24">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredStudents.map((student) => {
                    const total = calculateTotal(student.caScore, student.examScore);
                    const { grade, color } = getGrade(total);
                    const isComplete = student.caScore !== '' && student.examScore !== '';
                    
                    return (
                      <tr key={student.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-medium text-xs">
                              {student.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div>
                              <div className="font-medium text-gray-900 dark:text-white">{student.name}</div>
                              <div className="text-xs text-gray-500 font-mono">{student.matricNo}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <input
                            type="number"
                            min="0"
                            max="30"
                            value={student.caScore}
                            onChange={(e) => handleScoreChange(student.id, 'caScore', e.target.value)}
                            className="w-full px-3 py-1.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md text-sm text-center focus:ring-2 focus:ring-blue-500 outline-none dark:text-white"
                            placeholder="0-30"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <input
                            type="number"
                            min="0"
                            max="70"
                            value={student.examScore}
                            onChange={(e) => handleScoreChange(student.id, 'examScore', e.target.value)}
                            className="w-full px-3 py-1.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md text-sm text-center focus:ring-2 focus:ring-blue-500 outline-none dark:text-white"
                            placeholder="0-70"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-bold text-gray-900 dark:text-white text-center">{total}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className={`text-xs font-bold px-2 py-1 rounded text-center w-8 mx-auto ${color}`}>
                            {grade}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {isComplete ? (
                            <div className="flex items-center gap-1 text-green-600 text-xs font-medium">
                              <CheckCircle size={14} /> Ready
                            </div>
                          ) : (
                            <div className="flex items-center gap-1 text-gray-400 text-xs">
                              <AlertCircle size={14} /> Pending
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 flex justify-between items-center">
              <div className="text-sm text-gray-500">
                Showing {filteredStudents.length} students
              </div>
              <div className="flex gap-3">
                <button className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700">
                  Cancel
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center gap-2">
                  <Save size={16} />
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScoreUpload;
