import React, { createContext, useContext, useState, useCallback } from 'react';
import Modal from '../components/ui/Modal';

const ConfirmContext = createContext();

export const useConfirm = () => useContext(ConfirmContext);

export const ConfirmProvider = ({ children }) => {
  const [config, setConfig] = useState(null);

  const confirm = useCallback(({ title, message, onConfirm }) => {
    setConfig({ title, message, onConfirm });
  }, []);

  const close = () => setConfig(null);

  const handleConfirm = () => {
    if (config.onConfirm) config.onConfirm();
    close();
  };

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      <Modal 
        isOpen={!!config} 
        onClose={close} 
        title={config?.title || "Confirmation"}
      >
        <div className="space-y-8">
          <p className="text-gray-400 text-sm leading-relaxed font-medium">
            {config?.message}
          </p>
          <div className="flex gap-4">
            <button 
              onClick={close}
              className="flex-grow bg-white/5 hover:bg-white/10 text-gray-500 font-bold uppercase tracking-widest py-4 rounded-2xl text-[10px] transition-all"
            >
              Cancel
            </button>
            <button 
              onClick={handleConfirm}
              className="flex-grow bg-brand hover:bg-brand-dark text-black font-black uppercase tracking-widest py-4 rounded-2xl text-[10px] transition-all shadow-lg shadow-brand/20"
            >
              Confirm
            </button>
          </div>
        </div>
      </Modal>
    </ConfirmContext.Provider>
  );
};
