import React, { useState } from 'react';
import { 
  Archive, 
  Search, 
  Download, 
  Tag 
} from 'lucide-react';

const ProjectArchive: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterFaculty, setFilterFaculty] = useState('All');
  const [filterDepartment, setFilterDepartment] = useState('All');
  const [filterProgramme, setFilterProgramme] = useState('All');
  const [filterYear, setFilterYear] = useState('All');

  // Mock Filters
  const faculties = ['Faculty of Sciences', 'Faculty of Engineering', 'Faculty of Arts', 'Faculty of Environmental Sciences'];
  const departments = ['Computer Science', 'Architecture', 'Biology', 'Physics', 'Mathematics', 'Electrical Engineering'];
  const programmes = ['HND Computer Science', 'HND Architecture', 'HND Biology', 'B.Eng Electrical Engineering'];
  const years = ['2024', '2023', '2022', '2021', '2020'];

  // Mock Data
  const archive = [
    {
      id: 1,
      title: 'Machine Learning in Agriculture',
      student: 'David Green',
      year: '2023',
      department: 'Computer Science',
      faculty: 'Faculty of Sciences',
      programme: 'HND Computer Science',
      abstract: 'Optimizing crop yield using predictive analytics and IoT sensors.',
      keywords: ['ML', 'IoT', 'Agriculture'],
    },
    {
      id: 2,
      title: 'Renewable Energy Systems for Rural Areas',
      student: 'Emily White',
      year: '2022',
      department: 'Electrical Engineering',
      faculty: 'Faculty of Engineering',
      programme: 'B.Eng Electrical Engineering',
      abstract: 'Design and implementation of cost-effective solar-wind hybrid systems.',
      keywords: ['Solar', 'Wind', 'Rural Electrification'],
    },
  ];

  const filteredArchive = archive.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          project.student.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          project.abstract.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFaculty = filterFaculty === 'All' || project.faculty === filterFaculty;
    const matchesDepartment = filterDepartment === 'All' || project.department === filterDepartment;
    const matchesProgramme = filterProgramme === 'All' || project.programme === filterProgramme;
    const matchesYear = filterYear === 'All' || project.year === filterYear;

    return matchesSearch && matchesFaculty && matchesDepartment && matchesProgramme && matchesYear;
  });

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Archive className="text-teal-600" />
            Project Archive
          </h1>
          <p className="text-gray-500 dark:text-gray-400">Repository of completed student research projects.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:flex-none">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search archive..." 
              className="pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 w-full md:w-64"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <select 
            value={filterFaculty}
            onChange={(e) => setFilterFaculty(e.target.value)}
            className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="All">All Faculties</option>
            {faculties.map(f => <option key={f} value={f}>{f}</option>)}
          </select>
          
          <select 
            value={filterDepartment}
            onChange={(e) => setFilterDepartment(e.target.value)}
            className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="All">All Departments</option>
            {departments.map(d => <option key={d} value={d}>{d}</option>)}
          </select>

          <select 
            value={filterProgramme}
            onChange={(e) => setFilterProgramme(e.target.value)}
            className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="All">All Programmes</option>
            {programmes.map(p => <option key={p} value={p}>{p}</option>)}
          </select>

          <select 
            value={filterYear}
            onChange={(e) => setFilterYear(e.target.value)}
            className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="All">All Years</option>
            {years.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredArchive.map((project) => (
          <div key={project.id} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 shadow-sm hover:shadow-md transition-all group">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white hover:text-teal-600 transition-colors cursor-pointer">
                  {project.title}
                </h3>
                <div className="flex flex-col gap-1 mt-1">
                  <p className="text-sm text-gray-500">
                    By <span className="font-medium text-gray-900 dark:text-white">{project.student}</span> • {project.year}
                  </p>
                  <p className="text-xs text-gray-400">{project.programme} • {project.department} • {project.faculty}</p>
                </div>
              </div>
              <button className="p-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-teal-50 dark:hover:bg-teal-900/30 hover:text-teal-600 transition-colors">
                <Download size={20} />
              </button>
            </div>
            
            <p className="text-gray-600 dark:text-gray-300 mt-4 text-sm leading-relaxed line-clamp-2">
              {project.abstract}
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              {project.keywords.map((keyword, idx) => (
                <span key={idx} className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs font-medium rounded-md">
                  <Tag size={12} /> {keyword}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectArchive;
