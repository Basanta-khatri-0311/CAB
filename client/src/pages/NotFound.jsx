import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-6 text-center">
      <div className="relative mb-12">
        <h1 className="text-[12rem] md:text-[18rem] font-black text-white/5 tracking-tighter leading-none select-none">
          404
        </h1>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
           <span className="text-brand text-6xl md:text-8xl font-black mb-4 animate-bounce">🏏</span>
           <p className="text-white text-xl md:text-3xl font-black uppercase tracking-tighter">Out of Bounds</p>
        </div>
      </div>
      
      <div className="max-w-md">
        <h2 className="text-white text-lg font-bold mb-4 uppercase tracking-widest">Page Not Found</h2>
        <p className="text-gray-400 text-sm mb-10 leading-relaxed font-medium">
          The page you are looking for has been retired from the field. 
          It either moved, changed its name, or was never part of the squad.
        </p>
        
        <Link 
          to="/" 
          className="inline-block bg-brand hover:bg-brand-dark text-black px-10 py-4 rounded-full font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-brand/20 transition-all hover:scale-105 active:scale-95"
        >
          Return to Arena
        </Link>
      </div>
      
      <div className="mt-20 flex gap-8 items-center opacity-20 filter grayscale">
         <span className="text-white text-[10px] font-black uppercase tracking-widest leading-loose">Official Archive</span>
         <div className="w-1.5 h-1.5 rounded-full bg-brand" />
         <span className="text-white text-[10px] font-black uppercase tracking-widest leading-loose">Bhaluhi District</span>
      </div>
    </div>
  );
}

