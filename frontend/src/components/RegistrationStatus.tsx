import React from 'react';
import { CheckCircle2, XCircle, ArrowRight, RefreshCcw } from 'lucide-react';

interface StatusProps {
  title: string;
  message: string;
  onAction: () => void;
  actionLabel: string;
  secondaryAction?: () => void;
  secondaryLabel?: string;
}

export const RegistrationSuccess: React.FC<StatusProps> = ({ 
  title = "Registration Successful", 
  message = "The institution has been successfully registered and approved.", 
  onAction, 
  actionLabel = "View Institution" 
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8 animate-in fade-in zoom-in duration-300">
      <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6">
        <CheckCircle2 className="w-10 h-10 text-green-600 dark:text-green-400" />
      </div>
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3 tracking-tight">
        {title}
      </h2>
      <p className="text-gray-600 dark:text-gray-400 max-w-md mb-8 text-lg">
        {message}
      </p>
      <div className="flex gap-4">
        <button
          onClick={onAction}
          className="flex items-center gap-2 px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-600/20 hover:scale-105"
        >
          <span>{actionLabel}</span>
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
};

export const RegistrationRejected: React.FC<StatusProps> = ({ 
  title = "Registration Rejected", 
  message = "The registration could not be completed. Please review the information and try again.", 
  onAction, 
  actionLabel = "Try Again",
  secondaryAction,
  secondaryLabel = "Cancel"
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8 animate-in fade-in zoom-in duration-300">
      <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-6">
        <XCircle className="w-10 h-10 text-red-600 dark:text-red-400" />
      </div>
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3 tracking-tight">
        {title}
      </h2>
      <p className="text-gray-600 dark:text-gray-400 max-w-md mb-8 text-lg">
        {message}
      </p>
      <div className="flex gap-4">
        {secondaryAction && (
          <button
            onClick={secondaryAction}
            className="px-8 py-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-bold transition-all"
          >
            {secondaryLabel}
          </button>
        )}
        <button
          onClick={onAction}
          className="flex items-center gap-2 px-8 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-red-600/20 hover:scale-105"
        >
          <RefreshCcw size={20} />
          <span>{actionLabel}</span>
        </button>
      </div>
    </div>
  );
};
