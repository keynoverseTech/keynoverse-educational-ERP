import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  Clock, 
  Building2, 
  Building, 
  GraduationCap, 
  Layers, 
  BookOpen, 
  Settings,
  ArrowRight,
  CheckCircle,
  FileText,
  ShieldCheck,
  Lock
} from 'lucide-react';

export default function ConfigureAcademic() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'setup' | 'research-projects'>('setup');
  const [eligibilityEnabled, setEligibilityEnabled] = useState(false);
  const [eligibleLevels, setEligibleLevels] = useState<string[]>(['ND2', 'HND2']);
  const [minCgpa, setMinCgpa] = useState('');
  const [requiredCourses, setRequiredCourses] = useState('');
  const [restrictedMessage, setRestrictedMessage] = useState('Access restricted. Contact your department for more information.');
  const [saveState, setSaveState] = useState<'idle' | 'saved'>('idle');

  useEffect(() => {
    const raw = localStorage.getItem('research_projects_eligibility');
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw) as {
        enabled?: boolean;
        eligibleLevels?: string[];
        minCgpa?: number | null;
        requiredCourses?: string[];
        restrictedMessage?: string;
      };

      setEligibilityEnabled(Boolean(parsed.enabled));
      setEligibleLevels(Array.isArray(parsed.eligibleLevels) && parsed.eligibleLevels.length ? parsed.eligibleLevels : ['ND2', 'HND2']);
      setMinCgpa(typeof parsed.minCgpa === 'number' ? String(parsed.minCgpa) : '');
      setRequiredCourses(Array.isArray(parsed.requiredCourses) ? parsed.requiredCourses.join(', ') : '');
      setRestrictedMessage(
        typeof parsed.restrictedMessage === 'string' && parsed.restrictedMessage.trim().length
          ? parsed.restrictedMessage
          : 'Access restricted. Contact your department for more information.'
      );
    } catch {
      return;
    }
  }, []);

  const modules = [
    { 
      title: 'Academic Sessions', 
      desc: 'Manage academic years (e.g., 2024/2025) and statuses.', 
      icon: Calendar, 
      path: '/school-admin/academics/sessions',
      color: 'bg-blue-600'
    },
    { 
      title: 'Semesters', 
      desc: 'Configure semesters, durations, and exam periods.', 
      icon: Clock, 
      path: '/school-admin/academics/semesters',
      color: 'bg-purple-600'
    },
    { 
      title: 'Programmes', 
      desc: 'View available degree programmes and durations. Managed by Super Admin.', 
      icon: GraduationCap, 
      path: '/school-admin/academics/programmes',
      color: 'bg-teal-600',
      isManaged: true
    },
    { 
      title: 'Faculties', 
      desc: 'Manage faculties and assign deans.', 
      icon: Building2, 
      path: '/school-admin/academics/faculties',
      color: 'bg-indigo-600'
    },
    { 
      title: 'Departments', 
      desc: 'Create departments and link them to faculties.', 
      icon: Building, 
      path: '/school-admin/academics/departments',
      color: 'bg-cyan-600'
    },
    { 
      title: 'Levels', 
      desc: 'Define academic levels (100, 200, etc.).', 
      icon: Layers, 
      path: '/school-admin/academics/levels',
      color: 'bg-emerald-600'
    },
    { 
      title: 'Course Catalogue', 
      desc: 'Manage course catalogue, codes, and credit units.', 
      icon: BookOpen, 
      path: '/school-admin/academics/courses',
      color: 'bg-orange-600',
      isManaged: false
    },
    { 
      title: 'Course Registration Config', 
      desc: 'Manage credit limits, deadlines, and approval workflows.', 
      icon: FileText, 
      path: '/school-admin/academics/registration-config',
      color: 'bg-blue-600'
    },
    { 
      title: 'Course Pre-requisites', 
      desc: 'Map existing courses to their pre-requisites.', 
      icon: CheckCircle, 
      path: '/school-admin/academics/prerequisites',
      color: 'bg-teal-600'
    }
  ];

  const allLevels = ['ND1', 'ND2', 'HND1', 'HND2'];

  const toggleLevel = (level: string) => {
    setEligibleLevels((prev) => (prev.includes(level) ? prev.filter((l) => l !== level) : [...prev, level]));
  };

  const parseCourseList = (text: string) =>
    text
      .split(/[\n,]+/g)
      .map((t) => t.trim())
      .filter(Boolean);

  const saveResearchProjectsConfig = () => {
    const parsedMinCgpa = minCgpa.trim() ? Number(minCgpa) : null;
    const minCgpaValue = Number.isFinite(parsedMinCgpa as number) ? parsedMinCgpa : null;

    const payload = {
      enabled: eligibilityEnabled,
      eligibleLevels: eligibleLevels.length ? eligibleLevels : ['ND2', 'HND2'],
      minCgpa: minCgpaValue,
      requiredCourses: parseCourseList(requiredCourses),
      restrictedMessage: restrictedMessage.trim().length
        ? restrictedMessage.trim()
        : 'Access restricted. Contact your department for more information.',
    };

    localStorage.setItem('research_projects_eligibility', JSON.stringify(payload));
    setSaveState('saved');
    window.setTimeout(() => setSaveState('idle'), 1200);
  };

  return (
    <div className="space-y-8 p-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
          <Settings className="w-8 h-8 text-gray-700 dark:text-gray-300" />
          Academic Setup
        </h1>
        <p className="text-lg text-gray-500 dark:text-gray-400 mt-2 max-w-3xl">
          Set up your academic structure: sessions, semesters, departments, levels, and more.
        </p>
      </div>

      <div className="border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('setup')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-bold text-sm flex items-center gap-2 ${
              activeTab === 'setup'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
          >
            <Settings size={18} />
            Academic Setup
          </button>
          <button
            onClick={() => setActiveTab('research-projects')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-bold text-sm flex items-center gap-2 ${
              activeTab === 'research-projects'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
          >
            <BookOpen size={18} />
            Research & Projects
          </button>
        </nav>
      </div>

      {activeTab === 'setup' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((module, index) => (
            <button
              key={index}
              onClick={() => navigate(module.path)}
              className={`group flex flex-col p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all text-left h-full ${
                module.isManaged ? 'hover:border-blue-500/50' : 'hover:border-blue-500'
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className={`w-14 h-14 rounded-xl ${module.color} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <module.icon size={28} />
                </div>
                {module.isManaged && (
                  <div className="flex items-center gap-1.5 px-2 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg text-[10px] font-black uppercase tracking-wider">
                    <ShieldCheck size={12} />
                    Super Admin
                  </div>
                )}
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors flex items-center gap-2">
                {module.title}
                {module.isManaged && <Lock size={14} className="text-gray-400" />}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6 flex-grow">
                {module.desc}
              </p>
              <div className="flex items-center text-sm font-semibold text-blue-600 dark:text-blue-400 group-hover:translate-x-2 transition-transform">
                {module.isManaged ? 'View Catalog' : 'Configure'}
                <ArrowRight size={16} className="ml-2" />
              </div>
            </button>
          ))}
        </div>
      )}

      {activeTab === 'research-projects' && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Research & Projects Access Rules</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Define eligibility conditions for students to access the Research & Projects module.
              </p>
            </div>
            <div className="flex items-center gap-2">
              {saveState === 'saved' && (
                <span className="text-xs font-bold text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-300 px-3 py-1 rounded-full">
                  Saved
                </span>
              )}
              <button
                onClick={saveResearchProjectsConfig}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-bold transition-colors"
              >
                Save Rules
              </button>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/40">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={eligibilityEnabled}
                onChange={(e) => setEligibilityEnabled(e.target.checked)}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded"
              />
              <div>
                <div className="text-sm font-bold text-gray-900 dark:text-white">Enable eligibility enforcement</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  When enabled, ineligible students will see an access restricted message on Research & Projects pages.
                </div>
              </div>
            </label>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="p-5 rounded-2xl border border-gray-200 dark:border-gray-700">
              <div className="text-sm font-bold text-gray-900 dark:text-white">Eligible Levels</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Only students in the selected levels can access the module.</div>
              <div className="mt-4 grid grid-cols-2 gap-2">
                {allLevels.map((level) => (
                  <label
                    key={level}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium cursor-pointer ${
                      eligibleLevels.includes(level)
                        ? 'border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300'
                        : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={eligibleLevels.includes(level)}
                      onChange={() => toggleLevel(level)}
                      className="h-4 w-4"
                    />
                    {level}
                  </label>
                ))}
              </div>
            </div>

            <div className="p-5 rounded-2xl border border-gray-200 dark:border-gray-700">
              <div className="text-sm font-bold text-gray-900 dark:text-white">Minimum CGPA</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Optional. Leave blank to disable.</div>
              <input
                type="number"
                step="0.01"
                min="0"
                max="5"
                value={minCgpa}
                onChange={(e) => setMinCgpa(e.target.value)}
                placeholder="e.g. 2.50"
                className="mt-4 w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="p-5 rounded-2xl border border-gray-200 dark:border-gray-700">
              <div className="text-sm font-bold text-gray-900 dark:text-white">Required Courses</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Optional. Enter course codes separated by commas.</div>
              <textarea
                rows={4}
                value={requiredCourses}
                onChange={(e) => setRequiredCourses(e.target.value)}
                placeholder="e.g. CSC 201, CSC 202, MTH 201"
                className="mt-4 w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>
          </div>

          <div className="p-5 rounded-2xl border border-gray-200 dark:border-gray-700">
            <div className="text-sm font-bold text-gray-900 dark:text-white">Restricted Message</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Shown to students who are not eligible.</div>
            <input
              type="text"
              value={restrictedMessage}
              onChange={(e) => setRestrictedMessage(e.target.value)}
              className="mt-4 w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      )}
    </div>
  );
}
