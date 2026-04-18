import { useState, useEffect } from "react";
import API from "../api/axios";

export default function Members() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMembers = async () => {
    try {
      const res = await API.get("/public/members");
      setMembers(res.data);
    } catch (error) {
      console.error("Error fetching members:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const committeeRoles = ["President", "Vice President", "Treasurer", "Secretary", "Senior Player", "Advisor"];
  const squadRoles = ["Captain", "Vice Captain", "Wicket Keeper", "Player"];

  // Members can appear in multiple lists if they have multiple roles
  const committee = members.filter(m => {
    const roles = Array.isArray(m.roleInClub) ? m.roleInClub : [m.roleInClub];
    return roles.some(r => committeeRoles.includes(r));
  });

  const squad = members.filter(m => {
    const roles = Array.isArray(m.roleInClub) ? m.roleInClub : [m.roleInClub];
    return roles.some(r => squadRoles.includes(r));
  });

  const others = members.filter(m => {
    const roles = Array.isArray(m.roleInClub) ? m.roleInClub : [m.roleInClub];
    return !roles.some(r => committeeRoles.includes(r)) && !roles.some(r => squadRoles.includes(r));
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-black">
        <div className="w-12 h-12 border-4 border-brand border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-xs font-bold tracking-widest text-gray-500 uppercase">Assembling Directory</p>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen text-gray-200 pb-20">
      <div className="max-w-7xl mx-auto px-6 pt-32 text-center">
        <header className="mb-24">
          <span className="section-eyebrow tracking-[0.3em]">The Association</span>
          <h1 className="text-6xl md:text-7xl font-black text-white tracking-tighter mb-8 uppercase">Club Members</h1>
          <p className="text-gray-500 max-w-xl mx-auto text-sm leading-relaxed font-medium">
            Leadership and athletes united. View our committee board and current playing squad.
          </p>
        </header>

        {/* Committee Section */}
        {committee.length > 0 && (
          <div className="mb-40">
            <div className="text-left mb-16 border-l-4 border-brand pl-8">
               <h2 className="text-4xl font-black text-white uppercase tracking-tighter">The Committee</h2>
               <p className="text-gray-500 text-sm mt-2 font-medium">Board members and strategic leadership of the association.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              {committee.map((member) => <MemberCard key={member._id} member={member} />)}
            </div>
          </div>
        )}

        {/* Squad Section */}
        {squad.length > 0 && (
          <div className="mb-40">
            <div className="text-left mb-16 border-l-4 border-purple-500 pl-8">
               <h2 className="text-4xl font-black text-white uppercase tracking-tighter">The Squad</h2>
               <p className="text-gray-500 text-sm mt-2 font-medium">Our cricketers bringing prestige to Bhaluhi on the field.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              {squad.map((member) => <MemberCard key={member._id} member={member} />)}
            </div>
          </div>
        )}

        {/* Others Section */}
        {others.length > 0 && (
          <div>
            <div className="text-left mb-16 border-l-4 border-zinc-800 pl-8">
               <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Support & Staff</h2>
               <p className="text-gray-500 text-sm mt-2">The backbone of our association operations.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {others.map((member) => (
                <div key={member._id} className="bg-zinc-900/30 border border-white/5 rounded-[2.5rem] p-8 text-center hover:border-brand/40 transition-all shadow-xl group">
                   <div className="flex flex-wrap gap-1 justify-center mb-4">
                      {(Array.isArray(member.roleInClub) ? member.roleInClub : [member.roleInClub]).map(r => (
                        <span key={r} className="text-brand text-[8px] font-black uppercase tracking-widest px-2 py-0.5 border border-brand/20 rounded-full bg-brand/5">
                          {r}
                        </span>
                      ))}
                   </div>
                   <p className="text-white text-xl font-black tracking-tight group-hover:text-brand transition-colors">{member.name}</p>
                   <p className="text-gray-600 text-[10px] mt-2 font-medium">Active Member</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {members.length === 0 && (
          <div className="py-40 text-center">
             <p className="text-gray-700 font-black tracking-[0.2em] uppercase text-xs animate-pulse underline decoration-brand underline-offset-8">No members found in directory</p>
          </div>
        )}
      </div>
    </div>
  );
}

function MemberCard({ member }) {
  const roles = Array.isArray(member.roleInClub) ? member.roleInClub : [member.roleInClub];

  return (
    <div className="group bg-zinc-900/40 border border-white/5 rounded-[4rem] p-12 flex flex-col items-center relative overflow-hidden transition-all duration-700 hover:border-brand/40 hover:-translate-y-3 shadow-2xl">
      <div className="absolute top-0 left-0 w-32 h-32 bg-brand/5 blur-3xl rounded-full" />
      
      <div className="relative mb-10">
        <div className="w-40 h-40 rounded-full bg-black border-4 border-brand/10 group-hover:border-brand/60 transition-all duration-700 shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden">
          {member.photo ? (
            <img src={member.photo} alt={member.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 transform group-hover:scale-110" />
          ) : (
            <div className="flex items-center justify-center h-full text-brand text-6xl font-black">
              {member.name.charAt(0)}
            </div>
          )}
        </div>
        {member.role === 'admin' ? (
           <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-purple-600 text-white flex items-center justify-center rounded-full text-2xl font-black shadow-xl shadow-purple-600/40 border-4 border-black group-hover:rotate-12 transition-transform">
            ◈
          </div>
        ) : (
          <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-brand text-black flex items-center justify-center rounded-full text-2xl font-black shadow-xl shadow-brand/40 border-4 border-black group-hover:rotate-12 transition-transform">
            🏏
          </div>
        )}
      </div>

      <div className="text-center flex-grow">
        <div className="flex flex-wrap gap-1 justify-center mb-6">
           {roles.map(role => (
              <span key={role} className="text-[9px] font-black uppercase tracking-widest text-brand border border-brand/30 px-3 py-1 rounded-full bg-brand/5">
                {role}
              </span>
           ))}
        </div>
        <h3 className="text-3xl font-black text-white mb-6 tracking-tighter group-hover:text-brand transition-colors leading-tight uppercase">{member.name}</h3>
        <p className="text-gray-500 text-sm font-medium leading-relaxed line-clamp-3 px-4">
          {member.bio || "Key association contributor and dedicated member our community."}
        </p>
      </div>

      <div className="mt-12 pt-10 border-t border-white/5 w-full flex justify-between items-center px-6">
        <div className="text-left">
          <p className="text-[9px] font-bold text-gray-600 uppercase tracking-widest mb-1">Joined Association</p>
          <p className="text-white text-xs font-black font-mono tracking-tighter">
            {new Date(member.createdAt).toLocaleDateString(undefined, { month: 'short', year: 'numeric' }).toUpperCase()}
          </p>
        </div>
        <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest border border-white/10 px-4 py-1.5 rounded-full group-hover:text-white group-hover:border-brand/40 transition-all cursor-pointer">
          Dossier →
        </div>
      </div>
    </div>
  );
}
