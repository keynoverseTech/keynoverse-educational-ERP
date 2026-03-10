import React from 'react';
import { AlertTriangle, CheckCircle2, Info, X } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
  type?: 'danger' | 'success' | 'warning' | 'info';
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isLoading = false,
  type = 'info'
}) => {
  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case 'danger':
        return <AlertTriangle size={24} className="text-red-600 dark:text-red-500" />;
      case 'success':
        return <CheckCircle2 size={24} className="text-emerald-600 dark:text-emerald-500" />;
      case 'warning':
        return <AlertTriangle size={24} className="text-amber-600 dark:text-amber-500" />;
      default:
        return <Info size={24} className="text-blue-600 dark:text-blue-500" />;
    }
  };

  const getStyles = () => {
    switch (type) {
      case 'danger':
        return {
          iconBg: 'bg-red-100 dark:bg-red-900/30',
          buttonBg: 'bg-red-600 hover:bg-red-700 shadow-red-600/20',
          buttonText: 'text-white'
        };
      case 'success':
        return {
          iconBg: 'bg-emerald-100 dark:bg-emerald-900/30',
          buttonBg: 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20',
          buttonText: 'text-white'
        };
      case 'warning':
        return {
          iconBg: 'bg-amber-100 dark:bg-amber-900/30',
          buttonBg: 'bg-amber-600 hover:bg-amber-700 shadow-amber-600/20',
          buttonText: 'text-white'
        };
      default:
        return {
          iconBg: 'bg-blue-100 dark:bg-blue-900/30',
          buttonBg: 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/20',
          buttonText: 'text-white'
        };
    }
  };

  const styles = getStyles();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#1e293b] rounded-2xl shadow-2xl max-w-md w-full p-6 border border-gray-200 dark:border-gray-700 relative">
        <button 
          onClick={onClose}
          disabled={isLoading}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <X size={20} />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className={`p-4 rounded-full mb-4 ${styles.iconBg}`}>
            {getIcon()}
          </div>
          
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            {title}
          </h3>
          
          <p className="text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
            {message}
          </p>

          <div className="flex gap-3 w-full">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 px-4 py-2.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className={`flex-1 px-4 py-2.5 font-bold rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 ${styles.buttonBg} ${styles.buttonText} disabled:opacity-70 disabled:cursor-wait`}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Processing...
                </>
              ) : (
                confirmText
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
