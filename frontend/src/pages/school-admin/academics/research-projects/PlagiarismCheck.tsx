import { useMemo, useState } from 'react';
import { AlertTriangle, CheckCircle, FileText, RefreshCw, Upload, Filter } from 'lucide-react';

interface ProjectFile {
  id: number;
  faculty: string;
  department: string;
  programme: string;
  projectTitle: string;
  student: string;
  fileName: string;
}

interface PlagiarismResult {
  similarity: number;
  sources: Array<{ name: string; match: string }>;
}

const PlagiarismCheck = () => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [selectedFaculty, setSelectedFaculty] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedProgramme, setSelectedProgramme] = useState('');
  const [selectedProjectFileId, setSelectedProjectFileId] = useState<number | null>(null);
  const [checking, setChecking] = useState(false);
  const [result, setResult] = useState<PlagiarismResult | null>(null);

  const faculties = ['Faculty of Sciences', 'Faculty of Engineering', 'Faculty of Arts', 'Faculty of Environmental Sciences'];

  const departmentsByFaculty: Record<string, string[]> = {
    'Faculty of Sciences': ['Computer Science', 'Biology', 'Physics', 'Mathematics'],
    'Faculty of Engineering': ['Electrical Engineering', 'Mechanical Engineering'],
    'Faculty of Arts': ['English', 'History'],
    'Faculty of Environmental Sciences': ['Architecture']
  };

  const programmesByDepartment: Record<string, string[]> = {
    'Computer Science': ['HND Computer Science'],
    Biology: ['HND Biology'],
    Physics: ['HND Physics'],
    Mathematics: ['HND Mathematics'],
    'Electrical Engineering': ['B.Eng Electrical Engineering'],
    'Mechanical Engineering': ['B.Eng Mechanical Engineering'],
    English: ['B.A English'],
    History: ['B.A History'],
    Architecture: ['HND Architecture']
  };

  const projectFiles: ProjectFile[] = [
    {
      id: 1,
      faculty: 'Faculty of Sciences',
      department: 'Computer Science',
      programme: 'HND Computer Science',
      projectTitle: 'AI in Healthcare Diagnostics',
      student: 'John Doe',
      fileName: 'Project_Proposal.pdf'
    },
    {
      id: 2,
      faculty: 'Faculty of Sciences',
      department: 'Computer Science',
      programme: 'HND Computer Science',
      projectTitle: 'Blockchain for Voting Systems',
      student: 'Michael Brown',
      fileName: 'Chapter_2_Literature_Review.docx'
    },
    {
      id: 3,
      faculty: 'Faculty of Environmental Sciences',
      department: 'Architecture',
      programme: 'HND Architecture',
      projectTitle: 'Sustainable Urban Planning',
      student: 'Jane Smith',
      fileName: 'Chapter_1_Introduction.pdf'
    }
  ];

  const availableDepartments = useMemo(() => {
    if (!selectedFaculty) return [];
    return departmentsByFaculty[selectedFaculty] ?? [];
  }, [selectedFaculty]);

  const availableProgrammes = useMemo(() => {
    if (!selectedDepartment) return [];
    return programmesByDepartment[selectedDepartment] ?? [];
  }, [selectedDepartment]);

  const filteredProjectFiles = useMemo(() => {
    return projectFiles.filter((p) => {
      const matchesFaculty = !selectedFaculty || p.faculty === selectedFaculty;
      const matchesDepartment = !selectedDepartment || p.department === selectedDepartment;
      const matchesProgramme = !selectedProgramme || p.programme === selectedProgramme;
      return matchesFaculty && matchesDepartment && matchesProgramme;
    });
  }, [projectFiles, selectedFaculty, selectedDepartment, selectedProgramme]);

  const canRun = Boolean(uploadedFile) || Boolean(selectedProjectFileId);

  const resetSelectionFilters = () => {
    setSelectedFaculty('');
    setSelectedDepartment('');
    setSelectedProgramme('');
    setSelectedProjectFileId(null);
  };

  const resetUpload = () => {
    setUploadedFile(null);
  };

  const handleFilePick = (file: File | null) => {
    setUploadedFile(file);
    if (file) {
      setSelectedProjectFileId(null);
      resetSelectionFilters();
    }
  };

  const handleSelectProjectFile = (id: number | null) => {
    setSelectedProjectFileId(id);
    if (id) {
      resetUpload();
    }
  };

  const runCheck = () => {
    if (!canRun || checking) return;
    setChecking(true);
    setResult(null);

    window.setTimeout(() => {
      const base = selectedProjectFileId ? 18 : 12;
      const variance = selectedProjectFileId ? 34 : 20;
      const similarity = Math.max(1, Math.min(95, Math.round(base + Math.random() * variance)));

      const sources = [
        { name: 'University Archive', match: `${Math.max(1, Math.round(similarity * 0.4))}%` },
        { name: 'Online Sources', match: `${Math.max(1, Math.round(similarity * 0.35))}%` },
        { name: 'Academic Journals', match: `${Math.max(1, Math.round(similarity * 0.25))}%` }
      ];

      setChecking(false);
      setResult({ similarity, sources });
    }, 1700);
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <AlertTriangle className="text-red-600" />
            Plagiarism
          </h1>
          <p className="text-gray-500 dark:text-gray-400">Upload a document or select a project file to run a plagiarism check.</p>
        </div>
        <button
          onClick={() => {
            setResult(null);
            setChecking(false);
            resetUpload();
            resetSelectionFilters();
          }}
          className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm font-medium shadow-sm"
        >
          <RefreshCw size={16} />
          Reset
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-dashed border-gray-300 dark:border-gray-700 p-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
              <Upload size={22} className="text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Upload File</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Supported formats: PDF, DOCX, TXT</p>
            </div>
          </div>

          <div className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl p-6 bg-gray-50 dark:bg-gray-900/50">
            <input
              type="file"
              id="plagiarism-upload"
              className="hidden"
              onChange={(e) => handleFilePick(e.target.files?.[0] ?? null)}
            />
            <label htmlFor="plagiarism-upload" className="block cursor-pointer text-center">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {uploadedFile ? uploadedFile.name : 'Click to choose a file'}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {uploadedFile ? `${Math.max(1, Math.round(uploadedFile.size / 1024))} KB` : 'Max. 50MB recommended'}
              </p>
            </label>
          </div>

          <button
            onClick={runCheck}
            disabled={!canRun || checking}
            className={`w-full mt-4 text-white font-medium py-3 rounded-lg transition-colors flex items-center justify-center gap-2 ${
              !canRun || checking ? 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {checking ? (
              <>
                <RefreshCw className="animate-spin" size={20} />
                Running Analysis...
              </>
            ) : (
              'Run Check'
            )}
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 bg-amber-50 dark:bg-amber-900/20 rounded-full flex items-center justify-center">
              <Filter size={18} className="text-amber-700 dark:text-amber-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Select Project File</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Filter and select a project file from the system.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Faculty</label>
              <select
                value={selectedFaculty}
                onChange={(e) => {
                  const next = e.target.value;
                  setSelectedFaculty(next);
                  setSelectedDepartment('');
                  setSelectedProgramme('');
                  setSelectedProjectFileId(null);
                }}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Faculties</option>
                {faculties.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Department</label>
              <select
                value={selectedDepartment}
                onChange={(e) => {
                  const next = e.target.value;
                  setSelectedDepartment(next);
                  setSelectedProgramme('');
                  setSelectedProjectFileId(null);
                }}
                disabled={!selectedFaculty}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              >
                <option value="">{selectedFaculty ? 'All Departments' : 'Select Faculty first'}</option>
                {availableDepartments.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Programme</label>
              <select
                value={selectedProgramme}
                onChange={(e) => {
                  setSelectedProgramme(e.target.value);
                  setSelectedProjectFileId(null);
                }}
                disabled={!selectedDepartment}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              >
                <option value="">{selectedDepartment ? 'All Programmes' : 'Select Department first'}</option>
                {availableProgrammes.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Project File</label>
            <select
              value={selectedProjectFileId ?? ''}
              onChange={(e) => handleSelectProjectFile(e.target.value ? Number(e.target.value) : null)}
              className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">
                {filteredProjectFiles.length ? 'Select a project file' : 'No files found for this filter'}
              </option>
              {filteredProjectFiles.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.student} - {p.projectTitle} ({p.fileName})
                </option>
              ))}
            </select>
          </div>

          <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-700">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
                <FileText size={20} className="text-gray-500" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-gray-900 dark:text-white">Selected</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {selectedProjectFileId
                    ? filteredProjectFiles.find((p) => p.id === selectedProjectFileId)?.fileName
                    : 'No project file selected'}
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={runCheck}
            disabled={!canRun || checking}
            className={`w-full mt-4 text-white font-medium py-3 rounded-lg transition-colors flex items-center justify-center gap-2 ${
              !canRun || checking ? 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {checking ? (
              <>
                <RefreshCw className="animate-spin" size={20} />
                Running Analysis...
              </>
            ) : (
              'Run Check'
            )}
          </button>
        </div>
      </div>

      {result && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center gap-4 mb-6">
            <div
              className={`p-3 rounded-full ${
                result.similarity < 15 ? 'bg-green-100 text-green-600' : result.similarity < 35 ? 'bg-amber-100 text-amber-600' : 'bg-red-100 text-red-600'
              }`}
            >
              {result.similarity < 35 ? <CheckCircle size={32} /> : <AlertTriangle size={32} />}
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Analysis Complete</h3>
              <p className="text-gray-500 dark:text-gray-400">
                Similarity Score:{' '}
                <span
                  className={`font-bold ${
                    result.similarity < 15 ? 'text-green-600' : result.similarity < 35 ? 'text-amber-600' : 'text-red-600'
                  }`}
                >
                  {result.similarity}%
                </span>
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-sm text-gray-500 uppercase">Matched Sources</h4>
            {result.sources.map((source, idx) => (
              <div key={idx} className="flex justify-between p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                <span className="text-gray-700 dark:text-gray-300">{source.name}</span>
                <span className="font-medium text-red-500">{source.match}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PlagiarismCheck;
