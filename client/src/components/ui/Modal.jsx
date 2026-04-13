import { useEffect } from "react";
import { createPortal } from "react-dom";

export default function Modal({ isOpen, onClose, title, children }) {
  useEffect(() => {
    const handleEsc = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  // Prevent body scroll when open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[1000] flex items-start justify-center py-[60px] px-6 overflow-y-auto">
      <div className="fixed inset-0 bg-black/90 backdrop-blur-md" onClick={onClose} />
      <div className="relative z-10 bg-[#080808] border border-[#1f1f1f] rounded-[24px] w-full max-w-[540px] p-10 shadow-[0_40px_100px_rgba(0,0,0,0.9)] mb-[60px] animate-[fadeUp_0.35s_cubic-bezier(0.16,1,0.3,1)_both]">
        <div className="flex justify-between items-center mb-7">
          <h2 className="text-[20px] font-bold text-white">{title}</h2>
          <button 
            className="w-8 h-8 rounded-lg bg-[#111] border border-[#1f1f1f] text-[#6b7280] text-sm flex items-center justify-center cursor-pointer transition-all hover:text-white hover:border-[#d97706]"
            onClick={onClose} 
            aria-label="Close"
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>,
    document.body
  );
}