import React, { useState } from 'react';
import { Briefcase, Building2, MapPin, Search } from 'lucide-react';
import { useAlumni } from '../../../state/alumniState';

const EmploymentInfo: React.FC = () => {
  const { employments, alumni } = useAlumni();
  const [searchTerm, setSearchTerm] = useState('');
  const [industryFilter, setIndustryFilter] = useState('');

  const filteredEmployments = employments.filter(emp => {
    const student = alumni.find(a => a.id === emp.alumniId);
    if (!student) return false;
    
    const matchesSearch = 
        emp.employer.toLowerCase().includes(searchTerm.toLowerCase()) || 
        emp.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
        `${student.firstName} ${student.lastName}`.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesIndustry = industryFilter ? emp.industry === industryFilter : true;

    return matchesSearch && matchesIndustry;
  });

  const uniqueIndustries = [...new Set(employments.map(e => e.industry))].sort();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Alumni Employment</h1>
          <p className="text-gray-500 dark:text-gray-400">Track career progress of graduates</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by company, position, or alumni name..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="w-full md:w-64">
            <select 
              className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={industryFilter}
              onChange={(e) => setIndustryFilter(e.target.value)}
            >
              <option value="">All Industries</option>
              {uniqueIndustries.map(ind => (
                <option key={ind} value={ind}>{ind}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEmployments.map(emp => {
            const student = alumni.find(a => a.id === emp.alumniId);
            return (
                <div key={emp.id} className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-xl">
                            <Building2 size={24} />
                        </div>
                        {emp.isCurrent && (
                            <span className="px-3 py-1 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 text-xs rounded-full font-medium">
                                Current
                            </span>
                        )}
                    </div>
                    
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{emp.position}</h3>
                    <p className="text-gray-600 dark:text-gray-300 font-medium mb-4">{emp.employer}</p>
                    
                    <div className="space-y-2 text-sm text-gray-500 dark:text-gray-400 mb-6">
                        <div className="flex items-center gap-2">
                            <Briefcase size={16} /> {emp.industry}
                        </div>
                        <div className="flex items-center gap-2">
                            <MapPin size={16} /> {emp.location}
                        </div>
                    </div>

                    <div className="pt-4 border-t border-gray-100 dark:border-gray-700 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                            {student?.profilePicture ? (
                                <img src={student.profilePicture} alt="" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-xs font-bold text-gray-500">
                                    {student?.firstName[0]}{student?.lastName[0]}
                                </div>
                            )}
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-gray-900 dark:text-white">{student?.firstName} {student?.lastName}</p>
                            <p className="text-xs text-gray-500">Class of {student?.graduationYear}</p>
                        </div>
                    </div>
                </div>
            );
        })}
      </div>
    </div>
  );
};

export default EmploymentInfo;
