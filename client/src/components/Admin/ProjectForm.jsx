import { useState, useEffect } from "react";

const defaultForm = {
  title: "",
  description: "",
  estimatedBudget: "",
  status: "planning",
};

export default function ProjectForm({ initialData, onSubmit, onClose }) {
  const [form, setForm] = useState(defaultForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setForm(initialData
      ? {
          title: initialData.title || "",
          description: initialData.description || "",
          estimatedBudget: initialData.estimatedBudget || "",
          status: initialData.status || "planning",
        }
      : defaultForm
    );
  }, [initialData]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    await onSubmit(form);
    setSaving(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-4">Milestone Title</label>
        <input
          type="text"
          name="title"
          placeholder="e.g. Stadium Floodlights Installation"
          value={form.title}
          onChange={handleChange}
          className="w-full bg-black border border-white/10 rounded-xl px-6 py-4 text-white font-black tracking-tight focus:border-brand transition-colors text-sm"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-4">Objective Narrative</label>
        <textarea
          name="description"
          placeholder="Describe the milestone's goal..."
          value={form.description}
          onChange={handleChange}
          className="w-full bg-black border border-white/10 rounded-2xl px-6 py-4 text-gray-300 font-medium focus:border-brand transition-colors text-sm"
          rows="3"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-4">Est. Budget (NPR)</label>
          <input
            type="number"
            name="estimatedBudget"
            placeholder="500000"
            value={form.estimatedBudget}
            onChange={handleChange}
            className="w-full bg-black border border-white/10 rounded-xl px-6 py-4 text-white font-black focus:border-brand transition-colors text-sm"
            min="0"
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-4">Current Status</label>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="w-full bg-black border border-white/10 rounded-xl px-6 py-4 text-xs text-white uppercase tracking-widest font-black focus:border-brand transition-colors appearance-none"
          >
            <option value="planning">📋 Planning</option>
            <option value="ongoing">⚡ Ongoing</option>
            <option value="completed">✅ Completed</option>
          </select>
        </div>
      </div>

      <div className="flex gap-4 pt-4">
        <button 
          type="button" 
          onClick={onClose} 
          className="flex-grow bg-white/5 hover:bg-white/10 text-gray-500 font-black uppercase tracking-widest py-4 rounded-xl text-[10px] transition-all"
        >
          Abort
        </button>
        <button 
          type="submit" 
          disabled={saving}
          className="flex-grow bg-brand hover:bg-brand-dark text-black font-black uppercase tracking-widest py-4 rounded-xl text-[10px] transition-all shadow-lg shadow-brand/20 disabled:opacity-50"
        >
          {saving ? "Archiving..." : "Commit Milestone"}
        </button>
      </div>
    </form>
  );
}