import React from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  Users, 
  CreditCard, 
  Download
} from 'lucide-react';
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';

const FinanceDashboard: React.FC = () => {
  // Mock Data
  const monthlyRevenue = [
    { name: 'Jan', revenue: 4500000 },
    { name: 'Feb', revenue: 5200000 },
    { name: 'Mar', revenue: 4800000 },
    { name: 'Apr', revenue: 6100000 },
    { name: 'May', revenue: 5900000 },
    { name: 'Jun', revenue: 7200000 },
  ];

  const recentTransactions = [
    { id: 1, institute: 'Federal Polytechnic Nekede', amount: 2500000, date: '2024-03-15', status: 'Success' },
    { id: 2, institute: 'University of Lagos', amount: 1200000, date: '2024-03-14', status: 'Success' },
    { id: 3, institute: 'Covenant University', amount: 2500000, date: '2024-03-12', status: 'Pending' },
    { id: 4, institute: 'Yaba College of Tech', amount: 800000, date: '2024-03-10', status: 'Success' },
  ];

  const stats = [
    { 
      title: 'Total Revenue', 
      value: '₦33.7M', 
      trend: '+12.5%', 
      icon: DollarSign,
      color: 'bg-emerald-500',
      description: 'Total earnings this year'
    },
    { 
      title: 'Active Subscriptions', 
      value: '142', 
      trend: '+4.3%', 
      icon: Users,
      color: 'bg-blue-500',
      description: 'Institutes currently subscribed'
    },
    { 
      title: 'Pending Payments', 
      value: '₦4.2M', 
      trend: '-2.1%', 
      icon: CreditCard,
      color: 'bg-amber-500',
      description: 'Invoices awaiting payment'
    },
    { 
      title: 'Avg. Revenue / Institute', 
      value: '₦237K', 
      trend: '+8.1%', 
      icon: TrendingUp,
      color: 'bg-purple-500',
      description: 'Average monthly revenue'
    }
  ];

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Financial Overview</h1>
          <p className="text-gray-500 dark:text-gray-400">Track revenue streams and subscription performance.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
          <Download size={16} />
          Export Report
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl ${stat.color} bg-opacity-10 text-white`}>
                <stat.icon size={24} className={`text-${stat.color.split('-')[1]}-600 dark:text-${stat.color.split('-')[1]}-400`} />
              </div>
              <span className={`px-2 py-1 rounded-lg text-xs font-bold ${
                stat.trend.startsWith('+') 
                  ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400' 
                  : 'bg-rose-50 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400'
              }`}>
                {stat.trend}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{stat.value}</h3>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-300">{stat.title}</p>
            <p className="text-xs text-gray-400 mt-2">{stat.description}</p>
          </div>
        ))}
      </div>

      {/* Main Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Revenue Trends</h3>
            <select className="px-3 py-1.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500/20">
              <option>This Year</option>
              <option>Last Year</option>
            </select>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyRevenue}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#6b7280', fontSize: 12 }} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                  tickFormatter={(value) => `₦${value / 1000000}M`}
                />
                <Tooltip 
                  cursor={{ fill: 'transparent' }}
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    borderRadius: '12px', 
                    border: 'none', 
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' 
                  }}
                  formatter={(value: any) => [`₦${Number(value).toLocaleString()}`, 'Revenue']}
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorRevenue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Recent Payments</h3>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">View All</button>
          </div>
          <div className="space-y-4">
            {recentTransactions.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-xl transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                    <CreditCard size={18} className="text-gray-600 dark:text-gray-300" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900 dark:text-white truncate max-w-[140px]">{tx.institute}</p>
                    <p className="text-xs text-gray-500">{tx.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-900 dark:text-white">₦{(tx.amount / 1000).toFixed(0)}k</p>
                  <span className={`text-[10px] font-bold ${
                    tx.status === 'Success' ? 'text-emerald-600' : 'text-amber-600'
                  }`}>
                    {tx.status}
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

export default FinanceDashboard;
