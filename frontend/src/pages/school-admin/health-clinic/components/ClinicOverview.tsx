import React from 'react';
import { 
  Users, 
  Activity, 
  Calendar,
  AlertCircle,
  TrendingUp
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell,
  AreaChart,
  Area
} from 'recharts';

const ClinicOverview: React.FC = () => {
  // Mock Data for Staff
  const clinicStaff = [
    { id: 1, name: 'Dr. Sarah Wilson', role: 'Senior Doctor', status: 'On Duty', avatar: 'SW' },
    { id: 2, name: 'Nurse Mike Brown', role: 'Head Nurse', status: 'On Duty', avatar: 'MB' },
    { id: 3, name: 'Dr. Emily White', role: 'Pediatrician', status: 'On Break', avatar: 'EW' },
  ];

  // Mock Stats with Trend Data
  const stats = [
    { 
      title: 'Total Staff', 
      value: '8', 
      icon: Users, 
      color: 'bg-blue-500', 
      hex: '#3B82F6',
      trendData: [4, 5, 6, 6, 7, 8, 8]
    },
    { 
      title: 'Active Patients', 
      value: '12', 
      icon: Activity, 
      color: 'bg-green-500', 
      hex: '#22C55E',
      trendData: [8, 12, 10, 14, 11, 13, 12]
    },
    { 
      title: 'Today\'s Visits', 
      value: '24', 
      icon: Calendar, 
      color: 'bg-purple-500', 
      hex: '#A855F7',
      trendData: [15, 18, 20, 22, 19, 21, 24]
    },
    { 
      title: 'Critical Cases', 
      value: '2', 
      icon: AlertCircle, 
      color: 'bg-red-500', 
      hex: '#EF4444',
      trendData: [0, 1, 0, 2, 1, 3, 2]
    },
  ];

  // Mock Data for Bar Chart
  const visitData = [
    { name: 'Mon', visits: 12 },
    { name: 'Tue', visits: 19 },
    { name: 'Wed', visits: 15 },
    { name: 'Thu', visits: 22 },
    { name: 'Fri', visits: 28 },
    { name: 'Sat', visits: 8 },
    { name: 'Sun', visits: 5 },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white dark:bg-[#151e32] rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 relative overflow-hidden">
            <div className="flex justify-between items-start relative z-10">
              <div>
                <p className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{stat.title}</p>
                <h3 className="text-3xl font-black text-gray-900 dark:text-white mt-1">{stat.value}</h3>
              </div>
              <div className={`p-3 rounded-xl ${stat.color} bg-opacity-20 text-white`}>
                <stat.icon size={24} />
              </div>
            </div>
            
            {/* Mini Chart Background */}
            <div className="absolute -bottom-2 -left-2 -right-2 h-16 opacity-20">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stat.trendData.map((val, i) => ({ val, i }))}>
                  <Area 
                    type="monotone" 
                    dataKey="val" 
                    stroke={stat.hex} 
                    fill={stat.hex} 
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Visits Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-[#151e32] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2">
                <TrendingUp className="text-blue-500" size={20} />
                Weekly Patient Visits
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Overview of patient traffic over the last 7 days</p>
            </div>
          </div>
          
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={visitData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#6B7280', fontSize: 12 }} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#6B7280', fontSize: 12 }} 
                />
                <Tooltip 
                  cursor={{ fill: '#F3F4F6' }}
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: 'none', 
                    borderRadius: '8px', 
                    color: '#fff' 
                  }}
                />
                <Bar dataKey="visits" radius={[4, 4, 0, 0]} barSize={40}>
                  {visitData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.visits > 20 ? '#3B82F6' : '#93C5FD'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Staff On Duty */}
        <div className="bg-white dark:bg-[#151e32] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6">
          <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-4">Clinic Staff On Duty</h3>
          <div className="space-y-4">
            {clinicStaff.map((staff) => (
              <div key={staff.id} className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800">
                <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold">
                  {staff.avatar}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white text-sm">{staff.name}</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{staff.role}</p>
                  <span className={`inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    staff.status === 'On Duty' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {staff.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClinicOverview;
