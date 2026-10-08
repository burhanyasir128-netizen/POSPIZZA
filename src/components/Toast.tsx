import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, AlertCircle, AlertTriangle } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toastMessage } = useApp();

  if (!toastMessage) return null;

  const getBg = () => {
    switch (toastMessage.type) {
      case 'success': return 'bg-emerald-600 text-white';
      case 'error': return 'bg-rose-600 text-white';
      case 'warning': return 'bg-amber-600 text-white';
    }
  };

  const getIcon = () => {
    switch (toastMessage.type) {
      case 'success': return <CheckCircle2 className="w-5 h-5" />;
      case 'error': return <AlertCircle className="w-5 h-5" />;
      case 'warning': return <AlertTriangle className="w-5 h-5" />;
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-bounce duration-300">
      <div className={`flex items-center gap-3 px-5 py-3 rounded-xl shadow-2xl font-medium ${getBg()}`}>
        {getIcon()}
        <span>{toastMessage.text}</span>
      </div>
    </div>
  );
};
