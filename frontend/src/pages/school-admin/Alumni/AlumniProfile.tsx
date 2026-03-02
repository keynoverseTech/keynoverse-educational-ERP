import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { User, Mail, Phone, MapPin, Calendar, BookOpen, Briefcase, FileText, Building2, Globe } from 'lucide-react';
import { useAlumni } from '../../../state/alumniState';
import type { Alumni } from '../../../state/alumniState';

type Tab = 'overview' | 'employment' | 'transcripts';

const AlumniProfile: React.FC = () => {
  const { alumni, employments, transcriptRequests } = useAlumni();
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (location.state?.alumniId) {
      setSelectedId(location.state.alumniId);
    } else if (alumni.length > 0 && !selectedId) {
        // Default to first if none selected (or handle as "Select an alumni")
        setSelectedId(alumni[0].id);
    }
  }, [location.state, alumni, selectedId]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    const found = alumni.find(a => 
      a.firstName.toLowerCase().includes(searchQuery.toLowerCase()) || 
      a.lastName.toLowerCase().includes(searchQuery.toLowerCase()) || 
      a.studentId.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (found) {
      setSelectedId(found.id);
      setSearchQuery('');
    } else {
      alert('Alumni not found');
    }
  };

  const student = alumni.find(s => s.id === selectedId);
  const studentEmployments = employments.filter(e => e.alumniId === selectedId);
  const studentTranscripts = transcriptRequests.filter(t => t.alumniId === selectedId);

  if (!student) {
    return (
        <div className="flex flex-col items-center justify-center h-96 text-gray-500">
            <User size={48} className="mb-4 text-gray-300" />
            <p>Select an alumni from the list to view profile</p>
            <button 
                onClick={() => navigate('/school-admin/alumni/list')}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
                Go to Alumni List
            </button>
        </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm">
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            placeholder="Search alumni by name or ID..."
            className="flex-1 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Search
          </button>
        </form>
      </div>

      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="w-24 h-24 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden shrink-0 border-4 border-white dark:border-gray-800 shadow-lg">
                {student.profilePicture ? (
                    <img src={student.profilePicture} alt="" className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <User size={40} className="text-gray-400" />
                    </div>
                )}
            </div>
            <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{student.firstName} {student.lastName}</h1>
                        <p className="text-gray-500 dark:text-gray-400 font-mono">{student.studentId} • Class of {student.graduationYear}</p>
                    </div>
                    <span className={`px-4 py-1.5 rounded-full text-sm font-medium w-fit ${
                        student.employmentStatus === 'Employed' ? 'bg-emerald-100 text-emerald-700' :
                        student.employmentStatus === 'Further Studies' ? 'bg-purple-100 text-purple-700' :
                        'bg-gray-100 text-gray-700'
                    }`}>
                        {student.employmentStatus}
                    </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300 text-sm">
                        <Mail size={16} className="text-gray-400" />
                        {student.email}
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300 text-sm">
                        <Phone size={16} className="text-gray-400" />
                        {student.phone}
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300 text-sm">
                        <MapPin size={16} className="text-gray-400" />
                        New York, USA {/* Mock location */}
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300 text-sm">
                        <Calendar size={16} className="text-gray-400" />
                        Born {student.dateOfBirth}
                    </div>
                </div>
            </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-6 mt-8 border-b border-gray-200 dark:border-gray-700">
            {['overview', 'employment', 'transcripts'].map((tab) => (
                <button
                    key={tab}
                    onClick={() => setActiveTab(tab as Tab)}
                    className={`pb-4 text-sm font-medium capitalize transition-colors relative ${
                        activeTab === tab 
                        ? 'text-blue-600 dark:text-blue-400' 
                        : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                    }`}
                >
                    {tab}
                    {activeTab === tab && (
                        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 dark:bg-blue-400 rounded-t-full" />
                    )}
                </button>
            ))}
        </div>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {activeTab === 'overview' && (
            <>
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <BookOpen size={20} className="text-blue-500" />
                            Academic Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
                                <span className="text-xs text-gray-500 uppercase tracking-wider">Programme</span>
                                <p className="font-semibold text-gray-900 dark:text-white mt-1">{student.program}</p>
                            </div>
                            <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
                                <span className="text-xs text-gray-500 uppercase tracking-wider">Faculty</span>
                                <p className="font-semibold text-gray-900 dark:text-white mt-1">{student.faculty}</p>
                            </div>
                            <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
                                <span className="text-xs text-gray-500 uppercase tracking-wider">CGPA</span>
                                <p className="font-bold text-2xl text-blue-600 mt-1">{student.cgpa.toFixed(2)}</p>
                            </div>
                            <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
                                <span className="text-xs text-gray-500 uppercase tracking-wider">Class of Degree</span>
                                <p className="font-semibold text-gray-900 dark:text-white mt-1">{student.classOfDegree}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="space-y-6">
                     {/* Quick Actions or Summary */}
                     <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
                        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Quick Actions</h3>
                        <div className="space-y-3">
                            <button className="w-full py-2 px-4 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors text-left flex items-center gap-2">
                                <FileText size={16} /> Request Transcript
                            </button>
                            <button className="w-full py-2 px-4 bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors text-left flex items-center gap-2">
                                <Mail size={16} /> Send Message
                            </button>
                        </div>
                     </div>
                </div>
            </>
        )}

        {activeTab === 'employment' && (
             <div className="lg:col-span-3">
                 <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <Briefcase size={20} className="text-emerald-500" />
                            Employment History
                        </h3>
                        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">+ Add Record</button>
                    </div>

                    <div className="space-y-6">
                        {studentEmployments.length === 0 ? (
                            <p className="text-gray-500 text-center py-8">No employment records found.</p>
                        ) : (
                            studentEmployments.map(emp => (
                                <div key={emp.id} className="flex gap-4 p-4 rounded-xl border border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900/30 transition-colors">
                                    <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 rounded-xl h-fit">
                                        <Building2 size={24} />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h4 className="font-bold text-gray-900 dark:text-white text-lg">{emp.position}</h4>
                                                <p className="text-gray-600 dark:text-gray-300 font-medium">{emp.employer}</p>
                                            </div>
                                            {emp.isCurrent && (
                                                <span className="px-3 py-1 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 text-xs rounded-full font-medium">
                                                    Current
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                                            <span className="flex items-center gap-1">
                                                <Globe size={14} /> {emp.location}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Briefcase size={14} /> {emp.industry}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Calendar size={14} /> {emp.startDate} - {emp.endDate || 'Present'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                 </div>
             </div>
        )}

        {activeTab === 'transcripts' && (
            <div className="lg:col-span-3">
                 <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                        <FileText size={20} className="text-orange-500" />
                        Transcript Requests
                    </h3>
                    
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 dark:bg-gray-900/50 text-xs uppercase text-gray-500 font-medium">
                                <tr>
                                    <th className="px-6 py-4 rounded-l-lg">Request ID</th>
                                    <th className="px-6 py-4">Type</th>
                                    <th className="px-6 py-4">Date</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Payment</th>
                                    <th className="px-6 py-4 rounded-r-lg text-right">Amount</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                {studentTranscripts.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-8 text-center text-gray-500">No requests found.</td>
                                    </tr>
                                ) : (
                                    studentTranscripts.map(req => (
                                        <tr key={req.id}>
                                            <td className="px-6 py-4 font-mono text-sm">{req.id}</td>
                                            <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{req.type}</td>
                                            <td className="px-6 py-4 text-gray-500 text-sm">{req.requestDate}</td>
                                            <td className="px-6 py-4">
                                                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                                                    req.status === 'Pending' ? 'bg-orange-100 text-orange-700' :
                                                    req.status === 'Processing' ? 'bg-blue-100 text-blue-700' :
                                                    'bg-emerald-100 text-emerald-700'
                                                }`}>
                                                    {req.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                                                    req.paymentStatus === 'Paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                                                }`}>
                                                    {req.paymentStatus}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right font-medium text-gray-900 dark:text-white">
                                                ${req.amount.toFixed(2)}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                 </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default AlumniProfile;
