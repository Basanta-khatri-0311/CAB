import { useEffect } from "react";
import { createPortal } from "react-dom";

export default function Modal({ isOpen, onClose, title, children, wide = false, noPadding = false }) {
  useEffect(() => {
    const handleEsc = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-black/90 backdrop-blur-md">
      {/* Click outside to close */}
      <div className="absolute inset-0" onClick={onClose} />
      
      {/* Modal Container */}
      <div 
        className={`relative z-10 bg-[#080808] border border-white/5 rounded-[40px] w-full transition-all duration-500 shadow-[0_50px_100px_-20px_rgba(0,0,0,1)] flex flex-col animate-[zoomIn_0.4s_cubic-bezier(0.16,1,0.3,1)_both] ${
          wide ? 'max-w-5xl h-[90vh]' : 'max-w-[540px] max-h-[90vh]'
        }`}
      >
        {/* Header */}
        <div className="px-10 py-8 border-b border-white/5 flex justify-between items-center shrink-0">
          <h2 className="text-xl font-black text-white uppercase tracking-tighter">{title}</h2>
          <button 
            className="w-10 h-10 rounded-xl bg-black/40 border border-white/5 text-gray-400 text-sm flex items-center justify-center cursor-pointer transition-all hover:text-white hover:border-brand hover:scale-110 active:scale-95"
            onClick={onClose} 
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Content - Still scrollable internally ONLY if it exceeds max-height to prevent break on small screens */}
        <div className={`${noPadding ? '' : 'p-10'} flex-grow overflow-y-auto custom-scrollbar`}>
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
}