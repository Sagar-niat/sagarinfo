import React from 'react';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';
import { useData } from '../../context/DataContext';

export const Toast: React.FC = () => {
  const { toast } = useData();

  if (!toast) return null;

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />;
      case 'info':
      default:
        return <Info className="w-4 h-4 text-indigo-400 shrink-0" />;
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl bg-slate-900/95 text-slate-100 border border-slate-700/80 shadow-2xl backdrop-blur-md animate-slide-up">
      {getIcon()}
      <span className="text-xs font-medium tracking-wide">{toast.text}</span>
    </div>
  );
};
