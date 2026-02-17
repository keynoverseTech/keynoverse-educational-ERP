import React, { useState } from 'react';
import { Upload, FileSpreadsheet, AlertCircle, Save } from 'lucide-react';

interface StudentScore {
  matricNumber: string;
  name: string;
  caScore: number;
  examScore: number;
  total: number;
  grade: string;
}

const ScoreUpload = () => {
  const [selectedCourse, setSelectedCourse] = useState('CSC 301');
  const [scores] = useState<StudentScore[]>([
    { matricNumber: 'SCI/20/0123', name: 'John Doe', caScore: 24, examScore: 58, total: 82, grade: 'A' },
    { matricNumber: 'SCI/20/0124', name: 'Jane Smith', caScore: 18, examScore: 45, total: 63, grade: 'B' },
  ]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Mock file upload handling
    console.log('File uploaded:', e.target.files?.[0]);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Score & Attendance Upload</h1>
          <p className="text-gray-500 dark:text-gray-400">Upload Excel sheets for CA and Exam scores.</p>
        </div>
        <div className="flex gap-2">
           <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2">
            <Save size={18} />
            Save Draft
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="font-bold text-gray-900 dark:text-white mb-4">Upload Configuration</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Select Course</label>
                <select 
                  value={selectedCourse}
                  onChange={(e) => setSelectedCourse(e.target.value)}
                  className="w-full border rounded-lg p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="CSC 301">CSC 301 - Operating Systems</option>
                  <option value="MTH 201">MTH 201 - Linear Algebra</option>
                </select>
              </div>
              
              <div className="border-t dark:border-gray-700 pt-4">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Upload Files</p>
                <div className="space-y-3">
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 text-center hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer relative">
                    <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleFileUpload} accept=".csv, .xlsx" />
                    <FileSpreadsheet className="mx-auto text-green-600 mb-2" size={24} />
                    <p className="text-sm text-gray-600 dark:text-gray-400">Click to upload <strong>Score Sheet</strong></p>
                    <p className="text-xs text-gray-400 mt-1">.CSV or .XLSX</p>
                  </div>
                  
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 text-center hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer relative">
                    <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleFileUpload} accept=".pdf, .jpg, .png" />
                    <Upload className="mx-auto text-blue-600 mb-2" size={24} />
                    <p className="text-sm text-gray-600 dark:text-gray-400">Click to upload <strong>Attendance Scans</strong></p>
                    <p className="text-xs text-gray-400 mt-1">.PDF or Images</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h3 className="font-bold text-gray-900 dark:text-white">Score Preview</h3>
              <div className="text-sm text-gray-500">
                Course Weight: <span className="font-medium text-gray-900 dark:text-white">CA (30%) + Exam (70%)</span>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 dark:bg-gray-900/50">
                  <tr>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Matric No</th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Name</th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase text-center">CA (30)</th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase text-center">Exam (70)</th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase text-center">Total</th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase text-center">Grade</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {scores.map((student, idx) => (
                    <tr key={idx}>
                      <td className="px-6 py-3 font-medium text-gray-900 dark:text-white text-sm">{student.matricNumber}</td>
                      <td className="px-6 py-3 text-sm text-gray-500 dark:text-gray-400">{student.name}</td>
                      <td className="px-6 py-3 text-center">
                        <input 
                          type="number" 
                          defaultValue={student.caScore} 
                          className="w-16 p-1 text-center border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm"
                          max={30}
                        />
                      </td>
                      <td className="px-6 py-3 text-center">
                        <input 
                          type="number" 
                          defaultValue={student.examScore} 
                          className="w-16 p-1 text-center border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm"
                          max={70}
                        />
                      </td>
                      <td className="px-6 py-3 text-center font-bold text-gray-900 dark:text-white">{student.total}</td>
                      <td className="px-6 py-3 text-center">
                        <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                          student.grade === 'A' ? 'bg-green-100 text-green-700' : 
                          student.grade === 'F' ? 'bg-red-100 text-red-700' : 
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
            
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/30 text-sm text-gray-500 flex items-center gap-2">
              <AlertCircle size={16} />
              <span>Make sure to verify scores against the physical attendance sheet before saving.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScoreUpload;
