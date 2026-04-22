import { optimizeCloudinaryUrl } from '../utils/cloudinary';
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";
import Footer from "../components/Footer";
import heroBg from "../assets/hero-bg.webp";

export default function Home() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const res = await API.get("/public/home");
        setData(res.data);
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchHomeData();
  }, []);

  const isLoggedIn = !!localStorage.getItem("token");

  // Hero section is static and can be rendered immediately
  const Hero = (
    <section className="relative h-[90vh] flex items-center justify-center overflow-hidden border-b border-white/5">
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black z-10" />
      <img 
        src={heroBg} 
        alt="Cricket Stadium" 
        className="absolute inset-0 w-full h-full object-cover scale-105"
        fetchPriority="high"
      />
      
      <div className="relative z-20 max-w-5xl mx-auto px-6 text-center">
        <span className="inline-block px-4 py-1.5 rounded-full bg-brand/10 border border-brand/20 text-brand text-[10px] font-bold tracking-[0.2em] uppercase mb-6">
          Official Bhaluhi Cricket Portal
        </span>
        <h1 className="text-4xl sm:text-6xl md:text-8xl font-black text-white tracking-tighter mb-6 leading-tight md:leading-none uppercase">
          Cricket Association of<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand to-yellow-500">Bhaluhi</span>
        </h1>
        <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
          Check our club's funding, meet the team members, and stay updated with the latest news.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {!isLoggedIn ? (
            <>
               <Link to="/register" className="bg-brand hover:bg-brand-dark text-black px-10 py-4 rounded-full font-bold transition-all transform hover:scale-105 shadow-xl shadow-brand/20 uppercase tracking-widest text-xs">
                  Join The Club
               </Link>
               <Link to="/login" className="bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 text-white px-10 py-4 rounded-full font-bold transition-all transform hover:scale-105 uppercase tracking-widest text-xs">
                  Member Login
               </Link>
            </>
          ) : (
            <>
               <Link to="/projects" className="bg-brand hover:bg-brand-dark text-black px-10 py-4 rounded-full font-bold transition-all transform hover:scale-105 shadow-xl shadow-brand/20 uppercase tracking-widest text-xs">
                  View Milestones
               </Link>
               <Link to="/posts" className="bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 text-white px-10 py-4 rounded-full font-bold transition-all transform hover:scale-105 uppercase tracking-widest text-xs">
                  Read Newsroom
               </Link>
            </>
          )}
        </div>
      </div>
    </section>
  );

  if (loading) {
    return (
      <div className="bg-black text-gray-200 min-h-screen">
        {Hero}
        <div className="max-w-7xl mx-auto px-6 py-24 space-y-32 animate-pulse min-h-[200vh]">
          {/* Finance Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-48 bg-white/5 rounded-[2.5rem] border border-white/5"></div>
            ))}
          </div>
          {/* Members Skeleton */}
          <div className="space-y-12">
            <div className="h-8 w-64 bg-white/5 rounded-full"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="aspect-[4/5] bg-white/5 rounded-[3rem] border border-white/5"></div>
              ))}
            </div>
          </div>
          {/* Projects Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-[400px] bg-white/5 rounded-[3.5rem] border border-white/5"></div>
            ))}
          </div>
          {/* Newsroom Skeleton */}
          <div className="max-w-5xl mx-auto space-y-8">
            <div className="h-8 w-48 bg-white/5 rounded-full mx-auto mb-12"></div>
            {[1, 2].map(i => (
              <div key={i} className="h-64 bg-white/5 rounded-[4rem] border border-white/5"></div>
            ))}
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-black text-gray-200 min-h-screen">
        {Hero}
        <div className="py-24 max-w-7xl mx-auto px-6 text-center">
          <div className="p-8 border border-red-900/30 bg-red-900/10 rounded-3xl inline-block">
            <p className="text-red-500 font-bold">Unable to reach the server.</p>
            <button onClick={() => window.location.reload()} className="mt-4 text-sm text-gray-400 underline uppercase tracking-widest font-black">Try Reconnecting</button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const { stats, members, posts, projects } = data;

  const committeeRoles = ["President", "Vice President", "Treasurer", "Secretary", "Advisor", "Member", "Senior Player"];
  const squadRoles = ["Captain", "Vice Captain", "Wicket Keeper", "Player", "Batsman", "Bowler", "All-rounder"];
  const supportRoles = ["Coach", "Staff", "Supporter"];

  const committee = members.filter(m => {
    const roles = Array.isArray(m.roleInClub) ? m.roleInClub : [m.roleInClub];
    return roles.some(role => committeeRoles.includes(role));
  });

  const squad = members.filter(m => {
    const roles = Array.isArray(m.roleInClub) ? m.roleInClub : [m.roleInClub];
    return roles.some(role => squadRoles.includes(role));
  });

  const support = members.filter(m => {
    const roles = Array.isArray(m.roleInClub) ? m.roleInClub : [m.roleInClub];
    return roles.some(role => supportRoles.includes(role));
  });

  return (
    <div className="bg-black text-gray-200 min-h-screen">
      {Hero}

      {/* Financial Section */}
      <section className="py-24 max-w-7xl mx-auto px-6 font-sans">
        <div className="text-center mb-16">
          <span className="section-eyebrow">Money Report</span>
          <h2 className="text-4xl font-black text-white tracking-tight uppercase">Club Finances</h2>
          <div className="w-20 h-1 bg-brand mx-auto mt-4 rounded-full" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { label: "Total Income", value: stats.totalIncome, color: "text-emerald-500", bg: "bg-emerald-500/5", border: "border-emerald-500/20" },
            { label: "Total Expenses", value: stats.totalExpense, color: "text-red-500", bg: "bg-red-500/5", border: "border-red-500/20" },
            { label: "Current Balance", value: stats.balance, color: "text-brand", bg: "bg-brand/5", border: "border-brand/20" },
          ].map((stat, i) => (
            <div key={i} className={`p-6 md:p-8 rounded-[2.5rem] border ${stat.bg} ${stat.border} backdrop-blur-sm group hover:border-white/10 transition-all shadow-2xl`}>
              <p className="text-[10px] uppercase tracking-widest text-gray-300 font-black mb-2">Official Ledger: {stat.label}</p>
              <p className={`text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter ${stat.color}`}>
                NPR {stat.value.toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Board Members Marquee ── */}
      <section className="py-24 bg-white/[0.02] border-t border-white/5 overflow-hidden font-sans">
        <div className="max-w-7xl mx-auto px-6 mb-12 flex flex-col md:flex-row justify-between items-end gap-6">
           <div className="text-left">
              <span className="section-eyebrow uppercase">Governance</span>
              <h2 className="text-4xl font-black text-white tracking-tighter uppercase underline decoration-brand/30 underline-offset-8">Board Members</h2>
           </div>
           <Link to="/members" className="text-brand text-xs font-black uppercase tracking-widest hover:underline underline-offset-8">All Profiles →</Link>
        </div>

        <div className="relative flex overflow-hidden group">
          <div className="flex animate-marquee-right whitespace-nowrap gap-8 py-4">
            {[...committee, ...committee].map((member, i) => (
              <div key={`${member._id}-${i}`} className="w-[300px] flex-shrink-0 transition-opacity hover:opacity-100 group-hover:opacity-50">
                 <MemberSmallCard member={member} />
              </div>
            ))}
          </div>
          <div className="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-black to-transparent z-10" />
          <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-black to-transparent z-10" />
        </div>
      </section>

      {/* ── Squad Marquee ── */}
      <section className="py-24 bg-black border-y border-white/5 overflow-hidden font-sans">
        <div className="max-w-7xl mx-auto px-6 mb-12 flex flex-col md:flex-row justify-between items-end gap-6">
           <div className="text-left">
              <span className="section-eyebrow uppercase">The Athletes</span>
              <h2 className="text-4xl font-black text-white tracking-tighter uppercase underline decoration-brand/30 underline-offset-8">The Squad</h2>
           </div>
           <Link to="/members" className="text-brand text-xs font-black uppercase tracking-widest hover:underline underline-offset-8">View Roster →</Link>
        </div>

        <div className="relative flex overflow-hidden group">
          <div className="flex animate-marquee-left whitespace-nowrap gap-8 py-4">
            {[...squad, ...squad].map((member, i) => (
              <div key={`${member._id}-${i}`} className="w-[300px] flex-shrink-0 transition-opacity hover:opacity-100 group-hover:opacity-50">
                 <MemberSmallCard member={member} />
              </div>
            ))}
          </div>
          <div className="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-black to-transparent z-10" />
          <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-black to-transparent z-10" />
        </div>
      </section>

      {/* ── Support Marquee ── */}
      {support.length > 0 && (
        <section className="py-24 bg-white/[0.02] border-b border-white/5 overflow-hidden font-sans">
          <div className="max-w-7xl mx-auto px-6 mb-12 flex flex-col md:flex-row justify-between items-end gap-6">
             <div className="text-left">
                <span className="section-eyebrow uppercase">Backbone</span>
                <h2 className="text-4xl font-black text-white tracking-tighter uppercase underline decoration-brand/30 underline-offset-8">Support & Staff</h2>
             </div>
             <Link to="/members" className="text-brand text-xs font-black uppercase tracking-widest hover:underline underline-offset-8">All Profiles →</Link>
          </div>

          <div className="relative flex overflow-hidden group">
            <div className="flex animate-marquee-right whitespace-nowrap gap-8 py-4">
              {[...support, ...support].map((member, i) => (
                <div key={`${member._id}-${i}`} className="w-[300px] flex-shrink-0 transition-opacity hover:opacity-100 group-hover:opacity-50">
                   <MemberSmallCard member={member} />
                </div>
              ))}
            </div>
            <div className="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-black to-transparent z-10" />
            <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-black to-transparent z-10" />
          </div>
        </section>
      )}

      {/* Projects */}
      <section className="py-24 max-w-7xl mx-auto px-6 font-sans">
        <div className="text-center mb-16">
          <span className="section-eyebrow">Initiatives</span>
          <h2 className="text-4xl font-black text-white uppercase">Recent Activity</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {projects.slice(0, 3).map((project) => (
            <div key={project._id} className="p-6 md:p-10 rounded-[3rem] bg-zinc-900/50 border border-white/5 hover:border-brand/30 transition-all shadow-xl flex flex-col justify-between group">
              <div>
                <div className="flex justify-between items-start mb-6">
                  <h3 className="text-2xl font-black text-white leading-tight pr-4 tracking-tighter group-hover:text-brand transition-colors">{project.title}</h3>
                  <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border shrink-0 ${
                    project.status === 'completed' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' :
                    project.status === 'ongoing' ? 'bg-blue-500/10 border-blue-500/20 text-blue-500' :
                    'bg-zinc-500/10 border-zinc-500/20 text-zinc-500'
                  }`}>
                    {project.status}
                  </span>
                </div>
                <p className="text-gray-300 text-sm mb-10 line-clamp-3 leading-relaxed">{project.description}</p>
              </div>
              <div className="flex justify-between items-end border-t border-white/5 pt-8">
                <div>
                  <p className="text-[10px] text-gray-400 uppercase tracking-[0.2em] mb-2 font-black">Allocation</p>
                  <p className="text-brand font-black text-xl tracking-tighter">NPR {project.estimatedBudget?.toLocaleString() || 0}</p>
                </div>
                <Link to="/projects" className="text-[9px] font-black text-white hover:underline underline-offset-4 uppercase tracking-widest">View More →</Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* News Feed */}
      <section className="py-24 bg-[#050505] border-t border-white/5 font-sans">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="section-eyebrow">Newsroom</span>
            <h2 className="text-4xl font-black text-white uppercase underline decoration-brand/20 underline-offset-8">Latest Updates</h2>
          </div>
          <div className="space-y-8">
            {posts.map((post) => (
              <Link to="/posts" key={post._id} className="block group">
                <article className="flex flex-col md:flex-row gap-8 items-center bg-black/40 p-6 md:p-8 rounded-[2.5rem] md:rounded-[3.5rem] border border-white/5 hover:border-brand/30 transition-all shadow-2xl">
                  {post.image && (
                    <div className="w-full md:w-64 h-48 rounded-[2rem] overflow-hidden flex-shrink-0 relative">
                      <img src={optimizeCloudinaryUrl(post.image, 600)} alt={post.title} className="w-full h-full object-cover grayscale-0" loading="lazy" />
                      <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-all" />
                    </div>
                  )}
                  <div className="flex-grow">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-[10px] text-gray-400 font-black tracking-widest uppercase">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </span>
                      <span className="w-1.5 h-1.5 rounded-full bg-brand/30" />
                      <span className="text-[10px] text-brand font-black tracking-widest uppercase tracking-[0.2em]">Official Archive</span>
                    </div>
                    <h3 className="text-3xl font-black text-white mb-6 leading-tight group-hover:text-brand transition-colors tracking-tighter">{post.title}</h3>
                    <p className="text-gray-300 text-sm mb-0 line-clamp-2 leading-relaxed">{post.content}</p>
                  </div>
                  <div className="hidden md:flex items-center justify-center w-14 h-14 rounded-full border border-white/5 group-hover:border-brand/40 group-hover:text-brand transition-all text-xl">
                    →
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}

function MemberSmallCard({ member }) {
  const roles = Array.isArray(member.roleInClub) ? member.roleInClub : [member.roleInClub];
  
  return (
    <div className="group relative bg-[#080808] rounded-[3rem] overflow-hidden border border-white/5 hover:border-brand/40 transition-all shadow-xl">
      <div className="aspect-[4/5] overflow-hidden">
        {member.photo ? (
          <img src={optimizeCloudinaryUrl(member.photo, 800)} alt={member.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" />
        ) : (
          <div className="flex items-center justify-center h-full text-brand text-7xl font-black bg-black">
            {member.name.charAt(0)}
          </div>
        )}
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-90" />
      <div className="absolute bottom-0 left-0 right-0 p-10">
        <div className="flex flex-wrap gap-2 mb-4">
           {roles.map(role => (
              <span key={role} className="text-brand text-[8px] font-black uppercase tracking-widest border border-brand/40 px-3 py-1 rounded-full bg-brand/5">
                {role}
              </span>
           ))}
        </div>
        <h3 className="text-2xl font-black text-white mb-2 tracking-tighter">{member.name}</h3>
        <p className="text-gray-300 text-[11px] line-clamp-2 font-medium leading-relaxed uppercase tracking-wide">{member.bio}</p>
      </div>
    </div>
  );
}