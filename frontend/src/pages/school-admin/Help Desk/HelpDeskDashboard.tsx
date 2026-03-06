import React from 'react';
import { 
  LayoutDashboard, 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  MessageSquare, 
  Plus, 
  FileText 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useHelpDesk } from '../../../state/helpdeskContext';

const HelpDeskDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { tickets } = useHelpDesk();

  const totalTickets = tickets.length;
  const openTickets = tickets.filter(t => t.status === 'Open').length;
  const inProgressTickets = tickets.filter(t => t.status === 'In Progress').length;
  const resolvedTickets = tickets.filter(t => t.status === 'Resolved' || t.status === 'Closed').length;

  const stats = [
    { label: 'Total Tickets', value: totalTickets, icon: FileText, color: 'text-blue-600', bg: 'bg-blue-100 dark:bg-blue-900/20' },
    { label: 'Open Issues', value: openTickets, icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-100 dark:bg-red-900/20' },
    { label: 'In Progress', value: inProgressTickets, icon: Clock, color: 'text-orange-600', bg: 'bg-orange-100 dark:bg-orange-900/20' },
    { label: 'Resolved', value: resolvedTickets, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100 dark:bg-green-900/20' },
  ];

  const recentTickets = tickets.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-500 rounded-2xl px-6 py-5 shadow-lg shadow-blue-600/20 border border-blue-500/20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-blue-50 mb-3">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Help Desk Overview
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-2">
              <LayoutDashboard className="w-7 h-7" />
              Help Desk Dashboard
            </h1>
            <p className="text-blue-50/80 mt-2 text-sm md:text-base max-w-xl">
              Track and manage support requests, ticket resolution, and user assistance.
            </p>
          </div>
          <div className="flex flex-col items-start md:items-end gap-3 text-blue-50/90">
             <div className="text-right">
              <p className="text-xs uppercase tracking-wide">Total Tickets</p>
              <p className="text-2xl font-bold">{totalTickets}</p>
            </div>
            <button
              onClick={() => navigate('/school-admin/helpdesk/create')}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors shadow-lg backdrop-blur-sm border border-white/20 text-sm font-medium"
            >
              <Plus size={18} />
              New Ticket
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className={`relative overflow-hidden bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-all duration-300 hover:shadow-${stat.color.split('-')[1]}-500/10`}>
            <div className={`absolute inset-x-0 top-0 h-1 bg-${stat.color.replace('text-', '')}`} />
            <div className="flex items-center justify-between relative">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.label}</p>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{stat.value}</h3>
              </div>
              <div className={`p-2 rounded-xl ${stat.bg}`}>
                <stat.icon size={24} className={stat.color} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 className="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2">
            <MessageSquare size={20} className="text-blue-600" />
            Recent Tickets
          </h2>
          <button 
            onClick={() => navigate('/school-admin/helpdesk/tickets')}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            View All Tickets
          </button>
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {recentTickets.map(ticket => (
            <div key={ticket.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors flex items-center justify-between">
              <div className="flex items-start gap-4">
                <div className={`w-2 h-2 mt-2 rounded-full ${
                  ticket.priority === 'High' ? 'bg-red-500' : 
                  ticket.priority === 'Medium' ? 'bg-orange-500' : 'bg-green-500'
                }`}></div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
                    {ticket.subject}
                    <span className="text-xs font-normal px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-gray-500">
                      {ticket.ticketId}
                    </span>
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{ticket.categoryName} • {ticket.dateCreated}</p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                ticket.status === 'Open' ? 'bg-red-100 text-red-700' :
                ticket.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                ticket.status === 'Resolved' ? 'bg-green-100 text-green-700' :
                'bg-gray-100 text-gray-700'
              }`}>
                {ticket.status}
              </span>
            </div>
          ))}
          {recentTickets.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              No recent tickets found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HelpDeskDashboard;
