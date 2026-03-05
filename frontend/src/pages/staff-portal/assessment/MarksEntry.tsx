import React, { useState, useMemo } from 'react';
import { FileSpreadsheet, CheckCircle, AlertCircle, Download, Save, Search, Send } from 'lucide-react';
import { getAssignedCourses } from '../academics/assignedCourses';

interface StudentScore {
  id: string;
  matricNo: string;
  name: string;
  caScore: string;
  examScore: string;
}

const MarksEntry: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'manual' | 'upload'>('manual');
  const assignedCourses = useMemo(() => getAssignedCourses(), []);
  const [selectedCourse, setSelectedCourse] = useState(assignedCourses[0]?.code || '');
  
  // File Upload State
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');

  // Manual Entry State
  const [searchTerm, setSearchTerm] = useState('');
  const [manualScores, setManualScores] = useState<StudentScore[]>([
    { id: '1', matricNo: 'SCI/20/0123', name: 'Adewale Johnson', caScore: '24', examScore: '58' },
    { id: '2', matricNo: 'SCI/20/0124', name: 'Chioma Okonkwo', caScore: '18', examScore: '' },
    { id: '3', matricNo: 'SCI/20/0125', name: 'Ibrahim Musa', caScore: '', examScore: '' },
    { id: '4', matricNo: 'SCI/20/0126', name: 'Sarah Williams', caScore: '28', examScore: '65' },
    { id: '5', matricNo: 'SCI/20/0127', name: 'Emmanuel Eze', caScore: '15', examScore: '42' },
  ]);

  // Helper Functions
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
    setTimeout(() => {
      setUploadStatus('success');
    }, 2000);
  };

  const handleForwardToHOD = () => {
    if (window.confirm('Are you sure you want to forward these results to the HOD? You will not be able to edit them afterwards.')) {
      alert('Results forwarded to HOD successfully!');
      // In a real app, this would trigger an API call and lock the results
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Marks Entry</h1>
          <p className="text-gray-500 dark:text-gray-400">Record and submit student assessments.</p>
        </div>
        <div className="flex items-center gap-3">
          <select 
            value={selectedCourse} 
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="p-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none"
          >
            {assignedCourses.map(c => (
              <option key={c.id} value={c.code}>{c.code} - {c.title}</option>
            ))}
          </select>
          <button 
            onClick={handleForwardToHOD}
            className="flex items-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium shadow-sm shadow-green-600/20"
          >
            <Send size={18} />
            Forward to HOD
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <div className="flex">
            <button
              onClick={() => setActiveTab('manual')}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'manual'
                  ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              Manual Entry
            </button>
            <button
              onClick={() => setActiveTab('upload')}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'upload'
                  ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              Bulk Upload
            </button>
          </div>
        </div>

        <div className="p-6">
          {activeTab === 'manual' ? (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-4 justify-between">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    placeholder="Search student name or matric number..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex gap-2">
                  <button className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                    <Save size={18} />
                    <span>Save Draft</span>
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-gray-50 dark:bg-gray-900/50">
                    <tr>
                      <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-200 dark:border-gray-700">Student</th>
                      <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-200 dark:border-gray-700">Matric No</th>
                      <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-200 dark:border-gray-700 w-32">CA (30)</th>
                      <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-200 dark:border-gray-700 w-32">Exam (70)</th>
                      <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-200 dark:border-gray-700 w-24">Total</th>
                      <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-200 dark:border-gray-700 w-24">Grade</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                    {filteredStudents.map((student) => {
                      const total = calculateTotal(student.caScore, student.examScore);
                      const { grade, color } = getGrade(total);
                      return (
                        <tr key={student.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/20">
                          <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{student.name}</td>
                          <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 font-mono">{student.matricNo}</td>
                          <td className="px-6 py-4">
                            <input
                              type="number"
                              min="0"
                              max="30"
                              value={student.caScore}
                              onChange={(e) => handleScoreChange(student.id, 'caScore', e.target.value)}
                              className="w-full p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md focus:ring-2 focus:ring-blue-500 outline-none text-center"
                            />
                          </td>
                          <td className="px-6 py-4">
                            <input
                              type="number"
                              min="0"
                              max="70"
                              value={student.examScore}
                              onChange={(e) => handleScoreChange(student.id, 'examScore', e.target.value)}
                              className="w-full p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md focus:ring-2 focus:ring-blue-500 outline-none text-center"
                            />
                          </td>
                          <td className="px-6 py-4 text-center font-bold text-gray-700 dark:text-gray-300">
                            {student.caScore && student.examScore ? total : '-'}
                          </td>
                          <td className="px-6 py-4 text-center">
                            {student.caScore && student.examScore ? (
                              <span className={`px-2 py-1 rounded text-xs font-bold ${color}`}>
                                {grade}
                              </span>
                            ) : '-'}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="max-w-2xl mx-auto space-y-8 py-8">
              <div 
                className={`border-2 border-dashed rounded-2xl p-10 text-center transition-all ${
                  isDragging 
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                    : 'border-gray-300 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-500'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/30 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileSpreadsheet size={32} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                  Upload Results File
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-sm mx-auto">
                  Drag and drop your Excel or CSV file here, or click to browse.
                  Ensure the file follows the required template.
                </p>
                
                <input 
                  type="file" 
                  id="file-upload" 
                  className="hidden" 
                  accept=".csv, .xlsx, .xls"
                  onChange={handleFileSelect}
                />
                
                <div className="flex justify-center gap-4">
                  <label 
                    htmlFor="file-upload"
                    className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer font-medium transition-colors"
                  >
                    Select File
                  </label>
                  <button className="px-6 py-2.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 font-medium transition-colors flex items-center gap-2">
                    <Download size={18} /> Template
                  </button>
                </div>
              </div>

              {file && (
                <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-4 border border-gray-200 dark:border-gray-700 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileSpreadsheet className="text-green-600" size={24} />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{file.name}</p>
                      <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(2)} KB</p>
                    </div>
                  </div>
                  {uploadStatus === 'success' ? (
                    <span className="flex items-center gap-2 text-green-600 font-medium text-sm">
                      <CheckCircle size={16} /> Uploaded
                    </span>
                  ) : uploadStatus === 'uploading' ? (
                    <span className="text-blue-600 font-medium text-sm animate-pulse">Uploading...</span>
                  ) : (
                    <button 
                      onClick={handleUpload}
                      className="px-4 py-1.5 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
                    >
                      Upload
                    </button>
                  )}
                </div>
              )}

              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl flex gap-3 text-sm text-blue-800 dark:text-blue-300">
                <AlertCircle className="shrink-0 mt-0.5" size={18} />
                <p>
                  Please ensure your file columns match: <strong>Matric Number, CA Score, Exam Score</strong>. 
                  Any rows with errors will be highlighted for manual correction after upload.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MarksEntry;
