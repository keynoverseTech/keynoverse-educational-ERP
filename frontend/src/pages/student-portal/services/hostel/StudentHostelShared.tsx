import React from 'react';
import { NavLink } from 'react-router-dom';
import { X } from 'lucide-react';
import type { ToastMessage } from '../../../../state/studentHostelContext';

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

export const SkeletonCard: React.FC = () => <div className="h-24 rounded-2xl bg-gray-200 dark:bg-gray-700 animate-pulse" />;

export const SkeletonRow: React.FC = () => (
  <div className="grid grid-cols-12 gap-3 py-3">
    <div className="col-span-3 h-4 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
    <div className="col-span-2 h-4 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
    <div className="col-span-2 h-4 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
    <div className="col-span-2 h-4 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
    <div className="col-span-3 h-4 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
  </div>
);

export const ToastViewport: React.FC<{ toasts: ToastMessage[]; onDismiss: (id: string) => void }> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  const tone = (type: ToastMessage['type']) =>
    type === 'success'
      ? 'border-green-200 bg-green-50 text-green-800 dark:border-green-900/40 dark:bg-green-900/20 dark:text-green-200'
      : type === 'error'
        ? 'border-red-200 bg-red-50 text-red-800 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-200'
        : type === 'warning'
          ? 'border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900/40 dark:bg-amber-900/20 dark:text-amber-200'
          : 'border-blue-200 bg-blue-50 text-blue-900 dark:border-blue-900/40 dark:bg-blue-900/20 dark:text-blue-200';

  return (
    <div className="fixed right-4 top-4 z-[60] w-[360px] max-w-[calc(100vw-2rem)] space-y-2">
      {toasts.map(t => (
        <div key={t.id} className={`border rounded-2xl shadow-lg px-4 py-3 ${tone(t.type)}`}>
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="font-bold text-sm truncate">{t.title}</p>
              {t.message ? <p className="text-xs mt-0.5 opacity-90 break-words">{t.message}</p> : null}
            </div>
            <button type="button" onClick={() => onDismiss(t.id)} className="p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/10">
              <X size={16} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export const HostelSubnav: React.FC<{ items: { label: string; to: string }[] }> = ({ items }) => {
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

export const Stepper: React.FC<{ step: 1 | 2 | 3 }> = ({ step }) => {
  const steps = [
    { id: 1, label: 'Select Hostel' },
    { id: 2, label: 'Select Room' },
    { id: 3, label: 'Confirm' },
  ] as const;

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-4">
      <div className="flex items-center justify-between gap-3">
        {steps.map((s, idx) => {
          const active = step === s.id;
          const done = step > s.id;
          return (
            <div key={s.id} className="flex items-center gap-3 min-w-0">
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold ${
                  done ? 'bg-emerald-600 text-white' : active ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200'
                }`}
              >
                {s.id}
              </div>
              <div className="min-w-0">
                <p className={`text-sm font-bold truncate ${active ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-300'}`}>{s.label}</p>
              </div>
              {idx < steps.length - 1 ? <div className="hidden sm:block w-8 h-0.5 bg-gray-200 dark:bg-gray-700 mx-1" /> : null}
            </div>
          );
        })}
      </div>
    </div>
  );
};

