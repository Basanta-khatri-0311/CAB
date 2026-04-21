import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-8 right-8 z-[9999] flex flex-col gap-3 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`
              pointer-events-auto min-w-[300px] px-6 py-4 rounded-2xl shadow-2xl border backdrop-blur-xl transition-all duration-500 animate-in slide-in-from-right-full
              ${toast.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
                toast.type === 'error' ? 'bg-red-500/10 border-red-500/20 text-red-400' :
                'bg-zinc-900 border-white/5 text-gray-200'}
            `}
          >
            <div className="flex items-center gap-3">
              <div className={`w-2 h-2 rounded-full ${
                toast.type === 'success' ? 'bg-emerald-500' :
                toast.type === 'error' ? 'bg-red-500' :
                'bg-brand'
              } animate-pulse`} />
              <p className="text-[11px] font-black uppercase tracking-widest">{toast.message}</p>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
