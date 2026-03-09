import React from 'react';
import { NavLink } from 'react-router-dom';
import { X } from 'lucide-react';

export const StatusPill: React.FC<{ label: string; tone?: 'gray' | 'blue' | 'green' | 'red' | 'amber' | 'purple' }> = ({
  label,
  tone = 'gray',
}) => {
  const toneClass =
    tone === 'blue'
      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
      : tone === 'green'
        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
        : tone === 'red'
          ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
          : tone === 'amber'
            ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200'
            : tone === 'purple'
              ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
              : 'bg-gray-100 text-gray-700 dark:bg-gray-700/50 dark:text-gray-200';

  return <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${toneClass}`}>{label}</span>;
};

export const Modal: React.FC<{
  title: string;
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
  widthClassName?: string;
}> = ({ title, open, onClose, children, footer, widthClassName = 'max-w-lg' }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className={`w-full ${widthClassName} bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden`}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h3>
          <button type="button" onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-300">
            <X size={18} />
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
        {footer ? <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/30">{footer}</div> : null}
      </div>
    </div>
  );
};

export const SkeletonRow: React.FC = () => (
  <div className="grid grid-cols-12 gap-3 py-3">
    <div className="col-span-3 h-4 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
    <div className="col-span-2 h-4 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
    <div className="col-span-2 h-4 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
    <div className="col-span-2 h-4 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
    <div className="col-span-3 h-4 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
  </div>
);

export const TransportSubnav: React.FC<{ items: { label: string; to: string }[] }> = ({ items }) => {
  return (
    <nav className="flex flex-wrap items-center gap-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-2">
      {items.map(item => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            `px-3 py-2 rounded-xl text-sm font-bold transition-colors ${
              isActive ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`
          }
          end
        >
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
};

