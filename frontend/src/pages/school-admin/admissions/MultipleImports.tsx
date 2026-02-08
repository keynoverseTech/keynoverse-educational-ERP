import React, { useState, useRef } from 'react';
import { Upload, Check, ArrowRight, Download } from 'lucide-react';

interface ImportedApplicant {
  id: string;
  name: string;
  jambNo: string;
  score: number;
  course: string;
  status: 'Valid' | 'Error';
  message?: string;
}

const MultipleImports: React.FC = () => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [parsedData, setParsedData] = useState<ImportedApplicant[]>([]);
  const [importStats, setImportStats] = useState({ total: 0, success: 0, failed: 0 });
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (selectedFile: File) => {
    // const validTypes = ['text/csv', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
    // For demo purposes, we accept any file, but in production we'd check types
    // if (!validTypes.includes(selectedFile.type)) {
    //   alert('Invalid file type. Please upload CSV or Excel.');
    //   return;
    // }
    setFile(selectedFile);
    // Simulate parsing
    parseFile(selectedFile);
  };

  const parseFile = (_file: File) => {
    // Mock parsing logic
    setTimeout(() => {
      const mockData: ImportedApplicant[] = [
        { id: '1', name: 'John Doe', jambNo: '2024987654', score: 245, course: 'Computer Science', status: 'Valid' },
        { id: '2', name: 'Jane Smith', jambNo: '2024123456', score: 180, course: 'Accounting', status: 'Valid' },
        { id: '3', name: 'Michael Brown', jambNo: '2024567890', score: 280, course: 'Medicine', status: 'Valid' },
        { id: '4', name: 'Sarah Wilson', jambNo: '2024234567', score: 150, course: 'Mass Communication', status: 'Error', message: 'Score below cutoff' },
        { id: '5', name: 'David Lee', jambNo: 'DE2024001', score: 0, course: 'Computer Engineering', status: 'Valid' },
      ];
      setParsedData(mockData);
      setStep(2);
    }, 1500);
  };

  const handleImport = () => {
    // Simulate API import call
    const successCount = parsedData.filter(d => d.status === 'Valid').length;
    const failedCount = parsedData.filter(d => d.status === 'Error').length;
    
    setImportStats({
      total: parsedData.length,
      success: successCount,
      failed: failedCount
    });
    setStep(3);
  };

  const resetFlow = () => {
    setFile(null);
    setParsedData([]);
    setStep(1);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Batch Import Applications</h1>
        <p className="text-gray-500 dark:text-gray-400">Upload CSV or Excel files to bulk import applicants</p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-center mb-10">
        <div className={`flex items-center ${step >= 1 ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step >= 1 ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-300'}`}>1</div>
          <span className="ml-2 font-medium">Upload</span>
        </div>
        <div className={`w-24 h-1 mx-4 ${step >= 2 ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'}`}></div>
        <div className={`flex items-center ${step >= 2 ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step >= 2 ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-300'}`}>2</div>
          <span className="ml-2 font-medium">Preview</span>
        </div>
        <div className={`w-24 h-1 mx-4 ${step >= 3 ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'}`}></div>
        <div className={`flex items-center ${step >= 3 ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step >= 3 ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-300'}`}>3</div>
          <span className="ml-2 font-medium">Result</span>
        </div>
      </div>

      {/* Step 1: Upload */}
      {step === 1 && (
        <div className="max-w-2xl mx-auto">
          <div 
            className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors ${
              isDragging 
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/10' 
                : 'border-gray-300 dark:border-gray-700 hover:border-gray-400'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <Upload size={32} />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {file ? file.name : 'Drag and drop your file here'}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Supported formats: CSV, Excel (.xlsx, .xls)
            </p>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept=".csv,.xlsx,.xls"
              onChange={handleFileSelect}
            />
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
            >
              Browse Files
            </button>
          </div>

          <div className="mt-8 bg-blue-50 dark:bg-blue-900/10 rounded-lg p-4 border border-blue-100 dark:border-blue-800">
            <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-2 flex items-center">
              <Download size={16} className="mr-2" />
              Download Template
            </h4>
            <p className="text-sm text-blue-600 dark:text-blue-400 mb-3">
              Use our standard template to ensure correct data formatting.
            </p>
            <button className="text-sm font-medium text-blue-700 dark:text-blue-300 hover:underline">
              Download CSV Template
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Preview */}
      {step === 2 && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Preview Data ({parsedData.length} records)</h3>
            <div className="flex space-x-3">
              <button 
                onClick={resetFlow}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                Cancel
              </button>
              <button 
                onClick={handleImport}
                className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 flex items-center"
              >
                Import Data <ArrowRight size={16} className="ml-2" />
              </button>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">JAMB No</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Score</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Course</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Issues</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {parsedData.map((row) => (
                    <tr key={row.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        {row.status === 'Valid' ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                            Valid
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                            Error
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{row.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{row.jambNo}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{row.score}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{row.course}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-red-500">{row.message || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Result */}
      {step === 3 && (
        <div className="max-w-md mx-auto text-center pt-10">
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check size={40} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Import Completed</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-8">
            Your data has been successfully processed.
          </p>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
            <div className="grid grid-cols-3 gap-4 divide-x divide-gray-200 dark:divide-gray-700">
              <div>
                <p className="text-xs text-gray-500 uppercase">Total</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{importStats.total}</p>
              </div>
              <div>
                <p className="text-xs text-green-600 uppercase">Success</p>
                <p className="text-2xl font-bold text-green-600">{importStats.success}</p>
              </div>
              <div>
                <p className="text-xs text-red-500 uppercase">Failed</p>
                <p className="text-2xl font-bold text-red-500">{importStats.failed}</p>
              </div>
            </div>
          </div>

          <button 
            onClick={resetFlow}
            className="w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
          >
            Import Another File
          </button>
        </div>
      )}
    </div>
  );
};

export default MultipleImports;
