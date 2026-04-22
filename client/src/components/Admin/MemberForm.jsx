import { useState, useEffect } from "react";

const allRoles = [
  { group: "Leadership", options: ["President", "Vice President", "Treasurer", "Secretary", "Advisor", "Member", "Senior Player"] },
  { group: "Squad", options: ["Captain", "Vice Captain", "Wicket Keeper", "Player", "Batsman", "Bowler", "All-rounder",] },
  { group: "Support", options: ["Coach", "Staff", "Supporter"] }
];

const defaultForm = {
  name: "",
  email: "",
  phone: "",
  roleInClub: ["Member"],
  bio: "",
  password: "",
};

export default function MemberForm({ initialData, onSubmit, onClose }) {
  const [form, setForm] = useState(defaultForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name || "",
        email: initialData.email || "",
        phone: initialData.phone || "",
        roleInClub: Array.isArray(initialData.roleInClub) ? initialData.roleInClub : [initialData.roleInClub],
        bio: initialData.bio || "",
        password: "",
      });
    } else {
      setForm(defaultForm);
    }
  }, [initialData]);

  const toggleRole = (role) => {
    const current = [...form.roleInClub];
    if (current.includes(role)) {
      setForm({ ...form, roleInClub: current.filter(r => r !== role) });
    } else {
      setForm({ ...form, roleInClub: [...current, role] });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.roleInClub.length === 0) return alert("Please select at least one role.");
    setSaving(true);
    await onSubmit(form);
    setSaving(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-12 pb-6">

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

        {/* Left Side: General Info */}
        <div className="space-y-10">
          <div className="space-y-6">
            <div className="flex items-center gap-4 mb-2">
              <div className="w-1.5 h-6 bg-brand rounded-full" />
              <h4 className="text-[10px] font-black text-white uppercase tracking-[0.3em]">Member Credentials</h4>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest ml-4">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-[#0a0a0a] border border-white/5 rounded-2xl px-6 py-4 text-white font-black tracking-tight focus:border-brand/40 outline-none transition-all text-sm"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black text-gray-600 uppercase tracking-widest ml-4">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full bg-[#0a0a0a] border border-white/5 rounded-2xl px-6 py-4 text-white font-black focus:border-brand/40 outline-none transition-all text-sm disabled:opacity-30"
                  required
                  disabled={!!initialData}
                />
              </div>
              {!initialData && (
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-gray-600 uppercase tracking-widest ml-4">Password</label>
                  <input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className="w-full bg-[#0a0a0a] border border-white/5 rounded-2xl px-6 py-4 text-white font-black focus:border-brand/40 outline-none transition-all text-sm"
                    required
                  />
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-4 mb-2">
              <div className="w-1.5 h-6 bg-brand rounded-full" />
              <h4 className="text-[10px] font-black text-white uppercase tracking-[0.3em]">Contact & Bio</h4>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[9px] font-black text-gray-600 uppercase tracking-widest ml-4">Phone Number</label>
                <input
                  type="text"
                  name="phone"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full bg-[#0a0a0a] border border-white/5 rounded-2xl px-6 py-4 text-white font-black focus:border-brand/40 outline-none transition-all text-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black text-gray-600 uppercase tracking-widest ml-4">About Member</label>
                <textarea
                  name="bio"
                  value={form.bio}
                  onChange={(e) => setForm({ ...form, bio: e.target.value })}
                  className="w-full bg-[#0a0a0a] border border-white/5 rounded-[2.5rem] px-8 py-6 text-gray-400 font-medium focus:border-brand/40 outline-none transition-all text-sm min-h-[160px]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Role Selector */}
        <div className="space-y-10">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-1.5 h-6 bg-brand rounded-full" />
            <h4 className="text-[10px] font-black text-white uppercase tracking-[0.3em]">Official Assignments</h4>
          </div>

          <div className="bg-zinc-900/30 p-10 rounded-[3.5rem] border border-white/5 space-y-10">
            {allRoles.map(group => (
              <div key={group.group} className="space-y-5">
                <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest flex items-center gap-6">
                  {group.group}
                  <span className="h-[1px] flex-grow bg-white/5" />
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {group.options.map(role => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => toggleRole(role)}
                      className={`px-4 py-4 rounded-xl border text-[9px] font-black uppercase tracking-widest transition-all ${form.roleInClub.includes(role)
                        ? "bg-brand border-brand text-black shadow-xl shadow-brand/10 -translate-y-1"
                        : "bg-black/40 border-white/5 text-gray-600 hover:border-white/20 hover:text-white"
                        }`}
                    >
                      {role}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Global Form Actions */}
      <div className="flex gap-4 border-t border-white/5 pt-10">
        <button
          type="button"
          onClick={onClose}
          className="flex-grow bg-white/5 hover:bg-white/10 text-gray-500 font-black uppercase tracking-widest py-6 rounded-3xl text-[9px] transition-all"
        >
          Close Without Saving
        </button>
        <button
          type="submit"
          disabled={saving}
          className="flex-grow bg-brand hover:bg-brand-dark text-black font-black uppercase tracking-widest py-6 rounded-3xl text-[9px] transition-all shadow-2xl shadow-brand/20 disabled:opacity-50 active:scale-95"
        >
          {saving ? "Processing..." : initialData ? "Update Authorized Records" : "Confirm Provisioning"}
        </button>
      </div>
    </form>
  );
}
