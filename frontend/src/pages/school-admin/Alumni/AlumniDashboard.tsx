import React from 'react';
import { Users, Briefcase, GraduationCap, FileText, TrendingUp } from 'lucide-react';
import { useAlumni } from '../../../state/alumniState';

const AlumniDashboard: React.FC = () => {
  const { alumni, transcriptRequests } = useAlumni();

  const totalAlumni = alumni.length;
  const employedAlumni = alumni.filter(a => a.employmentStatus === 'Employed' || a.employmentStatus === 'Self-Employed').length;
  const furtherStudies = alumni.filter(a => a.employmentStatus === 'Further Studies').length;
  const pendingTranscripts = transcriptRequests.filter(t => t.status === 'Pending').length;

  const stats = [
    { label: 'Total Alumni', value: totalAlumni, icon: Users, color: 'bg-blue-500', trend: '+12% vs last year' },
    { label: 'Employed / Self-Employed', value: employedAlumni, icon: Briefcase, color: 'bg-emerald-500', trend: `${totalAlumni > 0 ? Math.round((employedAlumni / totalAlumni) * 100) : 0}% employment rate` },
    { label: 'Further Studies', value: furtherStudies, icon: GraduationCap, color: 'bg-purple-500', trend: 'Pursuing Masters/PhD' },
    { label: 'Pending Requests', value: pendingTranscripts, icon: FileText, color: 'bg-orange-500', trend: 'Requires attention' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-500 rounded-2xl px-6 py-5 shadow-lg shadow-blue-600/20 border border-blue-500/20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-blue-50 mb-3">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Alumni Management
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-2">
              <GraduationCap className="w-7 h-7" />
              Alumni Dashboard
            </h1>
            <p className="text-blue-50/80 mt-2 text-sm md:text-base max-w-xl">
              Track alumni careers, manage transcripts, and foster community engagement.
            </p>
          </div>
          <div className="flex flex-col items-start md:items-end gap-3 text-blue-50/90">
             <div className="text-right">
              <p className="text-xs uppercase tracking-wide">Total Alumni</p>
              <p className="text-2xl font-bold">{totalAlumni.toLocaleString()}</p>
            </div>
             <button className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors text-sm font-medium backdrop-blur-sm border border-white/20">
              Download Report
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className={`relative overflow-hidden bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-all duration-300 hover:shadow-${stat.color.replace('bg-', '')}/10`}>
            <div className={`absolute inset-x-0 top-0 h-1 ${stat.color.replace('bg-', 'bg-')}`} />
            <div className="flex items-center justify-between relative mb-2">
               <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.label}</p>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{stat.value}</h3>
              </div>
              <div className={`p-2 rounded-xl ${stat.color} bg-opacity-10`}>
                <stat.icon size={24} className={stat.color.replace('bg-', 'text-')} />
              </div>
            </div>
            <span className="flex items-center text-xs font-medium text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded-full w-fit">
                <TrendingUp size={12} className="mr-1" />
                {stat.trend}
            </span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Graduates */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Recent Graduates</h3>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">View All</button>
          </div>
          <div className="space-y-4">
            {alumni.slice(0, 5).map(student => (
              <div key={student.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                    {student.profilePicture ? (
                      <img src={student.profilePicture} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <Users className="w-5 h-5 m-2.5 text-gray-400" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">{student.firstName} {student.lastName}</h4>
                    <p className="text-xs text-gray-500">{student.program} • {student.graduationYear}</p>
                  </div>
                </div>
                <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                  student.employmentStatus === 'Employed' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                  student.employmentStatus === 'Further Studies' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' :
                  'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                }`}>
                  {student.employmentStatus}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Transcript Requests */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Recent Requests</h3>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">View All</button>
          </div>
          <div className="space-y-4">
            {transcriptRequests.slice(0, 5).map(req => {
              const student = alumni.find(a => a.id === req.alumniId);
              return (
                <div key={req.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 rounded-lg">
                      <FileText size={20} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">{req.type}</h4>
                      <p className="text-xs text-gray-500">Requested by {student?.firstName} {student?.lastName}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium block w-fit ml-auto mb-1 ${
                      req.status === 'Pending' ? 'bg-orange-100 text-orange-700' :
                      req.status === 'Processing' ? 'bg-blue-100 text-blue-700' :
                      'bg-emerald-100 text-emerald-700'
                    }`}>
                      {req.status}
                    </span>
                    <span className="text-xs text-gray-400">{req.requestDate}</span>
                  </div>
                </div>
              );
            })}
             {transcriptRequests.length === 0 && (
                <div className="text-center py-8 text-gray-500">No recent requests</div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlumniDashboard;
