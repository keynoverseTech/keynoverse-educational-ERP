import { useEffect, useMemo, useState } from 'react';
import { 
  Search, 
  Filter, 
  BookOpen, 
  Download, 
  User,
  ArrowLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { loadProjectArchive, type ArchivedProject } from '../../../../utils/researchArchive';

const ProjectArchive = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterYear, setFilterYear] = useState<string>('All');
  const [archive, setArchive] = useState<ArchivedProject[]>(() => loadProjectArchive());
  const [archiveTick, setArchiveTick] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => setArchiveTick((n) => n + 1), 1500);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    setArchive(loadProjectArchive());
  }, [archiveTick]);

  const years = useMemo(() => Array.from(new Set(archive.map((a) => a.year))).sort().reverse(), [archive]);

  const filteredArchive = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return archive
      .filter((p) => (filterYear === 'All' ? true : p.year === filterYear))
      .filter((p) => {
        if (!q) return true;
        const abstract = p.abstract ?? '';
        return (
          p.title.toLowerCase().includes(q) ||
          p.student.toLowerCase().includes(q) ||
          p.department.toLowerCase().includes(q) ||
          abstract.toLowerCase().includes(q)
        );
      });
  }, [archive, filterYear, searchQuery]);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
        >
          <ArrowLeft size={20} className="text-gray-500 dark:text-gray-400" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Project Archive</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Browse past student projects and research</p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Search by title, author, or keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={filterYear}
            onChange={(e) => setFilterYear(e.target.value)}
            className="px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 outline-none"
          >
            <option value="All">All Years</option>
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
          <button className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center gap-2 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
            <Filter size={20} />
            <span>Filter</span>
          </button>
        </div>
      </div>

      {/* Projects List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredArchive.map((project) => (
          <div key={project.id} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">
                {project.title}
              </h3>
              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs font-bold text-gray-600 dark:text-gray-300">
                {project.year}
              </span>
            </div>
            
            <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
              <div className="flex items-center gap-1">
                <User size={16} />
                <span>{project.student}</span>
              </div>
              <div className="flex items-center gap-1">
                <BookOpen size={16} />
                <span>{project.department}</span>
              </div>
              <div className="flex items-center gap-1">
                <User size={16} />
                <span>Sup: {project.supervisor ?? 'N/A'}</span>
              </div>
            </div>

            {project.abstract && (
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                {project.abstract}
              </p>
            )}

            <div className="flex items-center gap-3">
              <button className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
                View Abstract
              </button>
              <span className="text-gray-300 dark:text-gray-600">|</span>
              <button
                onClick={() => {
                  const doc = project.documents?.[0];
                  if (doc?.documentUrl) window.open(doc.documentUrl, '_blank', 'noopener,noreferrer');
                }}
                disabled={!project.documents?.[0]?.documentUrl}
                className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Download size={16} />
                Download PDF
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectArchive;
