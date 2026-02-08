import React, { useState } from 'react';
import { Upload, FileSpreadsheet, CheckCircle, AlertCircle, Download } from 'lucide-react';

const ScoreUpload = () => {
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
    // Simulate upload
    setTimeout(() => {
      setUploadStatus('success');
    }, 2000);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Score Upload</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Batch upload student scores via Excel templates.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
          <Download size={16} />
          Download Template
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
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
    </div>
  );
};

export default ScoreUpload;
