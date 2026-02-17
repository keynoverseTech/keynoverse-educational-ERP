import React from 'react';
import { type LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  color?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, trend, color = "blue" }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
        <div className={`p-2 rounded-lg bg-${color}-50 text-${color}-600`}>
          <Icon size={20} />
        </div>
      </div>
      <div className="flex items-end justify-between">
        <span className="text-3xl font-bold text-gray-900">{value}</span>
        {trend && (
          <span className="text-sm text-green-600 font-medium bg-green-50 px-2 py-1 rounded">
            {trend}
          </span>
        )}
      </div>
    </div>
  );
};

export default StatCard;
