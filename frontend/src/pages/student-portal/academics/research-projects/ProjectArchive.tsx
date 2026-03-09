import { useState } from 'react';
import { 
  Search, 
  Filter, 
  BookOpen, 
  Download, 
  User,
  ArrowLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ProjectArchive = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const projects = [
    {
      id: 1,
      title: "AI-Powered Traffic Management System",
      author: "Sarah Johnson",
      year: "2023",
      department: "Computer Science",
      supervisor: "Dr. A. Ahmed",
      abstract: "This project proposes an intelligent traffic control system using computer vision and reinforcement learning..."
    },
    {
      id: 2,
      title: "Blockchain for Supply Chain Transparency",
      author: "Michael Okon",
      year: "2023",
      department: "Information Technology",
      supervisor: "Prof. B. Sani",
      abstract: "A decentralized application (DApp) to track product provenance and ensure authenticity in pharmaceutical supply chains..."
    },
    {
      id: 3,
      title: "Remote Patient Monitoring System using IoT",
      author: "Grace Peter",
      year: "2022",
      department: "Computer Engineering",
      supervisor: "Engr. C. Obi",
      abstract: "Design of a wearable device to monitor vital signs and transmit data to healthcare providers in real-time..."
    }
  ];

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
          <select className="px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 outline-none">
            <option value="">All Years</option>
            <option value="2023">2023</option>
            <option value="2022">2022</option>
          </select>
          <button className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center gap-2 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
            <Filter size={20} />
            <span>Filter</span>
          </button>
        </div>
      </div>

      {/* Projects List */}
      <div className="grid grid-cols-1 gap-4">
        {projects.map((project) => (
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
                <span>{project.author}</span>
              </div>
              <div className="flex items-center gap-1">
                <BookOpen size={16} />
                <span>{project.department}</span>
              </div>
              <div className="flex items-center gap-1">
                <User size={16} />
                <span>Sup: {project.supervisor}</span>
              </div>
            </div>

            <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
              {project.abstract}
            </p>

            <div className="flex items-center gap-3">
              <button className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
                View Abstract
              </button>
              <span className="text-gray-300 dark:text-gray-600">|</span>
              <button className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white flex items-center gap-1">
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
