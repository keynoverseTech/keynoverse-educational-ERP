import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  ArrowLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DefenseSchedule = () => {
  const navigate = useNavigate();

  const defenseDetails = {
    title: "Design and Implementation of a Student Portal with LMS Integration",
    type: "Final Defense",
    date: "Thursday, 20 June 2024",
    time: "10:00 AM - 11:00 AM",
    venue: "Lecture Theatre A (Block B)",
    mode: "Physical", // Physical or Virtual
    panel: [
      { name: "Prof. A. Bello", role: "Chairman", department: "Computer Science" },
      { name: "Dr. O. Okon", role: "External Examiner", department: "Information Tech" },
      { name: "Dr. M. Ibrahim", role: "Supervisor", department: "Computer Science" }
    ]
  };

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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Defense Schedule</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Upcoming project defense details</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden relative">
          <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-700"></div>
          <div className="px-8 pb-8">
            <div className="-mt-12 mb-6 inline-block p-4 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
              <Calendar size={48} className="text-blue-600 dark:text-blue-400" />
            </div>

            <div className="flex flex-col md:flex-row justify-between gap-8">
              <div className="flex-1">
                <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 mb-3 uppercase tracking-wider">
                  {defenseDetails.type}
                </span>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {defenseDetails.title}
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-600 dark:text-gray-300">
                      <Clock size={24} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Date & Time</p>
                      <p className="font-bold text-gray-900 dark:text-white">{defenseDetails.date}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{defenseDetails.time}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-600 dark:text-gray-300">
                      <MapPin size={24} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Venue</p>
                      <p className="font-bold text-gray-900 dark:text-white">{defenseDetails.venue}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{defenseDetails.mode} Presentation</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="w-full md:w-80 bg-gray-50 dark:bg-gray-900/50 rounded-xl p-6 border border-gray-100 dark:border-gray-800">
                <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Users size={18} />
                  Panel Members
                </h3>
                <div className="space-y-4">
                  {defenseDetails.panel.map((member, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 text-xs font-bold">
                        {member.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900 dark:text-white">{member.name}</p>
                        <p className="text-xs text-gray-500">{member.role}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <button className="w-full mt-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors text-sm">
                  Confirm Availability
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DefenseSchedule;
